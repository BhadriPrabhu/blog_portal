import React from 'react';
import { X, RotateCcw, Trash2 } from 'lucide-react';

const Pop_Up_PostDetails = ({ post, onClose, onRestore, onDelete, isDeleted }) => {
  if (!post) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
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
        backdropFilter: 'blur(12px)',
        padding: '20px',
        fontFamily: "'Poppins', sans-serif"
      }}
      onClick={handleOverlayClick}
    >
      <div style={{
        background: 'linear-gradient(135deg, #f5e9e9 0%, #ffebee 100%)',
        borderRadius: '24px',
        boxShadow: '0 25px 80px rgba(0, 0, 0, 0.25)',
        width: '90%',
        maxWidth: '1000px',
        height: '90vh',
        overflow: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
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
              }}>{post.title}</h2>
              <div style={{
                display: 'flex',
                gap: '16px',
                fontSize: '14px',
                color: '#4a2c2c'
              }}>
                <span><strong>Author:</strong> {post.author}</span>
                <span><strong>Date:</strong> {post.date}</span>
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

        <div style={{ padding: '32px', flex: 1 }}>
          <div style={{
            backgroundColor: '#fff0f0',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f5e9e9',
            marginBottom: '24px'
          }}>
            <h3 style={{ color: '#4a2c2c', marginBottom: '16px', fontSize: '20px', fontWeight: '700' }}>Content</h3>
            <p style={{ margin: '0 0 16px 0', color: '#4a2c2c', lineHeight: '1.6', fontSize: '16px' }}>{post.content}</p>
          </div>

          <div style={{
            backgroundColor: '#fff0f0',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f5e9e9'
          }}>
            <h3 style={{ color: '#4a2c2c', marginBottom: '20px', fontSize: '20px', fontWeight: '700' }}>Actions</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={(e) => { e.stopPropagation(); onRestore(post.id); onClose(); }}
                style={{
                  backgroundColor: '#e0c7c7',
                  color: '#4a2c2c',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(224, 199, 199, 0.3)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e9e9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e0c7c7'}
              >
                <RotateCcw size={20} />
                {isDeleted ? 'Undelete' : 'Unarchive'}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(post.id); onClose(); }}
                style={{
                  backgroundColor: '#e0c7c7',
                  color: '#4a2c2c',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(224, 199, 199, 0.3)'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5e9e9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#e0c7c7'}
              >
                <Trash2 size={20} />
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pop_Up_PostDetails;