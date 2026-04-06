import React, { useState } from 'react';
import { X, RotateCcw, Trash2, User, Calendar, FileText, Settings2, Loader2 } from 'lucide-react';
import { unReportAiFlag } from '../utils/api';
import { useStore } from '../data/zustand';
import { motion, AnimatePresence } from 'framer-motion';

export default function PopupPostDetails({ post, onClose, onRestore, onDelete, isDeleted, isreport }) {
  const [isLoading, setIsLoading] = useState(false);
  const setTriggerRefresh = useStore((state) => state.setTriggerRefresh);

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
      if (isreport) {
        await unReportAiFlag(post._id);
      } else {
        await onRestore(post._id);
      }
      onClose();
      setTriggerRefresh();
    } catch (err) {
      console.log("Error:", err);
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
      setTriggerRefresh();
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.5)', // Modern slate overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(6px)',
        padding: '20px',
        fontFamily: "'Poppins', sans-serif",
      }}
      onClick={handleOverlayClick}
      role="dialog"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        style={{
          background: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header Section */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '20px 20px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
        }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <h2 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '700',
              color: '#1e293b',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {post.title}
            </h2>
            <div style={{ display: 'flex', gap: '16px', marginTop: '2px' }}>
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
            disabled={isLoading}
            style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '8px',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#ef4444'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.color = '#64748b'; }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Section */}
        <div className="custom-scrollbar" style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#3b82f6' }}>
              <FileText size={18} />
              <span style={{ fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'Poppins', sans-serif" }}>Blog Content</span>
            </div>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '10px',
              borderRadius: '12px',
              border: '1px solid #eff6ff',
              lineHeight: '1.6',
              color: '#334155',
              fontSize: '15px',
              whiteSpace: 'pre-wrap'
            }}>
              {post.desc}
            </div>
          </div>

          {/* Action Panel */}
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#1e293b' }}>
              <Settings2 size={18} />
              <span style={{ fontWeight: '600', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Management Actions</span>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={handleRestore}
                disabled={isLoading}
                style={{
                  backgroundColor: '#10b981',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
                  fontFamily: "'Poppins', sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#059669'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#10b981'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <RotateCcw size={16} />
                {isDeleted ? 'Restore Post' : isreport ? 'Disregard Report' : 'Unarchive Post'}
              </button>

              <button
                onClick={handleDelete}
                disabled={isLoading}
                style={{
                  backgroundColor: '#fff',
                  color: '#ef4444',
                  border: '1px solid #fecaca',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  fontFamily: "'Poppins', sans-serif",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; e.currentTarget.style.borderColor = '#ef4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.borderColor = '#fecaca'; }}
              >
                <Trash2 size={16} />
                Delete Permanently
              </button>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 100,
                backdropFilter: 'blur(2px)'
              }}
            >
              <Loader2 size={32} className="animate-spin" style={{ color: '#3b82f6' }} />
              <p style={{ marginTop: '12px', fontWeight: '600', color: '#1e293b' }}>Processing...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <style>{`
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
}