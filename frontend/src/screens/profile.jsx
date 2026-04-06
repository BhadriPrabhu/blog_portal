import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Edit3, MapPin, Link as LinkIcon, Calendar, Grid, Bookmark, Heart,
    Users, UserPlus, Share2, MoreHorizontal, AlertCircle,
    TextSelect,
    RotateCw,
    X,
    MoreVertical,
    Edit2,
    Trash2,
    Flag,
    Activity
} from "lucide-react";
import ButtonTrans from "../components/buttonTran";
import ToastBlog from "../utils/toast";
import { bulkAction, editProfileData, fetchLikedBlogs, fetchMyPosts, fetchSavedBlogs, getProfileData, incrementShareCount, incrementViewCount, toggleFollow } from "../utils/api";
import Button from "../components/button";
import EditProfileModal from "../components/editProfileModal";
import { uploadImageToCloudinary } from "../utils/imageUrl";
import { useStore } from "../data/zustand";
import Dialog from "../components/dialog";
import BlogImage from "../assets/icons/blogImage.jsx";

export default function ProfilePage() {
    const { username: urlUsername } = useParams();
    const navigate = useNavigate();
    const { profileData: loggedInUser, setProfileData } = useStore();

    const [activeTab, setActiveTab] = useState("Posts");
    const [user, setUser] = useState(null);
    const [myPost, setMyPost] = useState(null);
    const [savedPost, setSavedPost] = useState(null);
    const [likedPost, setLikedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hover1, setHover1] = useState(false);
    const [hover2, setHover2] = useState(false);
    const [hover3, setHover3] = useState(false);
    const [hover4, setHover4] = useState(false);
    const [openPreview, setOpenPreview] = useState(false);
    const [openPreviewData, setOpenPreviewData] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editData, setEditData] = useState({
        user: "",
        bio: "",
        location: "",
        website: "",
        avatar: "",
        coverImage: "",
        avatarFile: null,
        coverImageFile: null,
    });

    const isOwnProfile = !urlUsername || urlUsername === loggedInUser?.username;

    const fetchPosts = React.useCallback(async (targetId) => {
        if (!targetId) return;
        try {
            const result = await fetchMyPosts(targetId);
            setMyPost(result.data);
            console.log("Fetched my posts:", result.data);
        } catch (err) {
            console.error("Failed to fetch posts:", err);
        }
        try {
            const saved = await fetchSavedBlogs(targetId);
            setSavedPost(saved.data);
        } catch (err) {
            console.log("Failed to fetch saved post:", err)
        }
        try {
            const liked = await fetchLikedBlogs(targetId);
            setLikedPost(liked.data);
        } catch (err) {
            console.log("Failed to fetch liked post:", err);
        }
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            setError(null);

            if (isOwnProfile) {
                setUser(loggedInUser);
                if (loggedInUser?._id) fetchPosts(loggedInUser._id);
                setLoading(false);
            }

            try {
                const res = await getProfileData(urlUsername);
                const fetchedUser = res.data;
                console.log("Fetched user data:", fetchedUser);
                setUser(fetchedUser);

                // Use the local variable instead of state
                if (fetchedUser?._id) {
                    fetchPosts(fetchedUser._id);
                }
            } catch (err) {
                setError("Could not load profile. User might not exist.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [urlUsername, loggedInUser, isOwnProfile, fetchPosts]);


    // Added fetchPosts to dependency array since it's wrapped in useCallback
    const tabs = [
        { name: "Posts", icon: <Grid size={18} /> },
        { name: "Saved", icon: <Bookmark size={18} /> },
        { name: "Liked", icon: <Heart size={18} /> },
    ];

    if (loading) {
        return (
            <div style={{
                minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <RotateCw size={48} color="#3498DB" />
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

    const handleFollow = async (targetUserId) => {
        try {
            const res = await toggleFollow(targetUserId);

            if (res.data.isFollowing) {
                ToastBlog("Followed successfully!");
            } else {
                ToastBlog("Unfollowed successfully!");
            }

            setUser(prev => ({
                ...prev,
                isFollowing: res.data.isFollowing,
                // UPDATE BOTH: The ID array AND the count
                followers: res.data.isFollowing
                    ? [...(prev.followers || []), loggedInUser._id]
                    : (prev.followers || []).filter(id => id !== loggedInUser._id),
                // This ensures the number in StatItem changes immediately
                followersCount: res.data.isFollowing
                    ? (prev.followersCount || 0) + 1
                    : Math.max(0, (prev.followersCount || 1) - 1)
            }));

        } catch (err) {
            console.error("Error following/unfollowing user:", err);
            ToastBlog("Action failed. Please try again.");
        }
    };

    const handleEditClick = () => {
        setEditData({
            user: displayUser.user || "",
            bio: displayUser.bio || "",
            location: displayUser.location || "",
            website: displayUser.website || "",
            avatar: displayUser.avatar || "",
            coverImage: displayUser.coverImage || "",
            avatarFile: null,
            coverImageFile: null,
        });
        setIsEditModalOpen(true);
    };

    const handleSaveProfile = async () => {
        try {
            setIsUpdating(true); // This turns on the "Uploading..." state in your modal
            let finalData = { ...editData };

            // 1. UPLOAD AVATAR
            // Check if a raw File object exists (created in handleFileChange)
            if (editData.avatarFile) {
                const avatarUrl = await uploadImageToCloudinary(editData.avatarFile);
                // console.log("Avatar upload result:", avatarUrl);
                if (avatarUrl) {
                    finalData.avatar = avatarUrl; // Replace blob: link with https://cloudinary...
                }
            }

            // 2. UPLOAD COVER IMAGE
            if (editData.coverImageFile) {
                const coverUrl = await uploadImageToCloudinary(editData.coverImageFile);
                if (coverUrl) {
                    finalData.coverImage = coverUrl; // Replace blob: link with https://cloudinary...
                }
            }

            // 3. CLEANUP
            // Delete the large File objects so we don't send useless binary data to your Node.js backend
            delete finalData.avatarFile;
            delete finalData.coverImageFile;

            // 4. SAVE TO BACKEND
            // Now res contains the real permanent URLs
            const res = await editProfileData(finalData);

            // 5. UPDATE UI
            const updatedUser = { ...user, ...finalData };
            setUser(updatedUser);
            setProfileData(updatedUser); // Update Zustand

            setIsEditModalOpen(false);
            ToastBlog("Profile updated successfully!");
        } catch (err) {
            console.error("Save Error:", err);
            ToastBlog("Failed to update profile.");
        } finally {
            setIsUpdating(false);
        }
    };
    const displayUser = user || {};

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                maxWidth: "980px",
                width: "100%",
                margin: "0 auto",
                padding: "0 12px 40px",
                fontFamily: "'Poppins', system-ui, sans-serif",
                boxSizing: "border-box",
            }}
        >
            {/* Cover + Avatar wrapper */}
            <div style={{ position: "relative" }}>
                <div
                    style={{
                        height: "clamp(140px, 26vw, 240px)",
                        background: displayUser.coverImage
                            ? `url(${displayUser.coverImage}) center/cover`
                            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        borderRadius: "16px",
                        overflow: "hidden",
                    }}
                    onClick={() => {
                        setOpenPreview(true)
                        setOpenPreviewData(displayUser.coverImage)
                    }}
                >
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        background: "radial-gradient(circle at 30% 70%, rgba(255,255,255,0.12) 0%, transparent 60%)"
                    }} />
                </div>

                {/* Avatar – centered on mobile, left on desktop */}
                <div
                    className="js-avatar-container"
                    style={{
                        position: "absolute",
                        bottom: "-56px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "clamp(108px, 18vw, 136px)",
                        height: "clamp(108px, 18vw, 136px)",
                        borderRadius: "50%",
                        background: "white",
                        padding: "clamp(4px, 0.8vw, 6px)",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                        zIndex: 2,
                        transition: "all 0.2s ease",
                    }}
                >
                    {displayUser.avatar ? (
                        <div onClick={() => {
                            setOpenPreview(true)
                            setOpenPreviewData(displayUser.avatar)
                        }}>
                            <img src={displayUser.avatar} alt="Avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                        </div>
                    ) : (
                        <>
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    background: displayUser.avatar
                                        ? `url(${displayUser.avatar}) center/cover`
                                        : "#3498DB",
                                    color: "white",
                                    fontSize: "clamp(40px, 9vw, 56px)",
                                    fontWeight: "700",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.2)",
                                }}
                            >
                                {!displayUser.avatar && displayUser.username?.[0]?.toUpperCase()}
                            </div>
                        </>
                    )}

                </div>
            </div>

            <Dialog
                children={
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <p style={{ margin: "0px", padding: "0px", fontSize: "20px" }}>Image Preview</p>
                            <ButtonTrans
                                child={<X size={20} />}
                                ClickEvent={() => {
                                    setOpenPreview(false)
                                    setOpenPreviewData(null)
                                    setHover4(false);
                                }}
                                buttonType="button"
                                mouseEnter={() => setHover4(true)}
                                mouseLeave={() => setHover4(false)}
                                hover={hover4}
                                label="Close preview"
                                noToolTip={true}
                            />
                        </div>
                        <img src={openPreviewData} alt="Preview" style={{ width: '500px', height: 'auto' }} />
                    </div>
                }
                onclose={() => {
                    setOpenPreview(false)
                    setOpenPreviewData(null)
                }}
                opened={openPreview}
                width="500px"
                height="auto"
            />

            {/* Main content – extra top padding because avatar overlaps */}
            <div style={{
                paddingTop: "clamp(72px, 14vw, 96px)",
                paddingLeft: "12px",
                paddingRight: "12px",
            }}>
                {/* Action buttons row */}
                <div style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    // marginBottom: "clamp(16px, 4vw, 24px)",
                    flexWrap: "wrap",
                    gap: "12px",
                }}>
                    {/* your existing ButtonTrans + Follow/Share/More buttons – unchanged */}
                    {isOwnProfile ? (
                        <ButtonTrans
                            child={<><Edit3 size={16} /> Edit profile</>}
                            paddingEdit="10px 20px"
                            buttonType="button"
                            noToolTip={true}
                            hover={hover1}
                            mouseEnter={() => setHover1(true)}
                            mouseLeave={() => setHover1(false)}
                            ClickEvent={handleEditClick}
                        />
                    ) : (
                        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                            <Button
                                value={displayUser.isFollowing ? "Unfollow" : "Follow"}
                                onClick={() => handleFollow(displayUser._id)}
                                normalField={displayUser.isFollowing}
                            />
                            <ButtonTrans
                                child={<><Share2 size={18} /></>}
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
                                child={<><MoreHorizontal size={18} /></>}
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

                <EditProfileModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    data={editData}
                    setData={setEditData}
                    onSave={handleSaveProfile}
                    isSaving={isUpdating}
                />

                <h1 style={{
                    margin: "0",
                    fontSize: "clamp(24px, 6.5vw, 32px)",
                    fontWeight: 700,
                    color: "#1e293b",
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px",
                }}>
                    {displayUser.user}
                    {displayUser.role === "admin" && (
                        <span style={{
                            color: "#f0f4faff",
                            backgroundColor: "royalblue",
                            padding: "2px 7px",
                            borderRadius: "10px",
                            fontSize: "clamp(11px, 3vw, 12px)",
                            fontWeight: "bold",
                        }}>
                            Admin
                        </span>
                    )}
                </h1>

                <p style={{
                    color: "#64748b",
                    margin: "0 0 16px",
                    fontSize: "clamp(14px, 4vw, 15px)",
                }}>
                    @{displayUser.username?.toLowerCase() || "username"}
                </p>

                <div style={{
                    color: "#334155",
                    lineHeight: 1.6,
                    margin: "0 0 16px",
                    maxWidth: "680px",
                    whiteSpace: "pre-wrap",
                    fontSize: "clamp(14px, 3.8vw, 15.5px)",
                }}>
                    {displayUser.bio || (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <TextSelect size={18} color="grey" />
                            <p style={{ margin: 0 }}>No bio yet - tell the world who you are</p>
                        </div>
                    )}
                </div>

                {/* Meta row – better wrapping on small screens */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "clamp(16px, 4vw, 32px)",
                    color: "#64748b",
                    fontSize: "clamp(13px, 3.5vw, 14px)",
                    marginBottom: "16px",
                    alignItems: "center",
                }}>
                    {displayUser.location && <MetaItem icon={MapPin} text={displayUser.location} />}
                    {displayUser.website && <MetaItem icon={LinkIcon} text={displayUser.website} isLink href={displayUser.website} />}
                    <MetaItem icon={Calendar} text={`Joined ${displayUser.joined || "2025"}`} />
                </div>

                {/* Stats – updated to use Count properties */}
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "clamp(24px, 5vw, 48px)",
                    marginBottom: "24px",
                }}>
                    <StatItem
                        count={displayUser.followersCount || 0} // Change this
                        label="Followers"
                        onClick={() => navigate(`/profile/${displayUser.username}/followers`)}
                    />
                    <StatItem
                        count={displayUser.followingCount || 0} // Change this
                        label="Following"
                        onClick={() => navigate(`/profile/${displayUser.username}/following`)}
                    />
                    <StatItem
                        count={myPost?.length || 0}
                        label="Posts"
                    />
                </div>

                {/* Tabs – horizontal scroll support */}
                <div style={{
                    display: "flex",
                    borderBottom: "1px solid #e2e8f0",
                    marginBottom: "24px",
                    overflowX: "auto",
                    scrollbarWidth: "none", // firefox
                    msOverflowStyle: "none", // ie
                }}
                    className="hide-scrollbar"
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            style={{
                                padding: "clamp(12px, 3vw, 14px) clamp(16px, 4vw, 24px)",
                                background: "transparent",
                                border: "none",
                                borderBottom: activeTab === tab.name ? "3px solid #3b82f6" : "3px solid transparent",
                                color: activeTab === tab.name ? "#1e40af" : "#64748b",
                                fontWeight: activeTab === tab.name ? 600 : 500,
                                fontSize: "clamp(14px, 3.8vw, 15px)",
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

                {/* Tab content – unchanged except minor padding tweak */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        style={{ minHeight: "40vh" }}
                    >
                        {activeTab === "Posts" && <PostGrid posts={myPost || []} navigate={navigate} tab={activeTab} ownProfile={isOwnProfile} onRefresh={() => fetchPosts(user?._id)} />}
                        {activeTab === "Saved" && <PostGrid posts={savedPost || []} navigate={navigate} tab={activeTab} ownProfile={isOwnProfile} onRefresh={() => fetchPosts(user?._id)} />}
                        {activeTab === "Liked" && <PostGrid posts={likedPost || []} navigate={navigate} tab={activeTab} ownProfile={isOwnProfile} onRefresh={() => fetchPosts(user?._id)} />}
                    </motion.div>
                </AnimatePresence>
            </div>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                @media (min-width: 640px) {
                    .js-avatar-container {
                        left: 24px !important;
                        transform: none !important;
                        bottom: -64px !important;
                    }
                }

                @media (min-width: 768px) {
                    .js-avatar-container {
                        width: 136px !important;
                        height: 136px !important;
                    }
                }
            `}</style>
        </motion.div >
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

const PostGrid = ({ posts, navigate, tab, ownProfile, onRefresh }) => {
    // Keep your existing EmptyState logic...
    if (!posts?.length) {
        if (tab === "Posts") return <EmptyState icon={<Grid size={48} />} message="No posts yet" />;
        if (tab === "Saved") return <EmptyState icon={<Bookmark size={48} />} message="No saved posts yet" />;
        if (tab === "Liked") return <EmptyState icon={<Heart size={48} />} message="No liked posts yet" />;
    }

    const [hover1, setHover1] = useState(null);
    const [activeMenu, setActiveMenu] = React.useState(null);
    const [hoverMenu, setHoverMenu] = useState({
        hover1: false,
        hover2: false,
        hover3: false,
    });
    const [trigger, setTrigger] = useState(0);

    const toggleHover = (key, value) => {
        setHoverMenu(prev => ({ ...prev, [key]: value }));
    };

    const handleDelete = async (postId) => {
        if (!window.confirm(`Are you sure you want to delete the post?`)) return;
        try {
            await bulkAction("delete", postId);
            ToastBlog("Post Deleted");
            if (onRefresh) onRefresh();
        } catch (err) {
            console.log("Failed to Delete:", err);
        }
    }

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
        }}>
            {posts.map(post => (
                <motion.div
                    key={post._id}
                    whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.12)" }}
                    style={{
                        background: "white",
                        borderRadius: "16px",
                        overflow: "hidden",
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                        transition: "all 0.22s ease",
                        position: "relative", // Required for absolute positioning of the dots
                        cursor: "pointer"
                    }}
                    onClick={async () => {
                        navigate(`/blog/${post._id}`)
                        if(!ownProfile){
                            try {
                                await incrementViewCount(post._id);
                            } catch (err) {
                                console.error("Error incrementing view count:", err);
                            }
                        }
                    }}
                >
                    {/* --- THREE DOTS MENU --- */}
                    <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10 }}>
                        <ButtonTrans
                            child={<MoreVertical size={22} strokeWidth="2px" color={post.image ? "white" : "#3e4b5d"} />}
                            buttonType="button"
                            noToolTip={true}
                            paddingEdit="1px"
                            ClickEvent={(e) => {
                                e.stopPropagation();
                                setActiveMenu(activeMenu === post._id ? null : post._id);
                            }}
                            hover={hover1 === post._id}
                            label="Post options"
                            mouseEnter={() => setHover1(post._id)}
                            mouseLeave={() => setHover1(null)}

                        />
                        <AnimatePresence>
                            {activeMenu === post._id && (
                                <>
                                    {ownProfile ? (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -5 }} // Gentler scale/move
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }} // Smoother timing
                                                style={dropdownContainer}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Edit - Neutral Action */}
                                                <div
                                                    style={getHoverStyle(hoverMenu.hover1)}
                                                    onMouseEnter={() => toggleHover('hover1', true)}
                                                    onMouseLeave={() => toggleHover('hover1', false)}
                                                // onClick={() => handleEdit(post._id)}
                                                >
                                                    <Edit2 size={16} style={{ marginRight: '8px' }} />
                                                    <span>Edit Post</span>
                                                </div>

                                                {/* Divider Line */}
                                                <div style={{ height: '1px', backgroundColor: '#eee', margin: '2px 0' }} />

                                                {/* Delete - Destructive Action */}
                                                <div
                                                    style={{ ...getHoverStyle(hoverMenu.hover2), color: "#e74c3c" }}
                                                    onMouseEnter={() => toggleHover('hover2', true)}
                                                    onMouseLeave={() => toggleHover('hover2', false)}
                                                    onClick={() => handleDelete(post._id)}
                                                >
                                                    <Trash2 size={16} style={{ marginRight: '8px' }} />
                                                    <span>Delete</span>
                                                </div>

                                                <div style={{ height: '1px', backgroundColor: '#eee', margin: '2px 0' }} />

                                                <div
                                                    style={{ ...getHoverStyle(hoverMenu.hover3), color: "gray" }}
                                                    onMouseEnter={() => toggleHover('hover3', true)}
                                                    onMouseLeave={() => toggleHover('hover3', false)}
                                                    onClick={() => {
                                                        setActiveMenu(null);
                                                    }}
                                                >
                                                    <X size={16} style={{ marginRight: '8px' }} />
                                                    <span>Close</span>
                                                </div>
                                            </motion.div>
                                        </>) : (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: -5 }} // Gentler scale/move
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                                transition={{ duration: 0.2, ease: "easeOut" }} // Smoother timing
                                                style={dropdownContainer}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {/* Share - Neutral Action */}
                                                <div
                                                    style={getHoverStyle(hoverMenu.hover1)}
                                                    onMouseEnter={() => toggleHover('hover1', true)}
                                                    onMouseLeave={() => toggleHover('hover1', false)}
                                                    onClick={async () => {
                                                        const blogUrl = `${window.location.origin}/blog/${post._id}`;

                                                        const shareData = {
                                                            title: post.title,
                                                            text: `Check out this post: ${post.title}`,
                                                            url: blogUrl
                                                        };

                                                        try {
                                                            await incrementShareCount(post._id); 
                                                        } catch (err) {
                                                            console.error("Error incrementing share count:", err);
                                                        }

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
                                                >
                                                    <Share2 size={16} style={{ marginRight: '8px' }} />
                                                    <span>Share</span>
                                                </div>

                                                {/* Divider Line */}
                                                <div style={{ height: '1px', backgroundColor: '#eee', margin: '2px 0' }} />

                                                {/* Report - Destructive Action */}
                                                <div
                                                    style={{ ...getHoverStyle(hoverMenu.hover2), color: "#e74c3c" }}
                                                    onMouseEnter={() => toggleHover('hover2', true)}
                                                    onMouseLeave={() => toggleHover('hover2', false)}
                                                // onClick={() => handleDelete(post._id)}
                                                >
                                                    <Flag size={16} style={{ marginRight: '8px' }} />
                                                    <span>Report</span>
                                                </div>

                                                <div style={{ height: '1px', backgroundColor: '#eee', margin: '2px 0' }} />

                                                <div
                                                    style={{ ...getHoverStyle(hoverMenu.hover3), color: "gray" }}
                                                    onMouseEnter={() => toggleHover('hover3', true)}
                                                    onMouseLeave={() => toggleHover('hover3', false)}
                                                    onClick={() => {
                                                        setActiveMenu(null);
                                                    }}
                                                >
                                                    <X size={16} style={{ marginRight: '8px' }} />
                                                    <span>Close</span>
                                                </div>
                                            </motion.div>
                                        </>)}


                                </>

                            )}
                        </AnimatePresence>
                    </div>

                    {/* Image Section */}
                    <div style={{
                        height: "160px",
                        background: post.image ? `url(${post.image}) center/cover` : "linear-gradient(135deg, #eddddd, #cca7f1)",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {!post.image && <BlogImage style={{ width: '80%', height: '80%' }} />}

                    </div>

                    {/* Content Section */}
                    <div style={{ padding: "20px" }}>
                        <h3 style={{ margin: "0 0 8px", fontSize: "17px", fontWeight: 600, lineHeight: 1.4, height: "48px", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {post.title}
                        </h3>
                        <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: "13px" }}>
                            <span>{new Date(post.date).toLocaleDateString()}</span>
                            <div style={{ display: "flex", gap: "16px" }}>
                                <span>{typeof post.like === 'object' ? post.like.length : post.like} likes</span>
                                <span>{post.comments?.length || 0} comments</span>
                            </div>
                        </div>
                    </div>
                    {/* Replace your single line with this logic-driven component */}
                    {(() => {
                        // 1. Define configuration for each status
                        const statusConfig = {
                            report: {
                                label: "Reported Content",
                                bg: "#FEF2F2", // Light Red
                                text: "#DC2626", // Dark Red
                                icon: <Flag size={14} strokeWidth={3} />
                            },
                            deleted: {
                                label: "Deleted Content",
                                bg: "#F1F5F9", // Light Gray
                                text: "#64748B", // Slate Gray
                                icon: <Trash2 size={14} strokeWidth={3} />
                            },
                            active: {
                                label: "Active Content",
                                bg: "#F0FDF4", // Light Green
                                text: "#16A34A", // Dark Green
                                icon: <Activity size={14} strokeWidth={3} /> // Active usually doesn't need a loud label, but keep for consistency
                            }
                        };

                        const config = statusConfig[post.status] || statusConfig.active;

                        return (
                            <div style={{
                                fontSize: "13px",
                                textAlign: "center",
                                backgroundColor: config.bg,
                                color: config.text,
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                padding: "6px 12px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "6px",
                                borderTop: "1px solid rgba(0,0,0,0.05)",
                                // Ensure it fits perfectly at the bottom of your card
                                borderBottomLeftRadius: "16px",
                                borderBottomRightRadius: "16px"
                            }}>
                                {config.icon}
                                {config.label}
                            </div>
                        );
                    })()}
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

const dropdownContainer = {
    position: "absolute",
    top: "0",
    right: "0",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    border: "1px solid #f1f5f9",
    width: "120px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    padding: "4px",
    zIndex: 101
};

const menuItem = {
    padding: "6px 10px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#475569",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderRadius: "8px",
    transition: "background 0.2s",
    // Adding a quick hover effect
    ":hover": { backgroundColor: "#f8fafc" }
};

const getHoverStyle = (isHovered) => ({
    ...menuItem,
    backgroundColor: isHovered ? "#f4f0f0" : "transparent", // Light gray on hover
    transition: "background-color 0.2s ease"
});