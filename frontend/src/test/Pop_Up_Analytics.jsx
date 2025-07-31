import React from 'react';
import { X, TrendingUp, MessageCircle, Heart, Eye, Share2 } from 'lucide-react';

const Pop_Up_Analytics = ({ post, onClose }) => {
  if (!post) return null;

  const mockAnalytics = {
    ...post,
    views: Math.floor(post.likes * 12),
    shares: Math.floor(post.likes * 0.3),
    engagementRate: ((post.likes + post.comments) / Math.floor(post.likes * 12) * 100).toFixed(1),
    likesOverTime: [
      { day: 'Mon', likes: Math.floor(post.likes * 0.1) },
      { day: 'Tue', likes: Math.floor(post.likes * 0.25) },
      { day: 'Wed', likes: Math.floor(post.likes * 0.45) },
      { day: 'Thu', likes: Math.floor(post.likes * 0.7) },
      { day: 'Fri', likes: Math.floor(post.likes * 0.85) },
      { day: 'Sat', likes: Math.floor(post.likes * 0.95) },
      { day: 'Sun', likes: post.likes }
    ],
    commentsOverTime: [
      { day: 'Mon', comments: Math.floor(post.comments * 0.15) },
      { day: 'Tue', comments: Math.floor(post.comments * 0.3) },
      { day: 'Wed', comments: Math.floor(post.comments * 0.5) },
      { day: 'Thu', comments: Math.floor(post.comments * 0.65) },
      { day: 'Fri', comments: Math.floor(post.comments * 0.8) },
      { day: 'Sat', comments: Math.floor(post.comments * 0.9) },
      { day: 'Sun', comments: post.comments }
    ],
    recentComments: [
      { id: 1, author: 'TechEnthusiast92', comment: 'This is incredibly insightful! The approach you\'ve outlined here really clarifies some complex concepts I\'ve been struggling with.', time: '2 hours ago', status: 'approved' },
      { id: 2, author: 'DataMiner_Pro', comment: 'Great tutorial! Could you share the dataset you used for this analysis? I\'d love to try implementing this myself.', time: '4 hours ago', status: 'pending' },
      { id: 3, author: 'ML_Student_2024', comment: 'Thank you for explaining this so clearly. The visual examples really helped me understand the concept better.', time: '6 hours ago', status: 'approved' },
      { id: 4, author: 'CodeReviewer', comment: 'There might be a small bug in line 45 of your code snippet. Have you tested this thoroughly?', time: '8 hours ago', status: 'flagged' },
      { id: 5, author: 'AI_Enthusiast', comment: 'Amazing work! This is exactly what I needed for my current project. Bookmarked for future reference!', time: '1 day ago', status: 'approved' }
    ]
  };

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
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    }}>
      <div style={{
        backgroundColor: color,
        padding: '12px',
        borderRadius: '10px',
        color: '#fff0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={24} />
      </div>
      <div>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#4a2c2c' }}>{value}</h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#4a2c2c', fontWeight: '500' }}>{title}</p>
      </div>
    </div>
  );

  const ChartContainer = ({ title, data, color, dataKey, maxValue }) => (
    <div style={{
      backgroundColor: '#fff0f0',
      padding: '24px',
      borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
      border: '1px solid #f5e9e9'
    }}>
      <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#4a2c2c', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', alignItems: 'end', gap: '12px', height: '160px', paddingBottom: '8px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '8px' }}>
            <div style={{
              backgroundColor: color,
              height: `${(item[dataKey] / maxValue) * 140}px`,
              width: '100%',
              borderRadius: '6px 6px 0 0',
              minHeight: '8px',
              position: 'relative',
              background: `linear-gradient(180deg, ${color} 0%, ${color}CC 100%)`,
              transition: 'all 0.3s ease'
            }}>
              <div style={{
                position: 'absolute',
                top: '-25px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#4a2c2c',
                color: '#fff0f0',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600',
                opacity: 0,
                transition: 'opacity 0.2s ease'
              }}>
                {item[dataKey]}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#4a2c2c' }}>{item.day}</span>
              <br />
              <span style={{ fontSize: '11px', color: '#4a2c2c', fontWeight: '500' }}>{item[dataKey]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{
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
      backdropFilter: 'blur(12px)',
      padding: '20px',
      fontFamily: "'Poppins', sans-serif"
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #f5e9e9 0%, #ffebee 100%)',
        borderRadius: '24px',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25)',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <div style={{
          backgroundColor: '#f5e9e9',
          padding: '32px',
          borderRadius: '24px 24px 0 0',
          borderBottom: '2px solid #f5e9e9',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{
                margin: '0 0 8px 0',
                fontSize: '28px',
                fontWeight: '800',
                color: '#4a2c2c',
                lineHeight: '1.2'
              }}>📊 Analytics Dashboard</h2>
              <h3 style={{
                margin: '0 0 12px 0',
                fontSize: '20px',
                fontWeight: '600',
                color: '#e0c7c7',
                lineHeight: '1.3'
              }}>{post.title}</h3>
              <div style={{
                display: 'flex',
                gap: '16px',
                fontSize: '14px',
                color: '#4a2c2c'
              }}>
                <span><strong>Author:</strong> {post.author}</span>
                <span><strong>Posted:</strong> {post.date}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#e0c7c7',
                color: '#4a2c2c',
                border: 'none',
                borderRadius: '12px',
                padding: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 12px rgba(224, 199, 199, 0.3)'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e9e9'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#e0c7c7'}
            >
              <X size={20} />
              Close
            </button>
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            <StatCard 
              icon={Heart} 
              title="Total Likes" 
              value={mockAnalytics.likes} 
              color="#e0c7c7" 
              bgColor="#f5e9e9" 
            />
            <StatCard 
              icon={MessageCircle} 
              title="Total Comments" 
              value={mockAnalytics.comments} 
              color="#e0c7c7" 
              bgColor="#f5e9e9" 
            />
            <StatCard 
              icon={Eye} 
              title="Total Views" 
              value={mockAnalytics.views} 
              color="#e0c7c7" 
              bgColor="#f5e9e9" 
            />
            <StatCard 
              icon={Share2} 
              title="Shares" 
              value={mockAnalytics.shares} 
              color="#e0c7c7" 
              bgColor="#f5e9e9" 
            />
            <StatCard 
              icon={TrendingUp} 
              title="Engagement Rate" 
              value={`${mockAnalytics.engagementRate}%`} 
              color="#e0c7c7" 
              bgColor="#f5e9e9" 
            />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            <ChartContainer
              title="📈 Likes Over Time"
              data={mockAnalytics.likesOverTime}
              color="#e0c7c7"
              dataKey="likes"
              maxValue={Math.max(...mockAnalytics.likesOverTime.map(d => d.likes))}
            />
            <ChartContainer
              title="💬 Comments Over Time"
              data={mockAnalytics.commentsOverTime}
              color="#e0c7c7"
              dataKey="comments"
              maxValue={Math.max(...mockAnalytics.commentsOverTime.map(d => d.comments))}
            />
          </div>

          <div style={{
            backgroundColor: '#fff0f0',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f5e9e9'
          }}>
            <h3 style={{ color: '#4a2c2c', marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>💭 Recent Comments Management</h3>
            
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              {mockAnalytics.recentComments.map(comment => (
                <div key={comment.id} style={{
                  backgroundColor: comment.status === 'flagged' ? '#f5e9e9' : '#fff0f0',
                  padding: '20px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: comment.status === 'flagged' ? '2px solid #e0c7c7' : '1px solid #f5e9e9',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <strong style={{ color: '#e0c7c7', fontSize: '15px' }}>{comment.author}</strong>
                      <span style={{
                        fontSize: '11px',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontWeight: '600',
                        backgroundColor: comment.status === 'approved' ? '#f5e9e9' : 
                                        comment.status === 'pending' ? '#fff0f0' : '#ffebee',
                        color: comment.status === 'approved' ? '#e0c7c7' : 
                               comment.status === 'pending' ? '#e0c7c7' : '#4a2c2c'
                      }}>
                        {comment.status.toUpperCase()}
                      </span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#4a2c2c', fontWeight: '500' }}>{comment.time}</span>
                  </div>
                  <p style={{ margin: '0 0 16px 0', color: '#4a2c2c', lineHeight: '1.5', fontSize: '14px' }}>{comment.comment}</p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button style={{
                      backgroundColor: '#e0c7c7',
                      color: '#4a2c2c',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      ✓ Approve
                    </button>
                    <button style={{
                      backgroundColor: '#e0c7c7',
                      color: '#4a2c2c',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      ✗ Delete
                    </button>
                    <button style={{
                      backgroundColor: '#e0c7c7',
                      color: '#4a2c2c',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      🚫 Flag as Spam
                    </button>
                    <button style={{
                      backgroundColor: '#e0c7c7',
                      color: '#4a2c2c',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      💌 Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pop_Up_Analytics;