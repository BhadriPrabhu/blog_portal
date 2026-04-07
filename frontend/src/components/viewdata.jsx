import React from "react";
import CommentData from "./commentData";
import { useParams, useNavigate } from "react-router-dom";
import api, { getBlog, incrementShareCount } from "../utils/api";
import ButtonTrans from "./buttonTran";
import { motion } from "framer-motion";
import { ArrowLeft, Share2, MessageSquareText } from "lucide-react";
import ThumbUpIcon from '@mui/icons-material/ThumbUp'; 
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import ToastBlog from "../utils/toast";
import { useStore } from "../data/zustand";

export default function ViewData() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [hover1, setHover1] = React.useState(false);
    const [hover2, setHover2] = React.useState(false);
    const [hover3, setHover3] = React.useState(false);
    const [hover4, setHover4] = React.useState(false);
    const [hover5, setHover5] = React.useState(false);

    const profileData = useStore((state) => state.profileData);

    React.useEffect(() => {
        const loadBlog = async () => {
            setLoading(true);
            try {
                const res = await getBlog(id, profileData._id);
                const data = res.data;

                const processedData = {
                    ...data,
                    like: data.like ?? (data.likedBy?.length || 0)
                };

                setBlog(processedData);
            } catch (err) {
                console.error("Link error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) loadBlog();
    }, [id, profileData._id]);

    const likeBlog = async (blogId, userId) => {
        try {
            if (!userId) throw new Error('User ID is missing');
            const res = await api.put('/blog/like', { blogId, userId });
            setBlog(prev => ({ ...prev, like: res.data.likeCount, liked: res.data.liked }));
        } catch (error) {
            console.error('Error liking blog:', error.response?.data || error.message);
        }
    };

    const handleSave = async (blogId) => {
        try {
            if (!profileData._id) throw new Error('User ID is missing');
            const res = await api.post('/blog/save', { blogId, userId: profileData._id });
            if (res.data.saved) {
                ToastBlog("Saved Post");
            }
            setBlog(prev => ({ ...prev, saved: res.data.saved }));
        } catch (err) {
            console.error('Error saving blog:', err.response?.data || err.message);
        }
    };

    const buttonStyle = {
        backgroundColor: 'transparent',
        border: '0px',
        borderRadius: '15px',
        height: '40px', // Increased slightly for better mobile touch target
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Poppins, sans-serif',
        cursor: 'pointer',
        color: '#2C3E50',
        flex: 1, // Allows buttons to distribute evenly on small screens
    };
    const hoverStyle = { backgroundColor: '#9637371a' };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Post...</div>;
    if (!blog) return <div style={{ textAlign: 'center', padding: '50px' }}>Post not found.</div>;

    return (
        <div className="view-container" style={{
            maxWidth: "850px",
            width: "95%", // Responsive width
            margin: "20px auto",
            padding: "clamp(15px, 4vw, 30px)", // Responsive padding
            backgroundColor: "white",
            borderRadius: "12px",
            boxSizing: "border-box",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
            <ButtonTrans
                child={<ArrowLeft size="20px" />}
                buttonType="button"
                noToolTip={true}
                label="back"
                paddingEdit="3px 3px"
                ClickEvent={() => navigate(-1)}
                hover={hover1}
                mouseEnter={() => setHover1(true)}
                mouseLeave={() => setHover1(false)}
            />

            <h1 style={{
                textAlign: "center",
                fontSize: "clamp(20px, 5vw, 28px)", // Fluid typography
                color: "#2C3E50",
                fontFamily: "'Poppins', sans-serif",
                margin: "10px 0 20px 0",
            }}>
                {blog.title}
            </h1>

            {blog.image && (
                <div style={{
                    width: "100%",
                    height: "clamp(200px, 50vw, 450px)", // Fluid height
                    overflow: "hidden",
                    borderRadius: "12px",
                    marginBottom: "24px",
                    backgroundColor: "#F8FAFC"
                }}>
                    <img
                        src={blog.image}
                        alt={blog.title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block"
                        }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            )}

            <p style={{
                fontSize: "clamp(14px, 3.5vw, 15px)",
                color: "#34495E",
                fontFamily: "'Poppins', sans-serif",
                lineHeight: "1.8",
                margin: "20px 0",
                wordBreak: "break-word" // Prevent long text from breaking layout
            }}>
                {blog.desc}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: "30px" }}>
                {blog.tags?.map((tag, index) => (
                    <span key={index} style={{ backgroundColor: '#ECF0F1', color: '#7F8C8D', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                        #{tag}
                    </span>
                ))}
            </div>

            <div className="action-bar" style={{ 
                display: 'flex', 
                justifyContent: 'space-around',
                gap: "10px" 
            }}>
                <motion.button
                    style={hover2 ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                    onMouseEnter={() => setHover2(true)}
                    onMouseLeave={() => setHover2(false)}
                    onClick={() => likeBlog(blog._id, profileData._id)}
                    aria-label={blog.liked ? 'Unlike post' : 'Like post'}
                    whileTap={{ scale: 0.8 }}
                >
                    <motion.div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                        key={blog.liked ? "liked" : "unliked"}
                        initial={{ scale: 1 }}
                        animate={{ scale: blog.liked ? [1, 1.5, 1.2, 1] : 1 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                    >
                        {blog.liked ? <ThumbUpIcon sx={{ fontSize: "20px", color: '#0a82d2ff' }} /> : <ThumbUpOutlinedIcon sx={{ fontSize: "20px", color: 'gray' }} />}
                        <span style={{ fontSize: "14px", fontWeight: "600", color: "#2C3E50" }}>
                            {blog.like || 0}
                        </span>
                    </motion.div>
                </motion.button>

                <motion.button
                    style={hover3 ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                    onMouseEnter={() => setHover3(true)}
                    onMouseLeave={() => setHover3(false)}
                    onClick={() => handleSave(blog._id)}
                    aria-label={blog.saved ? 'Unsave post' : 'Save post'}
                    whileTap={{ scale: 0.8 }}
                >
                    <motion.div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                        key={blog.saved ? "saved" : "unsaved"}
                        initial={{ scale: 1 }}
                        animate={{ scale: blog.saved ? [1, 1.5, 1.2, 1] : 1 }}
                        transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
                    >
                        {blog.saved ? <BookmarkIcon sx={{ fontSize: "22px", color: '#0a82d2ff' }} /> : <BookmarkBorderOutlinedIcon sx={{ fontSize: "22px", color: 'gray' }} />}
                    </motion.div>
                </motion.button>

                <motion.button
                    style={hover4 ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                    onMouseEnter={() => setHover4(true)}
                    onMouseLeave={() => setHover4(false)}
                    onClick={() => {
                        document.getElementById("comment-section").scrollIntoView({ behavior: "smooth" });
                    }}
                    aria-label='View comments'
                >
                    <motion.div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MessageSquareText size="22px" color={hover4 ? 'black' : 'gray'} />
                    </motion.div>
                </motion.button>

                <button
                    style={hover5 ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                    onMouseEnter={() => setHover5(true)}
                    onMouseLeave={() => setHover5(false)}
                    aria-label='Share post'
                    onClick={async () => {
                        const blogUrl = `${window.location.origin}/blog/${blog._id}`;
                        const shareData = { title: blog.title, text: `Check out this post: ${blog.title}`, url: blogUrl };
                        try {
                            await incrementShareCount(blog._id);
                            setBlog(prev => ({ ...prev, shareCount: (prev.shareCount || 0) + 1 }));
                            if (navigator.share) {
                                await navigator.share(shareData);
                            } else {
                                await navigator.clipboard.writeText(blogUrl);
                                ToastBlog("Link copied to clipboard!");
                            }
                        } catch (err) { console.log("Error sharing", err); }
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Share2 size="22px" color={hover5 ? '#3498DB' : 'gray'} />
                    </div>
                </button>
            </div>

            <hr style={{ border: "0.5px solid #f1f1f1", margin: "20px 0" }} />
            <div id="comment-section">
                <CommentData commentData={blog.comments} blogId={blog._id} />
            </div>

            {/* Injected style for cleaner responsive behavior */}
            <style>{`
                @media (max-width: 480px) {
                    .action-bar { gap: 5px !important; }
                    .view-container { width: 100% !important; margin: 0 !important; border-radius: 0 !important; }
                }
            `}</style>
        </div>
    );
}