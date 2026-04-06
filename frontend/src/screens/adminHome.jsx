import React, { useState, useEffect, useMemo } from 'react';
import {
  Trash2, TrendingUp, Users, Activity, Flag,
  ArrowDown01, ArrowDown10, ArrowUpDown, ChevronLeft, ChevronRight,
  ArrowUpAZ, ArrowDownZA,
  Archive
} from 'lucide-react';
import { debounce } from 'lodash';
import Button from '../components/button';
import PopupAnalytics from '../components/popupAnalytics';
import DeletedPosts from '../components/deletedPosts';
import ArcheivedPosts from '../components/archeivedPosts';
import { useNavigate } from 'react-router-dom';
import { fetchBlogByStatus, bulkAction, reportAiFlag } from '../utils/api';
import api from '../utils/api';
import ReportedPosts from '../components/reportedPosts';
import { useStore } from '../data/zustand';
import ButtonTrans from '../components/buttonTran';
import ToastBlog from '../utils/toast';

const StatsCard = ({ title, value, icon: Icon, color, bgColor }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        padding: '20px',
        borderRadius: '16px', // Matches your PostCard and Table border radius
        border: '1px solid #e2e8f0', // Thinner, softer border like the table
        boxShadow: isHovered
          ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        minWidth: '240px',
        flex: '1', // Allows cards to grow equally in the row
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'default',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        zIndex: isHovered ? 10 : 1
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        backgroundColor: `${color}15`, // Dynamic color with 15% opacity for a soft background
        padding: '12px',
        borderRadius: '12px',
        color: color, // Sharp color for the icon itself
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease',
        transform: isHovered ? 'rotate(-15deg) scale(1.1)' : 'rotate(0deg) scale(1)',
      }}>
        <Icon size={24} strokeWidth={2.5} />
      </div>

      <div>
        <h3 style={{
          margin: 0,
          fontSize: '24px',
          fontWeight: '700',
          color: '#1e293b', // Deep slate from table text
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: '-0.5px'
        }}>
          {value.toLocaleString()}
        </h3>
        <p style={{
          margin: 0,
          fontSize: '13px',
          color: '#64748b', // Slate gray from table headers
          fontWeight: '600',
          fontFamily: "'Poppins', sans-serif",
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {title}
        </p>
      </div>
    </div>
  );
};

export default function AdminHome() {
  const navigate = useNavigate();
  const [posts, setPosts] = React.useState([]);
  const [deletedPosts, setDeletedPosts] = React.useState([]);
  const [reportedPosts, setReportedPosts] = React.useState([]);
  const [archivedPosts, setArchivedPosts] = React.useState([]);
  const [selectedPost, setSelectedPost] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedIds, setSelectedIds] = React.useState(new Set());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [sortField, setSortField] = React.useState('date');
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [hover1, setHover1] = React.useState(null);
  const [hover2, setHover2] = React.useState(null);
  const [hover3, setHover3] = React.useState(null);

  // NEW: State for rows per page
  const [postsPerPage, setPostsPerPage] = React.useState(10);

  const refreshTrigger = useStore((state) => state.refreshTrigger);
  const setTriggerRefresh = useStore((state) => state.setTriggerRefresh);

  const fetchData = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      const [activeRes, deletedRes, archivedRes, reportedRes] = await Promise.all([
        fetchBlogByStatus('active').catch(err => ({ error: err, data: [] })),
        fetchBlogByStatus('deleted').catch(err => ({ error: err, data: [] })),
        fetchBlogByStatus('archived').catch(err => ({ error: err, data: [] })),
        fetchBlogByStatus('report').catch(err => ({ error: err, data: [] })),
      ]);

      const mapPosts = (data) => data.map(post => ({
        _id: post._id || '',
        title: post.title || 'Untitled',
        user: { user: post.user?.user || post.email || 'Unknown Author', username: post.user?.username || 'Unknown', email: post.email || 'unknown@example.com', role: post.user?.role || 'user' },
        desc: post.desc || '',
        date: post.date || new Date().toISOString(),
        like: post.like || 0,
        viewCount: post.viewCount || 0,
        shareCount: post.shareCount || 0,
        comments: (post.comments || []).map(comment => ({
          ...comment,
          status: comment.status || 'pending',
          user: comment.user || { user: 'Unknown', email: 'unknown@example.com' },
          reply: (comment.reply || []).map(reply => ({
            ...reply,
            user: reply.user || { user: 'Unknown', email: 'unknown@example.com' },
          })),
        })),
        status: post.status || 'active',
      }));

      setPosts(mapPosts(activeRes.data));
      setDeletedPosts(mapPosts(deletedRes.data));
      setArchivedPosts(mapPosts(archivedRes.data));
      setReportedPosts(mapPosts(reportedRes.data));
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  const handleCommentUpdate = (postId, updatedComments) => {
    setPosts(prev => prev.map(post =>
      post._id === postId ? { ...post, comments: updatedComments } : post
    ));
  };

  const handleError = (message) => setError(message);
  const handleRetry = () => fetchData();

  const debouncedSearch = debounce((value) => {
    setSearchTerm(value);
    setPage(1);
  }, 300);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setPage(1);
  };

  const handleBulkAction = async (action) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!window.confirm(`Are you sure you want to ${action} ${ids.length} post(s)?`)) return;
    try {
      await bulkAction(action, ids);
      ToastBlog(`Posts ${action}ed successfully.`);
      setSelectedIds(new Set());
      await fetchData();
    } catch (err) {
      setError(`Failed to ${action} posts: ${err.message}`);
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter(post =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.user.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [posts, searchTerm]);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      let valueA, valueB;
      switch (sortField) {
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'date':
          valueA = new Date(a.date);
          valueB = new Date(b.date);
          break;
        case 'likes':
          valueA = a.like;
          valueB = b.like;
          break;
        case 'comments':
          valueA = a.comments.length;
          valueB = b.comments.length;
          break;
        default:
          return 0;
      }
      if (sortOrder === 'asc') return valueA > valueB ? 1 : -1;
      return valueA < valueB ? 1 : -1;
    });
  }, [filteredPosts, sortField, sortOrder]);

  const paginatedPosts = useMemo(() => {
    const start = (page - 1) * postsPerPage;
    return sortedPosts.slice(start, start + postsPerPage);
  }, [sortedPosts, page, postsPerPage]);

  const totalLikes = posts.reduce((sum, post) => sum + (post.like || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comments?.length || 0), 0);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const handleReport = async (id) => {
    try {
      await reportAiFlag(id);
      ToastBlog("Post Reported");
      setTriggerRefresh();
    } catch (err) {
      console.log("Failed to flag blog:", err);
    }
  }

  // --- SORT ICON HELPER ---
  const SortIndicator = ({ field }) => {
    if (sortField !== field) return <ArrowUpDown size={14} style={{ opacity: 0.3 }} />;
    if (field === 'date') return sortOrder === 'asc' ? <ArrowDown01 size={16} /> : <ArrowDown10 size={16} />;
    if (field === 'title') return sortOrder === 'asc' ? <ArrowUpAZ size={16} /> : <ArrowDownZA size={16} />;
    return sortOrder === 'asc' ? ' ↑' : ' ↓';
  };

  const headerStyle = {
    padding: '12px',
    textAlign: 'left',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
    userSelect: 'none',
    transition: 'background-color 0.2s'
  };

  return (
    <div style={{
      fontFamily: "'Poppins', sans-serif",
      backgroundColor: 'aliceblue',
      minHeight: '100vh',
      padding: '20px',
    }}>
      <h1 style={{ textAlign: 'center', color: '#2C3E50', fontSize: '28px', fontWeight: '600', marginBottom: '20px' }}>
        Admin Dashboard
      </h1>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <Button
          value="Go to Blog Page"
          onClick={() => navigate("/blog")}
          style={{ backgroundColor: '#3498DB', color: '#FFFFFF', padding: '8px 16px', borderRadius: '6px', border: 'none', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
        />
      </div>



      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
        <StatsCard title="Total Posts" value={posts.length} icon={Activity} color="#3498DB" bgColor="#FFFFFF" />
        <StatsCard title="Total Likes" value={totalLikes} icon={TrendingUp} color="#3498DB" bgColor="#FFFFFF" />
        <StatsCard title="Total Comments" value={totalComments} icon={Users} color="#3498DB" bgColor="#FFFFFF" />
        <StatsCard title="Deleted Posts" value={deletedPosts.length} icon={Trash2} color="#FF6B6B" bgColor="#FFFFFF" />
        <StatsCard title="Reported Posts" value={reportedPosts.length} icon={Flag} color="#FF6B6B" bgColor="#FFFFFF" />
        <StatsCard title="Archived Posts" value={archivedPosts.length} icon={Flag} color="#FF6B6B" bgColor="#FFFFFF" />
      </div>

      <div className="controls-row" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search posts..."
          className="search-input"
          onChange={(e) => debouncedSearch(e.target.value)}
          style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', width: '100%', maxWidth: '400px', backgroundColor: '#fff', color: '#1e293b', outline: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '14px' }}
        />
        <div style={{ display: 'flex', gap: '10px', flexDirection: 'row', justifyContent: 'center' }}>
          <Button value="Delete Selected" onClick={() => handleBulkAction('delete')} style={{ backgroundColor: '#f43f5e', color: '#fff', padding: '10px 18px', borderRadius: '10px' }} />
          <Button value="Archive Selected" onClick={() => handleBulkAction('archive')} style={{ backgroundColor: '#64748b', color: '#fff', padding: '10px 18px', borderRadius: '10px' }} />
        </div>
      </div>


      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : (
        <div style={{ overflow: 'auto', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #D5DBDB', marginBottom: "20px" }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: "'Poppins', sans-serif", }}>
            <thead>
              <tr style={{ backgroundColor: '#EDEFF2', color: '#2C3E50', borderBottom: '2px solid #D5DBDB' }}>
                <th style={{ padding: '12px' }}>
                  <input type="checkbox" onChange={(e) => setSelectedIds(e.target.checked ? new Set(paginatedPosts.map(p => p._id)) : new Set())} />
                </th>
                <th style={{ ...headerStyle, cursor: 'default' }}>Profile</th>
                <th style={headerStyle} onClick={() => handleSort('date')} title="Sort by Date">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Date <SortIndicator field="date" /></div>
                </th>
                <th style={{ ...headerStyle, cursor: 'default' }}>Author</th>
                <th style={headerStyle} onClick={() => handleSort('title')} title="Sort by Title">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Title <SortIndicator field="title" /></div>
                </th>
                <th style={{ ...headerStyle, cursor: 'default' }}>Content</th>
                <th style={headerStyle} onClick={() => handleSort('likes')} title="Sort by Likes">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Likes <SortIndicator field="likes" /></div>
                </th>
                <th style={headerStyle} onClick={() => handleSort('comments')} title="Sort by Comments">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Comments <SortIndicator field="comments" /></div>
                </th>
                <th style={{ ...headerStyle, textAlign: 'center', cursor: 'default' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPosts.map(post => (
                <tr key={post._id} style={{ borderBottom: '1px solid #D5DBDB', transition: 'background 0.2s', cursor: "pointer" }} onClick={() => setSelectedPost(post)} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7F9FA'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <input type="checkbox" checked={selectedIds.has(post._id)} onChange={(e) => { e.stopPropagation(); const newSet = new Set(selectedIds); e.target.checked ? newSet.add(post._id) : newSet.delete(post._id); setSelectedIds(newSet); }} onClick={(e) => e.stopPropagation()} />
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#3498DB', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {post.user?.user?.charAt(0).toUpperCase()}
                    </div>
                  </td>
                  <td style={{ padding: '10px', fontSize: '14px' }}>{new Date(post.date).toLocaleDateString()}</td>
                  {/* <td style={{ padding: '10px', fontSize: '14px' }}>{post.user?.user}</td> */}
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
                        transition: 'all 0.2s ease',
                        fontSize: '14px'
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
                  <td style={{
                    padding: '10px', fontSize: '14px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{post.title}</td>
                  <td style={{padding: '10px', fontSize: '13px', color: '#7F8C8D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.desc.substring(0, 50)}...</td>
                  <td style={{ padding: '10px', fontSize: '14px' }}>{post.like}</td>
                  <td style={{ padding: '10px', fontSize: '14px' }}>{post.comments.length}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                      <ButtonTrans
                        child={<Flag size={14} />}
                        ClickEvent={(e) => {
                          e.stopPropagation();
                          handleReport(post._id);
                        }}
                        mouseEnter={() => setHover1(post._id)}
                        mouseLeave={() => setHover1(null)}
                        hover={hover1 === post._id}
                        paddingEdit="4px"
                        buttonType={"button"}
                        noToolTip={true}
                        label={"Report/Flag"}
                      />
                      <ButtonTrans
                        child={<><Archive size={14} /></>}
                        noToolTip={true}
                        buttonType={"button"}
                        label={"Archive"}
                        paddingEdit={"4px"}
                        mouseEnter={() => setHover2(post._id)}
                        mouseLeave={() => setHover2(null)}
                        hover={hover2 === post._id}
                        ClickEvent={async (e) => {
                          e.stopPropagation();
                          if (window.confirm("Archive this post?")) {
                            await bulkAction("archive", post._id);
                            await fetchData();
                          }
                        }}
                      />
                      <ButtonTrans
                        child={<Trash2 size={14} />}
                        ClickEvent={async (e) => {
                          e.stopPropagation();
                          if (window.confirm("Delete post?")) {
                            await bulkAction("delete", post._id);
                            await fetchData();
                          }
                        }}
                        mouseEnter={() => setHover3(post._id)}
                        mouseLeave={() => setHover3(null)}
                        hover={hover3 === post._id}
                        paddingEdit="4px"
                        buttonType={"button"}
                        noToolTip={true}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- NEW PAGINATION PANEL --- */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid #D5DBDB',
            backgroundColor: '#FBFBFC',
            flexWrap: 'wrap',
            gap: '16px',
            fontFamily: "'Poppins', sans-serif"
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* <label style={{ fontSize: '13px', color: '#7F8C8D', fontWeight: '500' }}>Rows per page:</label> */}
              <select
                value={postsPerPage}
                onChange={(e) => { setPostsPerPage(Number(e.target.value)); setPage(1); }}
                style={{
                  padding: '4px 8px',
                  borderRadius: '6px',
                  border: '1px solid #D5DBDB',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  outline: 'none',
                  fontSize: '13px',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: '500',
                }}
              >
                {[5, 10, 20, 50].map(val => <option key={val} value={val}>{val} Rows per Page</option>)}
              </select>
              <span style={{ fontSize: '13px', color: '#7F8C8D' }}>
                Showing {Math.min(filteredPosts.length, (page - 1) * postsPerPage + 1)} to {Math.min(filteredPosts.length, page * postsPerPage)} of {filteredPosts.length} entries
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                style={{
                  display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: '6px', border: '1px solid #D5DBDB', fontFamily: "'Poppins', sans-serif",
                  backgroundColor: page === 1 ? '#F5F5F5' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '13px'
                }}
              >
                <ChevronLeft size={16} /> Prev
              </button>

              <div style={{ display: 'flex', gap: '4px', fontFamily: "'Poppins', sans-serif" }}>
                {Array.from({ length: totalPages }, (_, i) => {
                  const pageNum = i + 1;
                  // Simple logic to only show nearby pages if there are many
                  if (totalPages > 7 && Math.abs(pageNum - page) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                    if (Math.abs(pageNum - page) === 3) return <span key={pageNum}>...</span>;
                    return null;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      style={{
                        minWidth: '32px', height: '32px', borderRadius: '6px', border: '1px solid',
                        borderColor: page === pageNum ? '#3498DB' : '#D5DBDB',
                        backgroundColor: page === pageNum ? '#3498DB' : '#fff',
                        color: page === pageNum ? '#fff' : '#2C3E50',
                        cursor: 'pointer', fontSize: '13px', fontWeight: page === pageNum ? '600' : '400',
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                style={{
                  display: 'flex', alignItems: 'center', padding: '6px 12px', borderRadius: '6px', border: '1px solid #D5DBDB', fontFamily: "'Poppins', sans-serif",
                  backgroundColor: page === totalPages ? '#F5F5F5' : '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px'
                }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Lists remain unchanged */}
      <DeletedPosts posts={deletedPosts} onRestore={(post) => { setPosts(prev => [...prev, { ...post, status: 'active' }]); setDeletedPosts(prev => prev.filter(p => p._id !== post._id)); }} onError={handleError} />
      <ReportedPosts posts={reportedPosts} onRestore={(post) => { setPosts(prev => [...prev, { ...post, status: 'active' }]); setReportedPosts(prev => prev.filter(p => p._id !== post._id)); }} onError={handleError} />
      <ArcheivedPosts posts={archivedPosts} onUnarchive={(post) => { setPosts(prev => [...prev, { ...post, status: 'active' }]); setArchivedPosts(prev => prev.filter(p => p._id !== post._id)); }} onError={handleError} />
      {selectedPost && <PopupAnalytics post={selectedPost} onClose={() => setSelectedPost(null)} onCommentUpdate={handleCommentUpdate} />}
    </div>
  );
}