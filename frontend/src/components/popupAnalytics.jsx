import React, { useMemo, useState } from 'react';
import { X, TrendingUp, MessageCircle, Heart, Eye, Share2, User, Calendar, BarChart3, MessageSquare, Loader2 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { replyToComment } from '../utils/api';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Updated StatCard to match the theme
const StatCard = ({ icon: Icon, title, value, color }) => (
  <div style={{
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: '1',
    minWidth: '200px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
  }}>
    <div style={{
      backgroundColor: `${color}15`,
      padding: '12px',
      borderRadius: '12px',
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <div>
      <h3 style={{ margin: '0 0 2px 0', fontSize: '22px', fontWeight: '700', color: '#1e293b', fontFamily: "'Poppins', sans-serif" }}>{value}</h3>
      <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</p>
    </div>
  </div>
);

// Updated ChartContainer to match the theme
const ChartContainer = ({ title, data, dataKey, color }) => {
  const chartData = {
    labels: data.map((item) => item.day),
    datasets: [
      {
        label: title.replace('📈 ', '').replace('💬 ', ''),
        data: data.map((item) => item[dataKey]),
        backgroundColor: color,
        borderRadius: 6,
        hoverBackgroundColor: `${color}CC`,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: title,
        color: '#1e293b',
        align: 'start',
        font: { family: "'Poppins', sans-serif", size: 16, weight: '700' },
        padding: { bottom: 20 }
      },
    },
    scales: {
      y: { grid: { color: '#f1f5f9' }, border: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11 } } },
    },
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #e2e8f0',
      height: '300px'
    }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default function PopupAnalytics({ post, onClose, onCommentUpdate }) {
  const [analytics, setAnalytics] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyCommentId, setReplyCommentId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const mockAnalytics = useMemo(() => {
    if (!post) return null;
    const likes = post.like || 0;
    const comments = post.comments?.length || 0;
    const initialAnalytics = {
      likes,
      comments,
      views: post.viewCount || 0,
      shares: post.shareCount || 0,
      engagementRate: likes > 0 ? ((likes + comments) / (likes * 12) * 100).toFixed(1) : 0,
      likesOverTime: [],
      commentsOverTime: [],
      recentComments: post.comments?.map(comment => ({
        id: comment._id || `mock-comment-${Date.now()}-${Math.random()}`,
        author: comment.user?.user || post.user?.user || post.email || 'Unknown',
        comment: comment.value || '',
        time: comment.createdAt ? new Date(comment.createdAt).toLocaleString() : new Date().toLocaleString(),
        status: comment.status || 'pending',
        replies: comment.reply || [],
      })) || [],
    };
    setAnalytics(initialAnalytics);
    return initialAnalytics;
  }, [post]);

  const handleCommentAction = async (commentId, action) => {
    setError(null);
    setIsLoading(true);
    try {
      let response;
      if (action === 'reply') {
        if (!replyText.trim()) { setError('Please enter a reply.'); setIsLoading(false); return; }
        response = await replyToComment(commentId, post._id, replyText.trim(), 'admin-user-id');
      } else {
        response = await api.post(`/blog/comments/${action}`, { commentId, blogId: post._id });
      }

      setAnalytics(prev => {
        if (action === 'delete') {
          return {
            ...prev,
            comments: prev.comments - 1,
            commentsOverTime: prev.commentsOverTime.map(item => ({
              ...item,
              comments: item.day === 'Sun' ? Math.max(item.comments - 1, 0) : item.comments,
            })),
            recentComments: prev.recentComments.filter(comment => comment.id !== commentId),
          };
        } else {
          return {
            ...prev,
            recentComments: prev.recentComments.map(comment =>
              comment.id === commentId
                ? {
                  ...comment,
                  status: action === 'approve' ? 'approved' : action === 'flag' ? 'flagged' : comment.status,
                  replies: action === 'reply' ? [...comment.replies, {
                    id: response.data.comment?._id || `mock-reply-${Date.now()}`,
                    user: { user: 'Admin' },
                    value: replyText,
                    liked: false,
                    disliked: false,
                  }] : comment.replies,
                }
                : comment
            ),
            comments: action === 'reply' ? prev.comments + 1 : prev.comments,
            commentsOverTime: action === 'reply'
              ? prev.commentsOverTime.map(item => ({
                ...item,
                comments: item.day === 'Sun' ? item.comments + 1 : item.comments,
              }))
              : prev.commentsOverTime,
          };
        }
      });

      if (action !== 'delete') {
        onCommentUpdate(post._id, response.data.comment ? [response.data.comment] : post.comments);
      } else {
        onCommentUpdate(post._id, post.comments.filter(c => c._id !== commentId));
      }

      setReplyText('');
      setReplyCommentId(null);
    } catch (err) {
      setError(`Failed to ${action} comment: ${err.response?.data?.error || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!post || !analytics) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        padding: '20px',
        fontFamily: "'Poppins', sans-serif",
        backdropFilter: 'blur(6px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{
          backgroundColor: '#f8fafc',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '92vh',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header Section */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '24px 32px',
          borderBottom: '1px solid #f1f5f9',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '4px' }}>
                <BarChart3 size={18} strokeWidth={2.5} />
                <span style={{ fontWeight: '700', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Post Analytics</span>
              </div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#1e293b' }}>{post.title}</h2>
              <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                  <User size={14} /> {post.user?.user || 'Unknown Author'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                  <Calendar size={14} /> {new Date(post.date).toLocaleDateString()}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#64748b'; }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="custom-scrollbar" style={{ padding: '32px', overflowY: 'auto', flex: 1 }}>
          {error && <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #fee2e2', fontSize: '14px' }}>{error}</div>}

          {/* Stats Grid */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' }}>
            <StatCard icon={Heart} title="Total Likes" value={analytics.likes} color="#3b82f6" />
            <StatCard icon={MessageCircle} title="Comments" value={analytics.comments} color="#10b981" />
            <StatCard icon={Eye} title="Total Views" value={analytics.views} color="#8b5cf6" />
            <StatCard icon={Share2} title="Shares" value={analytics.shares} color="#f59e0b" />
            <StatCard icon={TrendingUp} title="Engagement" value={`${analytics.engagementRate}%`} color="#10b981" />
          </div>

          {/* Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            <ChartContainer title="Like Trends" data={analytics.likesOverTime} dataKey="likes" color="#3b82f6" />
            <ChartContainer title="Comment Activity" data={analytics.commentsOverTime} dataKey="comments" color="#10b981" />
          </div>

          {/* Comments Management Section */}
          <div style={{ backgroundColor: '#FFFFFF', padding: '24px', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <MessageSquare size={20} color="#1e293b" strokeWidth={2.5} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Content Moderation</h3>
            </div>

            {replyCommentId && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ marginBottom: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your official response..."
                  style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '14px', minHeight: '80px', outline: 'none', fontFamily: "'Poppins', sans-serif" }}
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                  <button onClick={() => handleCommentAction(replyCommentId, 'reply')} disabled={isLoading} style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                    {isLoading ? 'Sending...' : 'Post Reply'}
                  </button>
                  <button onClick={() => { setReplyText(''); setReplyCommentId(null); }} style={{ backgroundColor: '#fff', color: '#64748b', border: '1px solid #e2e8f0', padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analytics.recentComments.map(comment => (
                <div key={comment.id} style={{ padding: '20px', borderRadius: '16px', border: '1px solid #f1f5f9', backgroundColor: comment.status === 'flagged' ? '#fef2f2' : '#fff', transition: 'all 0.2s' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>{comment.author}</span>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '6px', fontWeight: '800', textTransform: 'uppercase', backgroundColor: comment.status === 'approved' ? '#dcfce7' : comment.status === 'pending' ? '#dbeafe' : '#fee2e2', color: comment.status === 'approved' ? '#166534' : comment.status === 'pending' ? '#1e40af' : '#991b1b' }}>{comment.status}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{comment.time}</span>
                  </div>
                  <p style={{ margin: '0 0 16px 0', color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>{comment.comment}</p>
                  
                  {comment.replies.length > 0 && (
                    <div style={{ marginLeft: '16px', paddingLeft: '16px', borderLeft: '2px solid #e2e8f0', marginBottom: '16px' }}>
                      {comment.replies.map(reply => (
                        <div key={reply._id || reply.id} style={{ marginBottom: '8px' }}>
                          <span style={{ fontWeight: '700', fontSize: '13px', color: '#3b82f6' }}>Admin Response:</span>
                          <p style={{ margin: '2px 0', color: '#64748b', fontSize: '13px' }}>{reply.value}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleCommentAction(comment.id, 'approve')} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#f0fdf4', color: '#166534', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Approve</button>
                    <button onClick={() => setReplyCommentId(comment.id)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#fff', color: '#1e293b', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Reply</button>
                    <button onClick={() => handleCommentAction(comment.id, 'flag')} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#fff7ed', color: '#9a3412', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Spam</button>
                    <button onClick={() => handleCommentAction(comment.id, 'delete')} style={{ padding: '6px 14px', borderRadius: '8px', border: 'none', backgroundColor: '#fef2f2', color: '#991b1b', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Poppins', sans-serif" }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255, 255, 255, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, backdropFilter: 'blur(2px)' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: '#3b82f6' }} />
          </div>
        )}
      </motion.div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}