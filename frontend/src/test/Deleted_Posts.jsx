import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Pop_Up_PostDetails from './Pop_Up_PostDetails';

const Deleted_Posts = ({ posts, onRestore }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handlePopupToggle = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleRestorePost = (id) => {
    const postToRestore = posts.find(post => post.id === id);
    if (postToRestore && onRestore) {
      onRestore(postToRestore);
    }
    setSelectedPost(null);
    setIsPopupOpen(false);
  };

  return (
    <div style={{
      backgroundColor: '#f5e9e9',
      padding: '32px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
      marginBottom: '24px',
      fontFamily: "'Poppins', sans-serif",
      cursor: 'pointer',
    }} onClick={handlePopupToggle}>
      <h2 style={{
        margin: '0 0 24px 0',
        fontSize: '28px',
        fontWeight: '800',
        color: '#4a2c2c',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <Trash2 size={24} />
        Deleted Posts
      </h2>
      {posts.length === 0 ? (
        <p style={{ color: '#4a2c2c', fontSize: '16px', textAlign: 'center' }}>No deleted posts available.</p>
      ) : null}

      {isPopupOpen && (
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
        }}>
          <div style={{
            background: '#fff0f0',
            borderRadius: '24px',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25)',
            width: '90%',
            maxWidth: '1000px',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative',
          }}>
            <div style={{
              backgroundColor: '#f5e9e9',
              padding: '20px',
              borderRadius: '24px 24px 0 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#4a2c2c' }}>Deleted Posts</h3>
              <button
                onClick={handlePopupToggle}
                style={{
                  backgroundColor: '#e0c7c7',
                  color: '#4a2c2c',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Close
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#e0c7c7', color: '#4a2c2c' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Profile</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Author</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Title</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Content</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Likes</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id} style={{ backgroundColor: '#fff0f0', borderBottom: '1px solid #f5e9e9' }} onClick={() => setSelectedPost(post)}>
                      <td style={{ padding: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#e0c7c7',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#4a2c2c',
                          fontWeight: '600',
                        }}>
                          {post.author.charAt(0)}
                        </div>
                      </td>
                      <td style={{ padding: '12px', color: '#4a2c2c' }}>{post.date}</td>
                      <td style={{ padding: '12px', color: '#4a2c2c' }}>{post.author}</td>
                      <td style={{ padding: '12px', color: '#4a2c2c' }}>{post.title}</td>
                      <td style={{ padding: '12px', color: '#4a2c2c' }}>{post.content.substring(0, 50)}...</td>
                      <td style={{ padding: '12px', color: '#4a2c2c' }}>{post.likes}</td>
                      <td style={{ padding: '12px', color: '#4a2c2c' }}>{post.comments}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {selectedPost && <Pop_Up_PostDetails post={selectedPost} onClose={() => setSelectedPost(null)} onRestore={handleRestorePost} onDelete={() => {}} isDeleted={true} />}
    </div>
  );
};

export default Deleted_Posts;