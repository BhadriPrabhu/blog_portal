import React from "react";
import Button from "./button";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import { useStore } from "../data/zustand";
import axios from "axios";

export default function CommentData({ commentData, blogId }) {
    const [comments, setComments] = React.useState(commentData);
    const [isLoading, setIsLoading] = React.useState(false);
    const profileData = useStore((state) => state.profileData);
    const [hover, setHover] = React.useState({});
    const [newComment, setNewComment] = React.useState("");
    const [suggestions, setSuggestions] = React.useState([]);
    const users = ["Bhadri_Prabhu", "Keshav", "Prabhu_k", "Bhadri_k", "Rahul"];

    React.useEffect(() => {
        const enriched = commentData.map(c => ({
            ...c,
            isReply: false,
            replyText: "",
        }));
        setComments(enriched);
    }, [commentData]);

    const buttonStyle = {
        backgroundColor: "transparent",
        border: "none",
        borderRadius: "12px",
        height: "26px",
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        cursor: isLoading ? "not-allowed" : "pointer",
        color: "#2C3E50",
        fontSize: "14px",
        transition: "background-color 0.2s ease-in-out",
    };

    const hoverStyle = { backgroundColor: isLoading ? "transparent" : "#3498DB33" };

    const handleReply = (commentId) => {
        setComments((prev) =>
            prev.map((val) => ({
                ...val,
                isReply: val._id === commentId ? !val.isReply : false,
            }))
        );
    };

    const handleAdd = async () => {
        if (newComment.trim() === "") {
            alert("Comment cannot be empty!");
            return;
        }
        setIsLoading(true);
        try {
            const result = await axios.post(`http://localhost:3000/blog/${blogId}/comment`, {
                userId: profileData._id,
                value: newComment.trim(),
            });
            setComments((prev) => [...prev, { ...result.data.newComment, isReply: false, replyText: "" }]);
            setNewComment("");
        } catch (err) {
            console.error("Error adding comment:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddReply = async (commentId) => {
        const commentToReply = comments.find(c => c._id === commentId);
        if (!commentToReply.replyText?.trim()) return;
        setIsLoading(true);
        try {
            const result = await axios.post(`http://localhost:3000/blog/${blogId}/comment/${commentId}/reply`, {
                userId: profileData._id,
                value: commentToReply.replyText.trim(),
            });
            const newReply = result.data.newReply;
            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === commentId
                        ? { ...comment, reply: [...comment.reply, newReply], replyText: "", isReply: false }
                        : comment
                )
            );
        } catch (err) {
            console.error("Reply failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (username) => {
        const atIndex = newComment.lastIndexOf("@");
        const before = newComment.slice(0, atIndex + 1);
        setNewComment(before + username + " ");
        setSuggestions([]);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#F7F9FA", borderRadius: "8px", padding: "10px" }}>
            {isLoading && (
                <div style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 10,
                }}>
                    <svg
                        className="animate-spin"
                        width="20"
                        height="20"
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
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <h3 style={{ margin: "5px", padding: "0px", fontSize: "18px", color: "#2C3E50", fontFamily: "'Poppins', sans-serif" }}>
                    Comments
                </h3>
                <div style={{
                    backgroundColor: "#3498DB",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontFamily: "'Poppins', sans-serif",
                }}>
                    {comments.length}
                </div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", margin: "10px 0px", gap: "12px" }}>
                <input
                    placeholder="Write a comment"
                    type="text"
                    value={newComment}
                    onChange={(e) => {
                        setNewComment(e.target.value);
                        const val = e.target.value;
                        const atIndex = val.lastIndexOf("@");
                        if (atIndex >= 0) {
                            const query = val.slice(atIndex + 1).toLowerCase();
                            const filtered = users.filter((u) => u.toLowerCase().startsWith(query));
                            setSuggestions(filtered);
                        } else {
                            setSuggestions([]);
                        }
                    }}
                    style={{
                        height: "32px",
                        width: "83%",
                        fontSize: "14px",
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #D5DBDB",
                        borderRadius: "4px",
                        fontFamily: "'Poppins', sans-serif",
                        padding: "4px 0px 4px 8px",
                        color: "#2C3E50",
                        "&:focus": { outline: "2px solid #3498DB" },
                    }}
                    aria-label="Write a comment"
                />
                <Button
                    value="Add"
                    onClick={handleAdd}
                    style={{
                        backgroundColor: "#3498DB",
                        color: "#FFFFFF",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: "14px",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        border: "none",
                        "&:hover": { backgroundColor: isLoading ? "#3498DB" : "#2980B9" },
                    }}
                    aria-label="Add comment"
                />
            </div>

            {suggestions.length > 0 && (
                <div style={{ backgroundColor: "#E8ECEF", padding: "8px", borderRadius: "4px", border: "1px solid #D5DBDB" }}>
                    {suggestions.map((u) => (
                        <div
                            key={u}
                            style={{ padding: "4px", cursor: "pointer", color: "#2C3E50", fontFamily: "'Poppins', sans-serif", "&:hover": { backgroundColor: "#3498DB33" } }}
                            onClick={() => handleSelect(u)}
                        >
                            @{u}
                        </div>
                    ))}
                </div>
            )}

            {comments.map((item, idx) => {
                // console.log("Comments", item)
                return (
                    <div key={item._id} style={{ padding: "3px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <div style={{
                                width: "24px",
                                height: "24px",
                                backgroundColor: "#3498DB",
                                fontSize: "12px",
                                borderRadius: "50%",
                                color: "#FFFFFF",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                fontFamily: "'Poppins', sans-serif",
                            }}>
                                {item.user?.user?.[0]?.toUpperCase() || "?"}
                            </div>
                            <div style={{ margin: "0px", fontSize: "16px", color: "#2C3E50", fontFamily: "'Poppins', sans-serif", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", gap: "5px" }}><p style={{padding: "0px", margin: "0px"}}>{item.user?.user}</p>{item.user?.email === "bhadri@gmail.com" && <span style={{ color: "#f0f4faff", backgroundColor: "gray", padding: "0px 5px", borderRadius: "10px", fontSize: "12px" }}>Admin</span>}</div>
                        </div>
                        <div style={{ marginLeft: "30px" }}>
                            <p style={{ margin: "0px", fontSize: "14px", color: "#7F8C8D", fontFamily: "'Poppins', sans-serif" }}>{item.value}</p>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    style={hover[`like-${item._id}`] ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                                    onMouseEnter={() => setHover({ ...hover, [`like-${item._id}`]: true })}
                                    onMouseLeave={() => setHover({ ...hover, [`like-${item._id}`]: false })}
                                    onClick={() =>
                                        setComments((prev) =>
                                            prev.map((d) =>
                                                d._id === item._id ? { ...d, liked: true, disliked: false } : d
                                            )
                                        )
                                    }
                                    disabled={isLoading}
                                    aria-label="Like comment"
                                >
                                    {item.liked ? (
                                        <ThumbUpIcon sx={{ width: "20px", height: "20px", color: "#3498DB" }} />
                                    ) : (
                                        <ThumbUpOutlinedIcon sx={{ width: "20px", height: "20px", color: "#2C3E50" }} />
                                    )}
                                </button>
                                <button
                                    style={hover[`dislike-${item._id}`] ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                                    onMouseEnter={() => setHover({ ...hover, [`dislike-${item._id}`]: true })}
                                    onMouseLeave={() => setHover({ ...hover, [`dislike-${item._id}`]: false })}
                                    onClick={() =>
                                        setComments((prev) =>
                                            prev.map((d) =>
                                                d._id === item._id ? { ...d, liked: false, disliked: true } : d
                                            )
                                        )
                                    }
                                    disabled={isLoading}
                                    aria-label="Dislike comment"
                                >
                                    {item.disliked ? (
                                        <ThumbDownIcon sx={{ width: "20px", height: "20px", color: "#E74C3C" }} />
                                    ) : (
                                        <ThumbDownOutlinedIcon sx={{ width: "20px", height: "20px", color: "#2C3E50" }} />
                                    )}
                                </button>
                                <button
                                    style={hover[`reply-${item._id}`] ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                                    onMouseEnter={() => setHover({ ...hover, [`reply-${item._id}`]: true })}
                                    onMouseLeave={() => setHover({ ...hover, [`reply-${item._id}`]: false })}
                                    onClick={() => handleReply(item._id)}
                                    disabled={isLoading}
                                    aria-label="Reply to comment"
                                >
                                    <ReplyIcon sx={{ width: "20px", height: "20px", color: hover[`reply-${item._id}`] ? "#2ECC71" : "#2C3E50" }} />
                                </button>
                            </div>
                            {item.isReply && (
                                <div style={{ display: "flex", justifyContent: "center", margin: "0px 0px 5px 0px", gap: "12px" }}>
                                    <input
                                        placeholder="Add a Reply"
                                        type="text"
                                        value={item.replyText}
                                        onChange={(e) =>
                                            setComments((prev) =>
                                                prev.map((c) =>
                                                    c._id === item._id ? { ...c, replyText: e.target.value } : c
                                                )
                                            )
                                        }
                                        style={{
                                            height: "35px",
                                            width: "85%",
                                            fontSize: "16px",
                                            backgroundColor: "#FFFFFF",
                                            border: "1px solid #D5DBDB",
                                            borderRadius: "4px",
                                            fontFamily: "'Poppins', sans-serif",
                                            padding: "4px 0px 4px 8px",
                                            color: "#2C3E50",
                                            "&:focus": { outline: "2px solid #3498DB" },
                                        }}
                                        aria-label="Add a reply"
                                    />
                                    <Button
                                        value="Add"
                                        onClick={() => handleAddReply(item._id)}
                                        style={{
                                            backgroundColor: "#3498DB",
                                            color: "#FFFFFF",
                                            padding: "8px 16px",
                                            borderRadius: "8px",
                                            fontFamily: "'Poppins', sans-serif",
                                            fontSize: "14px",
                                            cursor: isLoading ? "not-allowed" : "pointer",
                                            border: "none",
                                            "&:hover": { backgroundColor: isLoading ? "#3498DB" : "#2980B9" },
                                        }}
                                        aria-label="Add reply"
                                    />
                                </div>
                            )}
                            {item.reply.length > 0 && (
                                <div style={{ marginLeft: "10px" }}>
                                    {item.reply.map((reply, replyIdx) => (
                                        <div key={reply._id || replyIdx}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <div style={{
                                                    width: "24px",
                                                    height: "24px",
                                                    backgroundColor: "#3498DB",
                                                    fontSize: "12px",
                                                    borderRadius: "50%",
                                                    color: "#FFFFFF",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    fontFamily: "'Poppins', sans-serif",
                                                }}>
                                                    {reply.user?.user?.[0]?.toUpperCase() || "?"}
                                                </div>
                                                <p style={{ margin: "0px", fontSize: "16px", color: "#2C3E50", fontFamily: "'Poppins', sans-serif" }}>{reply.user?.user}</p>
                                            </div>
                                            <div style={{ marginLeft: "30px" }}>
                                                <p style={{ margin: "0px", fontSize: "14px", color: "#7F8C8D", fontFamily: "'Poppins', sans-serif" }}>{reply.value}</p>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <button
                                                        style={hover[`like-reply-${reply._id}`] ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                                                        onMouseEnter={() => setHover({ ...hover, [`like-reply-${reply._id}`]: true })}
                                                        onMouseLeave={() => setHover({ ...hover, [`like-reply-${reply._id}`]: false })}
                                                        onClick={() =>
                                                            setComments((prev) =>
                                                                prev.map((c) =>
                                                                    c._id === item._id
                                                                        ? {
                                                                            ...c,
                                                                            reply: c.reply.map((r, i) =>
                                                                                i === replyIdx ? { ...r, liked: true, disliked: false } : r
                                                                            ),
                                                                        }
                                                                        : c
                                                                )
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                        aria-label="Like reply"
                                                    >
                                                        {reply.liked ? (
                                                            <ThumbUpIcon sx={{ width: "20px", height: "20px", color: "#3498DB" }} />
                                                        ) : (
                                                            <ThumbUpOutlinedIcon sx={{ width: "20px", height: "20px", color: "#2C3E50" }} />
                                                        )}
                                                    </button>
                                                    <button
                                                        style={hover[`dislike-reply-${reply._id}`] ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                                                        onMouseEnter={() => setHover({ ...hover, [`dislike-reply-${reply._id}`]: true })}
                                                        onMouseLeave={() => setHover({ ...hover, [`dislike-reply-${reply._id}`]: false })}
                                                        onClick={() =>
                                                            setComments((prev) =>
                                                                prev.map((c) =>
                                                                    c._id === item._id
                                                                        ? {
                                                                            ...c,
                                                                            reply: c.reply.map((r, i) =>
                                                                                i === replyIdx ? { ...r, liked: false, disliked: true } : r
                                                                            ),
                                                                        }
                                                                        : c
                                                                )
                                                            )
                                                        }
                                                        disabled={isLoading}
                                                        aria-label="Dislike reply"
                                                    >
                                                        {reply.disliked ? (
                                                            <ThumbDownIcon sx={{ width: "20px", height: "20px", color: "#E74C3C" }} />
                                                        ) : (
                                                            <ThumbDownOutlinedIcon sx={{ width: "20px", height: "20px", color: "#2C3E50" }} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <hr style={{ border: "1px solid #D5DBDB", margin: "0px" }} />
                    </div>
                )
            })}
            <style jsx>{`
                @media (max-width: 768px) {
                    div[style*="padding: 10px"] {
                        padding: 8px;
                    }
                    h3 {
                        font-size: 16px !important;
                    }
                    input {
                        font-size: 14px !important;
                        height: 30px !important;
                        padding: 3px 0px 3px 6px !important;
                    }
                    p[style*="fontSize: 16px"] {
                        font-size: 14px !important;
                    }
                    p[style*="fontSize: 14px"] {
                        font-size: 12px !important;
                    }
                    div[style*="width: 24px"] {
                        width: 20px !important;
                        height: 20px !important;
                        font-size: 10px !important;
                    }
                    button {
                        height: 26px !important;
                    }
                }
            `}</style>
        </div>
    );
}