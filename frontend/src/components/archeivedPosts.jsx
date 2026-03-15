import React, { useState, memo, useCallback } from 'react';
import { Archive, ArchiveRestore, Trash2, X, XCircle } from 'lucide-react';
import PopupPostDetails from './popupPostDetails';
import { unarchivePost, permanentDeletePost } from '../utils/api';
import ButtonTrans from './buttonTran';
import { useNavigate } from 'react-router-dom';

// --- Static Styles (Defined outside to prevent re-creation on every render) ---
const MODAL_OVERLAY_STYLE = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  backdropFilter: 'blur(8px)',
  padding: '12px',
};

const TABLE_STYLE = {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: '0 8px',
  fontSize: '14px',
  fontFamily: "'Poppins', sans-serif",
};

export default function ArchivedPosts({ posts, onUnarchive, onError }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [hover1, setHover1] = useState(false);
  const [hover2, setHover2] = useState(false);
  const [hover3, setHover3] = useState(false);

  const handlePopupToggle = () => setIsPopupOpen((prev) => !prev);

  const navigate = useNavigate();

  // Memoized selection handler
  const handleSelectPost = useCallback((post) => {
    setSelectedPost(post);
  }, []);

  const handleUnarchivePost = async (id) => {
    if (!window.confirm('Are you sure you want to unarchive this post?')) return;
    setIsLoading(true);
    try {
      await unarchivePost(id);
      const postToUnarchive = posts.find((p) => p._id === id);
      if (postToUnarchive && onUnarchive) onUnarchive(postToUnarchive);
      setSelectedPost(null);
      setIsPopupOpen(false);
    } catch (err) {
      onError('Failed to unarchive post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this post?')) return;
    setIsLoading(true);
    try {
      await permanentDeletePost(id);
      setSelectedPost(null);
      setIsPopupOpen(false);
    } catch (err) {
      onError('Failed to permanently delete post.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#F7F9FA',
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #D5DBDB',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        marginBottom: '16px',
        fontFamily: "'Poppins', sans-serif",
        cursor: 'pointer',
      }}
      onClick={handlePopupToggle}
    >
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2C3E50', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Archive size={18} color="#3498DB" />
          Archived Posts
        </h2>
        <span style={{ color: '#2C3E50', fontSize: '14px' }}>{posts.length} archived {posts.length <= 1 ? 'post' : 'posts'}</span>
      </div>


      {posts.length === 0 && (
        <p style={{ color: '#2C3E50', fontSize: '14px', textAlign: 'center' }}>No archived posts available.</p>
      )}

      {isPopupOpen && (
        <div style={MODAL_OVERLAY_STYLE} onClick={(e) => e.stopPropagation()}>
          <div style={{
            background: '#FFFFFF', borderRadius: '12px', width: '100%',
            maxWidth: '960px', maxHeight: '85vh', overflowY: 'auto', position: 'relative'
          }}>
            {/* Modal Header */}
            <div style={{ backgroundColor: '#EDEFF2', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#2C3E50' }}>Archived Post Management</h3>
              <ButtonTrans
                ClickEvent={() => {
                  handlePopupToggle()
                  setHover1(false);
                }}
                isLoading={isLoading}
                child={<>
                  <X size={18} />
                </>}
                buttonType={"button"}
                label={"Close"}
                disable={isLoading}
                noToolTip={true}
                paddingEdit={"4px"}
                hover={hover1}
                mouseEnter={() => setHover1(true)}
                mouseLeave={() => setHover1(false)}
              />
            </div>

            {/* Table Content */}
            <div style={{ padding: '12px' }}>
              <table style={TABLE_STYLE}>
                <thead>
                  <tr style={{ backgroundColor: '#EDEFF2', color: '#2C3E50' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Profile</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Author</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Title</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Content</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Likes</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Comments</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr
                      key={post._id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        cursor: 'pointer',
                        borderBottom: '1px solid #D5DBDB',
                        transition: 'background-color 0.2s ease-in-out',
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents parent handlePopupToggle from firing
                        handleSelectPost(post);
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F7F9FA')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{
                          width: '32px', height: '32px',
                          backgroundColor: '#3498DB', borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#FFFFFF', fontWeight: '600', fontSize: '14px',
                        }}>
                          {post.user?.user?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#2C3E50' }}>
                        {new Date(post.date).toLocaleDateString()}
                      </td>
                      <td
                        style={{ padding: '12px 16px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (post.user?.username) {
                            navigate(`/blog/profile/${post.user.username}`);
                          }
                        }}
                      >
                        <span
                          style={{
                            cursor: 'pointer',
                            color: '#3498DB',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.textDecoration = 'underline';
                            e.target.style.color = '#2980B9';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.textDecoration = 'none';
                            e.target.style.color = '#3498DB';
                          }}
                        >
                          {post.user?.user || 'Unknown'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#2C3E50' }}>{post.title}</td>
                      <td style={{ padding: '12px 16px', color: '#2C3E50' }}>
                        {post.desc.substring(0, 50)}...
                      </td>
                      <td style={{ padding: '12px 16px', color: '#2C3E50' }}>{post.like}</td>
                      <td style={{ padding: '12px 16px', color: '#2C3E50' }}>{post.comments.length}</td>
                      <td style={{ padding: '12px 16px', color: '#2C3E50', display: "flex", flexDirection: "row", }}>
                        <ButtonTrans
                          child={<>
                            <ArchiveRestore size={16} />
                          </>}
                          noToolTip={true}
                          buttonType="button"
                          label="Retore"
                          paddingEdit="4px 4px"
                          hover={hover2 === post._id}
                          mouseEnter={() => setHover2(post._id)}
                          mouseLeave={() => setHover2(null)}
                          ClickEvent={(e) => {
                            e.stopPropagation();
                            handleUnarchivePost(post._id)
                          }}
                        />
                        <ButtonTrans
                          child={<>
                            <Trash2 size="16px" />
                          </>}
                          noToolTip={true}
                          buttonType="button"
                          label="Permanent Delete"
                          hover={hover3 === post._id}
                          mouseEnter={() => setHover3(post._id)}
                          mouseLeave={() => setHover3(null)}
                          paddingEdit="4px 4px"
                          ClickEvent={(e) => {
                            e.stopPropagation();
                            handlePermanentDelete(post._id)
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Optimized Loading Spinner */}
            {isLoading && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 20 }}>
                <div style={{ width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #3498DB', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedPost && (
        <PopupPostDetails
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onRestore={handleUnarchivePost}
          onDelete={handlePermanentDelete}
          isDeleted={false}
        />
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          table { font-size: 11px !important; }
          th, td { padding: 4px 8px !important; }
        }
      `}</style>
    </div>
  );
}