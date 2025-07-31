import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { X, TrendingUp, MessageCircle, Heart, Eye, Share2 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { replyToComment } from '../utils/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
  <div style={{
    backgroundColor: bgColor,
    padding: '20px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
    minWidth: '180px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
    border: '1px solid #D5DBDB',
  }}>
    <div style={{
      backgroundColor: color,
      padding: '12px',
      borderRadius: '10px',
      color: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Icon size={24} />
    </div>
    <div>
      <h3 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#2C3E50' }}>{value}</h3>
      <p style={{ margin: 0, fontSize: '13px', color: '#7F8C8D', fontWeight: '500', fontFamily: "'Poppins', sans-serif" }}>{title}</p>
    </div>
  </div>
);

const ChartContainer = ({ title, data, dataKey, color }) => {
  const chartData = {
    labels: data.map((item) => item.day),
    datasets: [
      {
        label: title.replace('📈 ', '').replace('💬 ', ''),
        data: data.map((item) => item[dataKey]),
        backgroundColor: color,
        borderColor: color,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: title,
        color: '#2C3E50',
        font: { family: "'Poppins', sans-serif", size: 16 },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#7F8C8D' } },
      x: { ticks: { color: '#7F8C8D' } },
    },
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      border: '1px solid #D5DBDB',
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
      views: Math.floor(likes * 12),
      shares: Math.floor(likes * 0.3),
      engagementRate: likes > 0 ? ((likes + comments) / (likes * 12) * 100).toFixed(1) : 0,
      likesOverTime: [
        { day: 'Mon', likes: Math.floor(likes * 0.1) },
        { day: 'Tue', likes: Math.floor(likes * 0.25) },
        { day: 'Wed', likes: Math.floor(likes * 0.45) },
        { day: 'Thu', likes: Math.floor(likes * 0.7) },
        { day: 'Fri', likes: Math.floor(likes * 0.85) },
        { day: 'Sat', likes: Math.floor(likes * 0.95) },
        { day: 'Sun', likes },
      ],
      commentsOverTime: [
        { day: 'Mon', comments: Math.floor(comments * 0.15) },
        { day: 'Tue', comments: Math.floor(comments * 0.3) },
        { day: 'Wed', comments: Math.floor(comments * 0.5) },
        { day: 'Thu', comments: Math.floor(comments * 0.65) },
        { day: 'Fri', comments: Math.floor(comments * 0.8) },
        { day: 'Sat', comments: Math.floor(comments * 0.9) },
        { day: 'Sun', comments },
      ],
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
        if (!replyText.trim()) {
          setError('Please enter a reply.');
          setIsLoading(false);
          return;
        }
        response = await replyToComment(commentId, post._id, replyText.trim(), 'admin-user-id'); // Replace with actual user ID
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
      console.error(`Error during ${action}:`, err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!post || !analytics) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="analytics-title"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
        fontFamily: "'Poppins', sans-serif",
      }}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div style={{
        backgroundColor: '#F7F9FA',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        border: '1px solid #D5DBDB',
      }}>
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '32px',
          borderRadius: '16px 16px 0 0',
          borderBottom: '1px solid #D5DBDB',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <h2 id="analytics-title" style={{
                margin: '0 0 8px 0',
                fontSize: '28px',
                fontWeight: '800',
                color: '#2C3E50',
                lineHeight: '1.2',
                fontFamily: "'Poppins', sans-serif",
              }}>Analytics Dashboard</h2>
              <h2 style={{
                margin: '0 0 12px 0',
                fontSize: '20px',
                fontWeight: '600',
                color: '#7F8C8D',
                lineHeight: '1.3',
                fontFamily: "'Poppins', sans-serif",
              }}>{post.title}</h2>
              <p style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: '600',
                color: '#7F8C8D',
                lineHeight: '1.3',
                fontFamily: "'Poppins', sans-serif",
              }}>{post.desc}</p>
              <div style={{
                display: 'flex',
                gap: '16px',
                fontSize: '14px',
                color: '#7F8C8D',
                fontFamily: "'Poppins', sans-serif",
              }}>
                <span><strong>Author:</strong> {post.user?.user || 'Unknown'}</span>
                <span><strong>Posted:</strong> {new Date(post.date).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? '#D5DBDB' : '#3498DB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease, transform 0.2s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                outline: 'none',
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#3498DBCC')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#3498DB')}
              onFocus={(e) => !isLoading && (e.target.style.outline = '2px solid #3498DB')}
              onBlur={(e) => !isLoading && (e.target.style.outline = 'none')}
              aria-label="Close analytics dashboard"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          {error && <p style={{ color: '#FF6B6B', textAlign: 'center', marginBottom: '20px', fontFamily: "'Poppins', sans-serif", fontSize: '14px' }}>{error}</p>}

          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '32px',
            flexWrap: 'wrap',
          }}>
            <StatCard
              icon={Heart}
              title="Total Likes"
              value={analytics.likes}
              color="#3498DB"
              bgColor="#FFFFFF"
            />
            <StatCard
              icon={MessageCircle}
              title="Total Comments"
              value={analytics.comments}
              color="#2ECC71"
              bgColor="#FFFFFF"
            />
            <StatCard
              icon={Eye}
              title="Total Views"
              value={analytics.views}
              color="#3498DB"
              bgColor="#FFFFFF"
            />
            <StatCard
              icon={Share2}
              title="Shares"
              value={analytics.shares}
              color="#3498DB"
              bgColor="#FFFFFF"
            />
            <StatCard
              icon={TrendingUp}
              title="Engagement Rate"
              value={`${analytics.engagementRate}%`}
              color="#2ECC71"
              bgColor="#FFFFFF"
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
          }}>
            <ChartContainer
              title="Likes Over Time"
              data={analytics.likesOverTime}
              dataKey="likes"
              color="#0092F4"
            />
            <ChartContainer
              title="Comments Over Time"
              data={analytics.commentsOverTime}
              dataKey="comments"
              color="#06DC5F"
            />
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #D5DBDB',
          }}>
            <h3 style={{
              color: '#2C3E50',
              marginBottom: '20px',
              fontSize: '20px',
              fontWeight: '700',
              fontFamily: "'Poppins', sans-serif",
            }}>Recent Comments Management</h3>

            {replyCommentId && (
              <div style={{ marginBottom: '20px' }}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Enter your reply..."
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #D5DBDB',
                    fontSize: '14px',
                    resize: 'vertical',
                    color: '#2C3E50',
                    fontFamily: "'Poppins', sans-serif",
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.outline = '2px solid #3498DB')}
                  onBlur={(e) => (e.target.style.outline = 'none')}
                  aria-label="Enter reply to comment"
                />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={() => handleCommentAction(replyCommentId, 'reply')}
                    disabled={isLoading}
                    style={{
                      backgroundColor: isLoading ? '#D5DBDB' : '#2ECC71',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s ease',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                    onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#2ECC71CC')}
                    onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#2ECC71')}
                    aria-label="Submit reply"
                  >
                    Submit Reply
                  </button>
                  <button
                    onClick={() => {
                      setReplyText('');
                      setReplyCommentId(null);
                    }}
                    disabled={isLoading}
                    style={{
                      backgroundColor: isLoading ? '#D5DBDB' : '#FFFFFF',
                      color: '#2C3E50',
                      border: '1px solid #D5DBDB',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'background-color 0.2s ease',
                      fontFamily: "'Poppins', sans-serif",
                    }}
                    onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#F7F9FA')}
                    onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#FFFFFF')}
                    aria-label="Cancel reply"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              {analytics.recentComments.map(comment => (
                <div key={comment.id} style={{
                  backgroundColor: comment.status === 'flagged' ? '#FFF5F5' : '#FFFFFF',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: comment.status === 'flagged' ? '2px solid #E74C3C' : '1px solid #D5DBDB',
                  transition: 'all 0.2s ease',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <strong style={{ color: '#2C3E50', fontSize: '15px', fontFamily: "'Poppins', sans-serif" }}>{comment.author}</strong>
                      <span style={{
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        backgroundColor: comment.status === 'approved' ? '#2ECC71' :
                          comment.status === 'pending' ? '#3498DB' : '#E74C3C',
                        color: '#FFFFFF',
                        fontFamily: "'Poppins', sans-serif",
                      }}>
                        {comment.status.toUpperCase()}
                      </span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#7F8C8D', fontWeight: '500', fontFamily: "'Poppins', sans-serif" }}>{comment.time}</span>
                  </div>
                  <p style={{ margin: '0 0 16px 0', color: '#7F8C8D', lineHeight: '1.5', fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>{comment.comment}</p>
                  {comment.replies.length > 0 && (
                    <div style={{ marginTop: '10px', paddingLeft: '20px', borderLeft: '2px solid #D5DBDB' }}>
                      {comment.replies.map(reply => (
                        <div key={reply._id || reply.id} style={{ marginBottom: '10px' }}>
                          <strong style={{ color: '#2C3E50', fontSize: '14px', fontFamily: "'Poppins', sans-serif" }}>{reply.user?.user || 'Unknown'}</strong>
                          <p style={{ margin: '5px 0', color: '#7F8C8D', fontSize: '13px', fontFamily: "'Poppins', sans-serif" }}>{reply.value}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleCommentAction(comment.id, 'approve')}
                      disabled={isLoading}
                      style={{
                        backgroundColor: isLoading ? '#D5DBDB' : '#2ECC71',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                      onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#2ECC71CC')}
                      onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#2ECC71')}
                      aria-label="Approve comment"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleCommentAction(comment.id, 'delete')}
                      disabled={isLoading}
                      style={{
                        backgroundColor: isLoading ? '#D5DBDB' : '#FF6B6B',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                      onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#FF6B6BCC')}
                      onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#FF6B6B')}
                      aria-label="Delete comment"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleCommentAction(comment.id, 'flag')}
                      disabled={isLoading}
                      style={{
                        backgroundColor: isLoading ? '#D5DBDB' : '#E74C3C',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                      onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#C0392B')}
                      onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#E74C3C')}
                      aria-label="Flag comment as spam"
                    >
                      Flag as Spam
                    </button>
                    <button
                      onClick={() => setReplyCommentId(comment.id)}
                      disabled={isLoading}
                      style={{
                        backgroundColor: isLoading ? '#D5DBDB' : '#FFFFFF',
                        color: '#2C3E50',
                        border: '1px solid #D5DBDB',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                      onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#F7F9FA')}
                      onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#FFFFFF')}
                      aria-label="Reply to comment"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <style jsx>{`
            @media (max-width: 768px) {
              div[style*="padding: 32px"] {
                padding: 16px;
              }
              h2[style*="fontSize: 28px"] {
                font-size: 24px !important;
              }
              h3[style*="fontSize: 20px"] {
                font-size: 18px !important;
              }
              div[style*="fontSize: 14px"] {
                font-size: 12px !important;
              }
              div[style*="minWidth: 180px"] {
                min-width: 140px !important;
              }
              div[style*="minmax(400px, 1fr)"] {
                grid-template-columns: minmax(300px, 1fr) !important;
              }
              textarea {
                font-size: 12px !important;
                padding: 8px !important;
              }
              button[style*="padding: 8px 16px"] {
                padding: 6px 12px !important;
                font-size: 12px !important;
              }
              button[style*="width: 40px"] {
                width: 32px !important;
                height: 32px !important;
              }
              div[style*="padding: 20px"][style*="borderRadius: 12px"] {
                padding: 16px !important;
              }
              p[style*="fontSize: 14px"] {
                font-size: 12px !important;
              }
              span[style*="fontSize: 13px"] {
                font-size: 11px !important;
              }
              strong[style*="fontSize: 15px"] {
                font-size: 13px !important;
              }
            }
          `}</style>
        </div>
      </div>
    </div>
  );
}