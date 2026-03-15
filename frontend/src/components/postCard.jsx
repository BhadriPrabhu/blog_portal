import React, { useState } from 'react';
import { MessageSquareText, Share2, MoreVertical, Trash2, Edit2, X, Grid, Bookmark, Heart, Flag } from 'lucide-react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useStore } from '../data/zustand.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { bulkAction } from '../utils/api';
import ToastBlog from '../utils/toast.jsx';
import { motion, AnimatePresence, hover } from 'framer-motion';
import ButtonTrans from './buttonTran.jsx';
import BlogImage from '../assets/icons/blogImage.jsx';

export default function PostCard({ postsData = null, onReload = null }) {
    const [sampleDatas, setSampleDatas] = React.useState([]);
    const [activeMenu, setActiveMenu] = React.useState(null);
    const [hoverMenu, setHoverMenu] = useState({ hover1: false, hover2: false, hover3: false });
    const [hover, setHover] = useState({ hoverLike: null, hoverComment: null, hoverShare: null, hoverSave: null });
    const [hover1, setHover1] = useState(false);

    const profileData = useStore((state) => state.profileData);
    const refreshTrigger = useStore((state) => state.refreshTrigger);
    const location = useLocation();
    const navigate = useNavigate();

    React.useEffect(() => {
        fetchPosts();
    }, [postsData, location.search, profileData, refreshTrigger]);

    const fetchPosts = async () => {
        if (postsData) {
            setSampleDatas(postsData);
            return;
        }
        const urlParams = new URLSearchParams(location.search);
        const sortBy = urlParams.get('sortBy') || 'newest';
        const search = urlParams.get('search') || '';
        const userId = profileData?._id || '';
        if (!userId) return;

        const endpoint = sortBy === 'saved' ? '/blog/saved' : sortBy === 'liked' ? '/blog/liked' : '/blog';
        let query = sortBy === 'saved' || sortBy === 'liked'
            ? `?userId=${encodeURIComponent(userId)}`
            : `?sortBy=${sortBy}&userId=${encodeURIComponent(userId)}${search ? `&search=${encodeURIComponent(search)}` : ''}`;

        try {
            const res = await api.get(`${endpoint}${query}`);
            setSampleDatas(res.data);
        } catch (err) {
            console.error('Fetch posts error:', err.message);
        }
    };

    const likeBlog = async (e, blogId, idx, userId) => {
        e.stopPropagation();
        try {
            if (!userId) throw new Error('User ID is missing');
            const res = await api.put('/blog/like', { blogId, userId });
            const { likeCount, liked } = res.data;
            setSampleDatas(prev => prev.map((item, i) => i === idx ? { ...item, like: likeCount, liked } : item));
            if (onReload) onReload();
        } catch (error) {
            console.error('Error liking blog:', error.message);
        }
    };

    const handleSave = async (e, blogId, idx) => {
        e.stopPropagation();
        try {
            if (!profileData._id) throw new Error('User ID is missing');
            const res = await api.post('/blog/save', { blogId, userId: profileData._id });
            if (res.data.saved) ToastBlog("Saved Post");
            setSampleDatas((data) => data.map((d, i) => i === idx ? { ...d, saved: res.data.saved } : d));
            if (onReload) onReload();
        } catch (err) {
            console.error('Error saving blog:', err.message);
        }
    };

    const toggleHover = (key, value) => {
        setHoverMenu(prev => ({ ...prev, [key]: value }));
    };

    const getHoverStyle = (isHovered) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        cursor: 'pointer',
        transition: 'background 0.2s',
        backgroundColor: isHovered ? '#f1f5f9' : 'transparent',
        borderRadius: '8px',
        fontSize: '14px'
    });

    const dropdownContainer = {
        position: "absolute",
        top: "35px",
        right: "0",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0",
        width: "160px",
        padding: "4px",
        zIndex: 100
    };

    if (sampleDatas.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No posts to show.</div>;
    }

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
            padding: "10px"
        }}>
            {sampleDatas.map((item, idx) => {
                const isOwnProfile = item.user?._id === profileData?._id;

                return (
                    <motion.div
                        key={item._id || idx}
                        whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)" }}
                        style={{
                            background: "white",
                            borderRadius: "16px",
                            overflow: "hidden",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                            transition: "all 0.22s ease",
                            position: "relative",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate(`/blog/${item._id}`)}
                    >
                        {/* --- MENU BUTTON --- */}
                        <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                            <ButtonTrans
                                child={<MoreVertical size={22} strokeWidth="2px" color={item.image ? "white" : "#3e4b5d"} />}
                                buttonType="button"
                                noToolTip={true}
                                paddingEdit="1px"
                                ClickEvent={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(activeMenu === item._id ? null : item._id);
                                }}
                                hover={hover1 === item._id}
                                label="Post options"
                                mouseEnter={() => setHover1(item._id)}
                                mouseLeave={() => setHover1(null)}

                            />

                            <AnimatePresence>
                                {activeMenu === item._id && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                        style={dropdownContainer}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {isOwnProfile ? (
                                            <>
                                                <div style={getHoverStyle(hoverMenu.hover1)} onMouseEnter={() => toggleHover('hover1', true)} onMouseLeave={() => toggleHover('hover1', false)}>
                                                    <Edit2 size={16} style={{ marginRight: '8px' }} />
                                                    <span>Edit Post</span>
                                                </div>
                                                <div style={{ ...getHoverStyle(hoverMenu.hover2), color: "#e74c3c" }}
                                                    onClick={async () => {
                                                        const ids = item._id;
                                                        if (!window.confirm(`Are you sure you want to delete the post?`)) return;
                                                        try {
                                                            await bulkAction("delete", ids);
                                                            ToastBlog("Post Deleted");
                                                            await fetchPosts();
                                                        } catch (err) {
                                                            console.log("Failed to Delete:", err);
                                                        }
                                                    }}
                                                    onMouseEnter={() => toggleHover('hover2', true)} onMouseLeave={() => toggleHover('hover2', false)}>
                                                    <Trash2 size={16} style={{ marginRight: '8px' }} />
                                                    <span>Delete</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div style={{ ...getHoverStyle(hoverMenu.hover2), color: "#e74c3c" }} onMouseEnter={() => toggleHover('hover2', true)} onMouseLeave={() => toggleHover('hover2', false)}>
                                                <Flag size={16} style={{ marginRight: '8px' }} />
                                                <span>Report</span>
                                            </div>
                                        )}
                                        <div style={{ height: '1px', backgroundColor: '#eee', margin: '2px 0' }} />
                                        <div style={getHoverStyle(hoverMenu.hover3)} onMouseEnter={() => toggleHover('hover3', true)} onMouseLeave={() => toggleHover('hover3', false)} onClick={() => setActiveMenu(null)}>
                                            <X size={16} style={{ marginRight: '8px' }} />
                                            <span>Close</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* --- IMAGE SECTION --- */}
                        <div style={{
                            height: "160px",
                            background: item.image ? `url(${item.image}) center/cover` : "linear-gradient(135deg, #eddddd, #cca7f1)",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {!item.image && <BlogImage style={{ width: '80%', height: '80%' }} />}
                        </div>

                        {/* --- CONTENT SECTION --- */}
                        <div style={{ padding: "16px" }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                <div style={{ width: '24px', height: '24px', backgroundColor: '#0c5686', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                                    {item.user?.user?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <span style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }} onClick={() => navigate(`/blog/profile/${item.user.username}`)}>{item.user?.username || 'user'}</span>
                            </div>

                            <h3 style={{ margin: "0 0 4px", fontSize: '18px', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', }}>
                                {item.title}
                            </h3>

                            <p style={{ margin: '0 0 10px', fontSize: '14px', color: '#556884', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '40px', lineHeight: '1.5' }}>
                                {item.desc}
                            </p>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: '1.5px solid #cfe0f1', paddingTop: '10px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <ButtonTrans
                                        ClickEvent={(e) => likeBlog(e, item._id, idx, profileData._id)}
                                        child={<>
                                            {item.liked ? <ThumbUpIcon sx={{ fontSize: 20, color: '#3b82f6' }} /> : <ThumbUpOutlinedIcon sx={{ fontSize: 20, color: '#94a3b8' }} />}
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: item.liked ? '#3b82f6' : '#64748b' }}>{item.like}</span>
                                        </>}
                                        buttonType="button"
                                        noToolTip={true}
                                        hover={hover.hoverLike === item._id}
                                        label="Like post"
                                        mouseEnter={() => setHover(prev => ({ ...prev, hoverLike: item._id }))}
                                        mouseLeave={() => setHover(prev => ({ ...prev, hoverLike: null }))}
                                        paddingEdit="2px 6px"
                                    />
                                    <ButtonTrans
                                        ClickEvent={(e) => { e.stopPropagation(); navigate(`/blog/${item._id}#comments`); }}
                                        child={<>
                                            <MessageSquareText size={20} />
                                            <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.comments?.length || 0}</span>
                                        </>}
                                        buttonType="button"
                                        noToolTip={true}
                                        label="View comments"
                                        hover={hover.hoverComment === item._id}
                                        mouseEnter={() => setHover(prev => ({ ...prev, hoverComment: item._id }))}
                                        mouseLeave={() => setHover(prev => ({ ...prev, hoverComment: null }))}
                                        paddingEdit="2px 6px"
                                    />
                                    <ButtonTrans
                                        ClickEvent={async () => {
                                            const blogUrl = `${window.location.origin}/blog/${item._id}`;

                                            const shareData = {
                                                title: item.title,
                                                text: `Check out this post: ${item.title}`,
                                                url: blogUrl
                                            };

                                            try {
                                                if (navigator.share) {
                                                    await navigator.share(shareData);
                                                } else {
                                                    await navigator.clipboard.writeText(blogUrl);
                                                    ToastBlog("Link copied to clipboard!");
                                                }
                                            } catch (err) {
                                                console.log("Error sharing", err);
                                            }
                                        }}
                                        child={<>
                                            <Share2 size={18} color='#8497b1' />
                                        </>}
                                        buttonType={"button"}
                                        noToolTip={true}
                                        label={"Share Post"}
                                        paddingEdit="4px"
                                        hover={hover.hoverShare === item._id}
                                        mouseEnter={() => setHover(prev => ({ ...prev, hoverShare: item._id }))}
                                        mouseLeave={() => setHover(prev => ({ ...prev, hoverShare: null }))}
                                    />
                                </div>

                                <ButtonTrans
                                    ClickEvent={(e) => handleSave(e, item._id, idx)}
                                    child={item.saved ? <BookmarkIcon sx={{ fontSize: 20, color: '#3b82f6' }} /> : <BookmarkBorderOutlinedIcon sx={{ fontSize: 20, color: '#94a3b8' }} />}
                                    buttonType={"button"}
                                    noToolTip={true}
                                    label={item.saved ? "Unsave Post" : "Save Post"}
                                    paddingEdit="4px"
                                    hover={hover.hoverSave === item._id}
                                    mouseEnter={() => setHover(prev => ({ ...prev, hoverSave: item._id }))}
                                    mouseLeave={() => setHover(prev => ({ ...prev, hoverSave: null }))}
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}