import React, { useState } from 'react';
import { X, RotateCcw, Trash2 } from 'lucide-react';

export default function PopupPostDetails({ post, onClose, onRestore, onDelete, isDeleted }) {
  const [isLoading, setIsLoading] = useState(false);

  if (!post) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleRestore = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await onRestore(post._id);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await onDelete(post._id);
      onClose();
    } finally {
      setIsLoading(false);
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
        backdropFilter: 'blur(8px)',
        padding: '16px',
        fontFamily: "'Poppins', sans-serif",
      }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-labelledby="post-title"
      aria-modal="true"
    >
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #D5DBDB',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
        width: '100%',
        maxWidth: '960px',
        maxHeight: '85vh',
        overflowY: 'auto',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          backgroundColor: '#EDEFF2',
          padding: '12px 16px',
          borderRadius: '12px 12px 0 0',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          borderBottom: '1px solid #D5DBDB',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
            <h2
              id="post-title"
              style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '600',
                color: '#2C3E50',
                lineHeight: '1.3',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {post.title}
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              style={{
                backgroundColor: '#3498DB',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'background-color 0.2s ease-in-out',
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#3498DBCC')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#3498DB')}
              aria-label="Close dialog"
            >
              <X size={16} />
              Close
            </button>
          </div>
          <div style={{
            display: 'flex',
            gap: '10px',
            fontSize: '13px',
            color: '#7F8C8D',
            marginTop: '6px',
            flexWrap: 'wrap',
          }}>
            <span><strong>Author:</strong> {post.user?.user || 'Unknown'}</span>
            <span><strong>Date:</strong> {new Date(post.date).toLocaleDateString()}</span>
          </div>
        </div>

        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #D5DBDB',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            flex: 1,
          }}>
            <h3 style={{ color: '#2C3E50', margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>
              Content
            </h3>
            <p style={{ margin: 0, color: '#2C3E50', lineHeight: '1.5', fontSize: '14px' }}>
              {post.desc}
            </p>
          </div>

          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '16px',
            borderRadius: '8px',
            border: '1px solid #D5DBDB',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}>
            <h3 style={{ color: '#2C3E50', margin: '0 0 10px 0', fontSize: '16px', fontWeight: '600' }}>
              Actions
            </h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handleRestore}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#D5DBDB' : '#2ECC71',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.2s ease-in-out',
                  fontFamily: "'Poppins', sans-serif",
                }}
                onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#2ECC71CC')}
                onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#2ECC71')}
                aria-label={isDeleted ? 'Undelete post' : 'Unarchive post'}
              >
                <RotateCcw size={16} />
                {isDeleted ? 'Undelete' : 'Unarchive'}
              </button>
              <button
                onClick={handleDelete}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#D5DBDB' : '#FF6B6B',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background-color 0.2s ease-in-out',
                  fontFamily: "'Poppins', sans-serif",
                }}
                onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#FF6B6BCC')}
                onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#FF6B6B')}
                aria-label="Delete post permanently"
              >
                <Trash2 size={16} />
                Delete Permanently
              </button>
            </div>
          </div>
        </div>

        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 20,
          }}>
            <svg
              className="animate-spin"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4V2M12 22V20M4 12H2M22 12H20M6.34 6.34L4.93 4.93M19.07 19.07L17.66 17.66M6.34 17.66L4.93 19.07M19.07 4.93L17.66 6.34"
                stroke="#2C3E50"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="maxWidth: 960px"] {
            max-width: 100%;
            margin: 0 8px;
            max-height: 90vh;
          }
          h2 {
            font-size: 18px !important;
          }
          h3 {
            font-size: 14px !important;
          }
          p, span {
            font-size: 12px !important;
          }
          button {
            padding: 6px 12px !important;
            font-size: 12px !important;
          }
          div[style*="padding: 16px"] {
            padding: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}