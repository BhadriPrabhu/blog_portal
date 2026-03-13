import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "../data/zustand";
import { motion, AnimatePresence } from "framer-motion";
import {
    Edit3, MapPin, Link as LinkIcon, Calendar, Grid, Bookmark, Heart,
    Users, UserPlus, Share2, MoreHorizontal, AlertCircle,
    TextSelect
} from "lucide-react";
import ButtonTrans from "../components/buttonTran";
import ToastBlog from "../utils/toast";

export default function ProfilePage() {
    const { username: urlUsername } = useParams();
    const navigate = useNavigate();
    const loggedInUser = useStore((state) => state.profileData);

    const [activeTab, setActiveTab] = useState("Posts");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hover1, setHover1] = useState(false);
    const [hover2, setHover2] = useState(false);
    const [hover3, setHover3] = useState(false);

    const isOwnProfile = !urlUsername || urlUsername === loggedInUser?.username;

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);

            if (isOwnProfile) {
                setUser(loggedInUser);
                setLoading(false);
                return;
            }

            try {
                // const res = await getUserProfile(urlUsername);
                // setUser(res.data);
                // For now — demo data when viewing other profile
                setUser({
                    username: urlUsername || "mysteryuser",
                    bio: "Exploring ideas, building in public, and drinking too much coffee ☕",
                    avatar: null,
                    location: "Coimbatore, India",
                    website: "https://example.com",
                    joined: "October 2025",
                    followers: 2840,
                    following: 612,
                    posts: [
                        { id: 1, title: "Building a blog platform from scratch", likes: 142, comments: 28, date: "2025-12-10" },
                        { id: 2, title: "My 2026 goals & how I'm tracking them", likes: 89, comments: 14, date: "2026-01-05" },
                        // ... more
                    ]
                });
            } catch (err) {
                setError("Could not load profile. User might not exist.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [urlUsername, loggedInUser, isOwnProfile]);

    const tabs = [
        { name: "Posts", icon: <Grid size={18} /> },
        { name: "Saved", icon: <Bookmark size={18} /> },
        { name: "Liked", icon: <Heart size={18} /> },
    ];

    if (loading) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                >
                    <div style={{ fontSize: 48, color: "#3498DB" }}>⟳</div>
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: "center", padding: "80px 20px", color: "#e74c3c" }}>
                <AlertCircle size={64} style={{ marginBottom: 16 }} />
                <h2 style={{ margin: "16px 0 8px" }}>Oops...</h2>
                <p>{error}</p>
            </div>
        );
    }

    const displayUser = user || {};

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                maxWidth: "960px",
                minWidth: "800px",
                margin: "0 auto",
                padding: "0 16px 40px",
                fontFamily: "'Poppins', system-ui, sans-serif",
                zIndex: 1,
                position: "relative",
            }}
        >
            {/* Cover + Avatar Section */}
            <div style={{ position: "relative", zIndex: 0, }}>
                <div
                    style={{
                        height: "clamp(180px, 28vw, 260px)",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "16px",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.12) 0%, transparent 60%)"
                    }} />
                </div>

                <div
                    style={{
                        position: "absolute",
                        bottom: "-64px",
                        left: "24px",
                        width: "128px",
                        height: "128px",
                        borderRadius: "50%",
                        background: "white",
                        padding: "6px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            background: displayUser.avatar ? `url(${displayUser.avatar}) center/cover` : "#3498DB",
                            color: "white",
                            fontSize: "52px",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2)",
                        }}
                    >
                        {!displayUser.avatar && displayUser.username?.[0]?.toUpperCase()}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ paddingTop: "80px", paddingLeft: "24px", paddingRight: "24px" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
                    {isOwnProfile ? (
                        <ButtonTrans
                            child={<><Edit3 size={16} /> Edit profile</>}
                            paddingEdit="10px 20px"
                            buttonType="button"
                            noToolTip={true}
                            hover={hover1}
                            mouseEnter={() => setHover1(true)}
                            mouseLeave={() => setHover1(false)}

                        />
                    ) : (
                        <div style={{ display: "flex", gap: "12px" }}>
                            <button
                                style={{
                                    padding: "8px 20px",
                                    background: "#3498DB",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "10px",
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    fontFamily: "Poppins"
                                }}
                            >
                                Follow
                            </button>
                            {/* <button
                                style={{
                                    padding: "10px 16px",
                                    background: "transparent",
                                    border: "1px solid #cbd5e1",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                }}
                            >

                            </button> */}
                            <ButtonTrans
                                child={<>
                                    <Share2 size={18} />
                                </>}
                                buttonType="button"
                                label="Share"
                                noToolTip={true}
                                paddingEdit="2px 8px"
                                hover={hover2}
                                mouseEnter={() => setHover2(true)}
                                mouseLeave={() => setHover2(false)}
                                ClickEvent={async () => {
                                    const ShareURL = `${window.location.origin}/blog/profile/${displayUser.username}`
                                    const shareData = {
                                        title: "Profile Page",
                                        text: `Check out the page of the User: ${displayUser.username}`,
                                        url: ShareURL,
                                    };

                                    try {
                                        if (navigator.share) {
                                            await navigator.share(shareData);
                                        } else {
                                            await navigator.clipboard.writeText(ShareURL);
                                            ToastBlog("Link copied to Clipboard!");
                                        }
                                    } catch (err) {
                                        console.log("Error", err);
                                    }
                                }}
                            />
                            <ButtonTrans
                                child={<>
                                    <MoreHorizontal size={18} />
                                </>}
                                buttonType="button"
                                label="More"
                                noToolTip={true}
                                hover={hover3}
                                mouseEnter={() => setHover3(true)}
                                mouseLeave={() => setHover3(false)}
                                paddingEdit="2px 8px"
                            />
                        </div>
                    )}
                </div>

                <h1 style={{ margin: "0 0 4px", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: 700, color: "#1e293b", display: "flex", flexDirection: "row", alignItems: "center" }}>
                    {displayUser.user}
                    {displayUser.role === "admin" && (
                        // <span style={{
                        //     fontSize: "12px",
                        //     background: "#3b82f6",
                        //     color: "white",
                        //     padding: "3px 10px",
                        //     borderRadius: "999px",
                        //     marginLeft: "12px",
                        //     verticalAlign: "middle",
                        // }}>
                        //     ADMIN
                        // </span>
                        <span style={{ color: "#f0f4faff", backgroundColor: "blue", padding: "2px 7px", borderRadius: "10px", fontSize: "12px", fontWeight: "bold", marginLeft: "10px" }}>Admin</span>
                    )}
                </h1>

                <p style={{ color: "#64748b", margin: "0 0 16px", fontSize: "15px" }}>
                    @{displayUser.username?.toLowerCase() || "username"}
                </p>

                <div style={{
                    color: "#334155",
                    lineHeight: 1.6,
                    margin: "0 0 24px",
                    maxWidth: "680px",
                    whiteSpace: "pre-wrap",
                    display: "flex",
                    flexDirection: "row",
                }}>
                    {displayUser.bio || <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}>
                        <TextSelect size="32px" color="grey" />
                        <p style={{ margin: "0px", whiteSpace: "pre-wrap", }}>No bio yet - tell the world who you are</p>

                    </div>
                    }
                </div>

                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "24px 32px",
                    color: "#64748b",
                    fontSize: "14px",
                    marginBottom: "12px",
                    alignItems: "center"
                }}>
                    {displayUser.location && <MetaItem icon={MapPin} text={displayUser.location} />}
                    {displayUser.website && <MetaItem icon={LinkIcon} text={displayUser.website} isLink href={displayUser.website} />}
                    <MetaItem icon={Calendar} text={`Joined ${displayUser.joined || "2025"}`} />
                </div>

                {/* Stats */}
                <div style={{
                    display: "flex",
                    gap: "clamp(32px, 6vw, 64px)",
                    marginBottom: "12px",
                    flexWrap: "wrap",
                }}>
                    <StatItem count={displayUser.followers || 0} label="Followers" onClick={() => navigate(`/profile/${displayUser.username}/followers`)} />
                    <StatItem count={displayUser.following || 0} label="Following" onClick={() => navigate(`/profile/${displayUser.username}/following`)} />
                    <StatItem count={displayUser.posts?.length || 0} label="Posts" />
                </div>

                {/* Tabs */}
                <div style={{
                    display: "flex",
                    borderBottom: "1px solid #e2e8f0",
                    marginBottom: "24px",
                    overflowX: "auto",
                }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            style={{
                                padding: "14px 24px",
                                background: "transparent",
                                border: "none",
                                borderBottom: activeTab === tab.name ? "3px solid #3b82f6" : "3px solid transparent",
                                color: activeTab === tab.name ? "#1e40af" : "#64748b",
                                fontWeight: activeTab === tab.name ? 600 : 500,
                                fontSize: "15px",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                whiteSpace: "nowrap",
                                transition: "all 0.2s",
                                fontFamily: "Poppins"
                            }}
                        >
                            {tab.icon}
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        style={{ fontFamily: "'Poppins', system-ui, sans-serif", }}
                    >
                        {activeTab === "Posts" && <PostGrid posts={displayUser.posts || []} />}
                        {activeTab === "Saved" && <EmptyState icon={<Bookmark size={48} />} message="No saved posts yet" />}
                        {activeTab === "Liked" && <EmptyState icon={<Heart size={48} />} message="No liked posts yet" />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.div>
    );
}


const MetaItem = ({ icon: Icon, text, isLink, href }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Icon size={16} strokeWidth={2.2} />
        {isLink ? (
            <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "none" }}>
                {text}
            </a>
        ) : (
            <span>{text}</span>
        )}
    </div>
);

const StatItem = ({ count, label, onClick }) => (
    <div
        onClick={onClick}
        style={{
            cursor: onClick ? "pointer" : "default",
            textAlign: "center",
            padding: "8px 16px",
            borderRadius: "12px",
            transition: "background 0.18s",
        }}
        onMouseEnter={e => onClick && (e.currentTarget.style.background = "#f1f5f9")}
        onMouseLeave={e => onClick && (e.currentTarget.style.background = "transparent")}
    >
        <div style={{ fontSize: "20px", fontWeight: 700, color: "#1e293b" }}>
            {count.toLocaleString()}
        </div>
        <div style={{ fontSize: "13px", color: "#64748b", marginTop: "2px" }}>
            {label}
        </div>
    </div>
);

const PostGrid = ({ posts }) => {
    if (!posts?.length) {
        return <EmptyState icon={<Grid size={48} />} message="No posts yet" />;
    }

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
        }}>
            {posts.map(post => (
                <motion.div
                    key={post.id}
                    whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)" }}
                    style={{
                        background: "white",
                        borderRadius: "16px",
                        overflow: "hidden",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                        transition: "all 0.22s ease",
                    }}
                >
                    <div style={{ height: "160px", background: "linear-gradient(135deg, #a5b4fc, #c084fc)" }} />
                    <div style={{ padding: "20px" }}>
                        <h3 style={{ margin: "0 0 8px", fontSize: "17px", fontWeight: 600, lineHeight: 1.4 }}>
                            {post.title}
                        </h3>
                        <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "13px" }}>
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                            <div style={{ display: "flex", gap: "16px" }}>
                                <span>{post.likes} likes</span>
                                <span>{post.comments} comments</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const EmptyState = ({ icon, message }) => (
    <div style={{
        textAlign: "center",
        padding: "100px 20px",
        color: "#94a3b8",
    }}>
        <div style={{ opacity: 0.4, marginBottom: "24px" }}>
            {icon}
        </div>
        <p style={{ fontSize: "18px", fontWeight: 500 }}>{message}</p>
    </div>
);