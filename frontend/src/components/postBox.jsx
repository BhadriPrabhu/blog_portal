import React, { useEffect, useState } from "react";
import Profile from "../assets/icons/profile";
import { useStore } from "../data/zustand";
import { TagsRefer } from '../data/tagsRefer';
import { addBlog, notifyBlog, reportAiFlag, fetchSuggestions } from '../utils/api';
import { BadgePlus, Check, Image, Tag, Video, X, Send, RotateCw, AlertCircle, Users, UserPlus } from "lucide-react";
import GenAI from "../utils/AI";
import ToastBlog from "../utils/toast";
import ButtonTrans from "./buttonTran";
import Dialog from "./dialog";
import { uploadImageToCloudinary } from "../utils/imageUrl";
import { ScaleLoader } from 'react-spinners';
import { motion, AnimatePresence } from "framer-motion";

export default function PostBox() {
  const profileData = useStore((state) => state.profileData);
  const setTriggerRefresh = useStore((state) => state.setTriggerRefresh);

  // Hover states for theme buttons
  const [hoverStates, setHoverStates] = useState({
    image: false,
    video: false,
    tags: false,
    post: false,
    previewImg: false,
    previewVid: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isLoading1, setIsLoading1] = useState(false);
  const [error, setError] = useState("");
  const [generatedTags, setGeneratedTags] = useState([]);
  const [selectedTags, setselectedTags] = useState([]);
  const [data, setData] = useState({
    title: "",
    desc: "",
    userId: "",
    email: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);

  const fileInputRef = React.useRef(null);
  const videoInputRef = React.useRef(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [videoPreviewOpen, setVideoPreviewOpen] = useState(false);

  const [hover, setHover] = useState(false);

  const [collabInput, setCollabInput] = useState("");
  const [collabSuggestions, setCollabSuggestions] = useState([]);
  const [selectedCollabs, setSelectedCollabs] = useState([]);


  const handleCollabChange = async (e) => {
    const val = e.target.value;
    setCollabInput(val);

    const lastAtIndex = val.lastIndexOf("@");
    if (lastAtIndex !== -1) {
      const query = val.slice(lastAtIndex + 1).split(" ")[0];
      if (query.length > 1) { // Start searching after 2 chars
        try {
          const result = await fetchSuggestions(query);
          // Filter out current user and already selected users
          const filtered = result.data.message.filter(
            (u) => u._id !== profileData._id &&
              !selectedCollabs.some(c => c.user === u._id)
          );
          setCollabSuggestions(filtered);
        } catch (err) {
          console.error("Collab fetch error:", err);
        }
      }
    } else {
      setCollabSuggestions([]);
    }
  };

  const addCollaborator = (user) => {
    setSelectedCollabs([...selectedCollabs, {
      user: user._id,
      username: user.username,
      role: 'editor'
    }]);
    setCollabInput("");
    setCollabSuggestions([]);
  };

  const removeCollab = (id) => {
    setSelectedCollabs(selectedCollabs.filter(c => c.user !== id));
  };

  // --- LOGIC PRESERVED FROM ORIGINAL ---
  const fetchData = async (retryCount = 0, maxRetries = 3) => {
    if (!data.title.trim() || !data.desc.trim()) {
      setError("Title and description are required");
      return;
    }
    try {
      setIsLoading1(true);
      const prompt = `Select relevant tags from the following title and description based on the provided tags reference. Return tags as a JSON array of strings.
Title: ${data.title}
Description: ${data.desc}
Tags Reference: ${JSON.stringify(TagsRefer)}
Example Output: ["tech", "programming"]`;

      const result = await GenAI(prompt);
      let tagsText = result.response.text();
      tagsText = tagsText.replace(/```json\n|```/g, '').trim();

      let tags = ["Random"];
      try {
        tags = JSON.parse(tagsText);
        tags = tags.filter(tag => TagsRefer.includes(tag));
      } catch (parseError) {
        setError("Failed to parse tags from AI response");
        return [];
      }
      setIsLoading1(false);
      setGeneratedTags(tags);
      return tags;
    } catch (error) {
      if (error.message.includes("429") && retryCount < maxRetries) {
        const waitTime = Math.pow(2, retryCount) * 2000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return fetchData(retryCount + 1, maxRetries);
      }
      setIsLoading1(false);
      setError(`Error: ${error.message}`);
      return [];
    }
  };

  const handlePost = async () => {
    if (!data.title.trim() || !data.desc.trim()) {
      setError("Title and description are required");
      return;
    }
    if (!profileData?._id || !profileData?.email) {
      setError("User authentication required. Please log in again.");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      let uploadedImageUrl = "";
      if (file) {
        const resultUrl = await uploadImageToCloudinary(file);
        if (resultUrl) uploadedImageUrl = resultUrl;
        else throw new Error("Image upload failed.");
      }

      const postData = {
        title: data.title,
        desc: data.desc,
        userId: profileData._id,
        email: profileData.email,
        tags: selectedTags.length > 0 ? selectedTags : ["General"],
        image: uploadedImageUrl,
        collaborators: selectedCollabs.map(c => ({ user: c.user, role: c.role }))
      };

      const res = await addBlog(postData);
      const id = res.data.blog?._id;
      setSelectedCollabs([]);

      const moderationPrompt = `Act as a legal content moderator... Return ONLY "true" or "false". Content: ${data.title} ${data.desc}`;
      const result = await GenAI(moderationPrompt);
      if (result.response.text().toLowerCase().includes("true")) {
        ToastBlog("Content flagged for Manual review");
        await notifyBlog({ type: "new_post", senderId: profileData._id, recipientId: profileData._id, blogId: id, notifyContent: "Your post has been reported." });
        await reportAiFlag(id);
      }

      setData({ title: "", desc: "", userId: "", email: "" });
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      setFile(null);
      setselectedTags([]);
      setGeneratedTags([]);
      ToastBlog("Posted successfully!");
      await notifyBlog({ type: "new_post", senderId: profileData._id, recipientId: profileData._id, blogId: id, notifyContent: "Posted Successfully!" });
      setTriggerRefresh();
    } catch (err) {
      setError(err.message || "Failed to post blog.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggletag = (tag) => {
    if (selectedTags.includes(tag)) setselectedTags(selectedTags.filter(t => t !== tag));
    else setselectedTags([...selectedTags, tag]);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleVideoFileChange = (e) => {
    const selectedVideoFile = e.target.files[0];
    if (!selectedVideoFile) return;
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(selectedVideoFile);
    setVideoPreview(URL.createObjectURL(selectedVideoFile));
  };

  const updateHover = (key, val) => setHoverStates(prev => ({ ...prev, [key]: val }));

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
      margin: "12px auto",
      maxWidth: "600px",
      width: "100%",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: '#0c5686', borderRadius: '50%', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', fontWeight: 'bold' }}>
          {profileData?.user?.charAt(0).toUpperCase() || 'U'}
        </div>
        <p style={{ margin: "0px", fontSize: "16px", fontWeight: "600", color: "#1e293b" }}>Bring your ideas to life</p>
      </div>

      {error && (
        <div style={{ color: '#ef4444', fontSize: '13px', backgroundColor: '#fef2f2', padding: '8px', borderRadius: '8px', border: '1px solid #fee2e2', display: "flex", alignItems: "center", gap: "2px" }}>
          <AlertCircle size={16} style={{ display: 'inline', marginRight: '4px' }} /> {error}
        </div>
      )}

      <input
        required
        value={data.title}
        onChange={(e) => setData({ ...data, title: e.target.value })}
        placeholder="Enter Your Challenge Title"
        type="text"
        style={{
          height: "40px",
          fontSize: "15px",
          fontFamily: "'Poppins', sans-serif",
          borderRadius: "10px",
          border: "1.5px solid #f1f5f9",
          padding: "0 14px",
          backgroundColor: "#f8fafc",
          color: "#1e293b",
          outline: "none",
          transition: "border-color 0.2s"
        }}
        onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
        onBlur={(e) => {
          e.target.style.borderColor = "#f1f5f9"
          setTimeout(() => setCollabSuggestions([]), 200);
        }}
      />

      <textarea
        rows="4"
        value={data.desc}
        onChange={(e) => setData({ ...data, desc: e.target.value })}
        placeholder="Explain your challenge here..."
        style={{
          borderRadius: "10px",
          fontSize: "14px",
          fontFamily: "'Poppins', sans-serif",
          padding: "12px 14px",
          border: "1.5px solid #f1f5f9",
          backgroundColor: "#f8fafc",
          color: "#334155",
          resize: "none",
          outline: "none",
          lineHeight: "1.6"
        }}
        onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
        onBlur={(e) => e.target.style.borderColor = "#f1f5f9"}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {/* Media Previews inline */}
          {preview && (
            <div onClick={() => setPreviewOpen(true)} style={{ cursor: 'pointer', position: 'relative' }}>
              <img src={preview} style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #3b82f6' }} />
            </div>
          )}
          {videoPreview && (
            <div onClick={() => setVideoPreviewOpen(true)} style={{ cursor: 'pointer', position: 'relative' }}>
              <video src={videoPreview} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #3b82f6' }} />
            </div>
          )}
        </div>

        <ButtonTrans
          child={<><Tag size={16} /> {isLoading1 ? "Analyzing..." : "Suggest Tags"}</>}
          ClickEvent={() => fetchData()}
          disable={isLoading1}
          buttonType="button"
          hover={hoverStates.tags}
          mouseEnter={() => updateHover('tags', true)}
          mouseLeave={() => updateHover('tags', false)}
          noToolTip={true}
          paddingEdit="6px 12px"
        />
      </div>

      <AnimatePresence>
        {generatedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "10px", backgroundColor: "#e5eaef", borderRadius: "10px" }}
          >
            <div>
              <span style={{ fontSize: "14px", color: "#455873", fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>Click to add tags:</span>
            </div>
            {generatedTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => toggletag(tag)}
                style={{
                  backgroundColor: selectedTags.includes(tag) ? "#3b82f6" : '#fff',
                  color: selectedTags.includes(tag) ? '#fff' : '#64748b',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: selectedTags.includes(tag) ? '1.5px solid #3b82f6' : '1.5px solid #e2e8f0',
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "'Poppins', sans-serif",
                  transition: "all 0.2s"
                }}
              >
                {tag} {selectedTags.includes(tag) ? <Check size={14} /> : <BadgePlus size={14} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Users size={18} color="#64748b" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>Collaborators</span>
        </div>

        {/* Selected Collabs Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
          {selectedCollabs.map(collab => (
            <div key={collab.user} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#f1f5f9', padding: '2px 10px', borderRadius: '15px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
              <span>@{collab.username}</span>
              <X size={12} style={{ cursor: 'pointer' }} onClick={() => removeCollab(collab.user)} />
            </div>
          ))}
        </div>

        <input
          value={collabInput}
          onChange={handleCollabChange}
          placeholder="Type @username to add collaborators..."
          type="text"
          style={{
            height: "40px",
            fontSize: "15px",
            fontFamily: "'Poppins', sans-serif",
            borderRadius: "10px",
            border: "1.5px solid #f1f5f9",
            padding: "0 14px",
            backgroundColor: "#f8fafc",
            color: "#1e293b",
            outline: "none",
            transition: "border-color 0.2s",
            width: "100%",
            boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.target.style.borderColor = "#f1f5f9"}
        />

        {/* Suggestions Dropdown */}
        {collabSuggestions.length > 0 && (
          <div style={{
            position: 'absolute', zIndex: 10, top: '100%', left: 0, right: 0,
            backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0', maxHeight: '150px', overflowY: 'auto'
          }}>
            {collabSuggestions.map(user => (
              <div
                key={user._id}
                onClick={() => addCollaborator(user)}
                style={{ padding: '8px 12px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
              >
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#3b82f6', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '10px' }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                {user.username}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #eaf2fb", paddingTop: "10px" }}>
        <div style={{ display: "flex", gap: "10px" }}>
          <ButtonTrans
            child={<><Image size={18} /> Image</>}
            disable={isLoading}
            mouseEnter={() => updateHover('image', true)}
            mouseLeave={() => updateHover('image', false)}
            hover={hoverStates.image}
            ClickEvent={() => fileInputRef.current.click()}
            noToolTip={true}
            paddingEdit="8px 12px"
          />
          <ButtonTrans
            child={<><Video size={18} /> Video</>}
            disable={isLoading}
            mouseEnter={() => updateHover('video', true)}
            mouseLeave={() => updateHover('video', false)}
            hover={hoverStates.video}
            ClickEvent={() => videoInputRef.current.click()}
            noToolTip={true}
            paddingEdit="8px 12px"
          />
        </div>

        <button
          onClick={handlePost}
          disabled={isLoading}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            backgroundColor: isLoading ? "#94a3b8" : hover ? '#2980B9' : "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: isLoading ? "not-allowed" : "pointer",
            boxShadow: isLoading ? "none" : "0 4px 12px rgba(0, 0, 0, 0.1)",
            transition: 'background-color 0.3s ease, transform 0.2s ease',
            fontFamily: "'Poppins', sans-serif",
            transform: hover && !isLoading ? "translateY(-2px)" : "none"
          }}
        >
          {isLoading ? <RotateCw size={16} className="animate-spin" /> : <Send size={16} />}
          {isLoading ? "Posting..." : "Post Challenge"}
        </button>
      </div>

      {/* Hidden Inputs */}
      <input onChange={handleFileChange} type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} />
      <input onChange={handleVideoFileChange} type="file" accept="video/*" ref={videoInputRef} style={{ display: "none" }} />

      {/* Previews */}
      <Dialog opened={previewOpen} onclose={() => setPreviewOpen(false)} width="600px">
        <div style={{ padding: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: '700' }}>Image Preview</span>
            <X onClick={() => setPreviewOpen(false)} style={{ cursor: 'pointer' }} />
          </div>
          <img src={preview} style={{ width: '100%', borderRadius: '12px' }} />
        </div>
      </Dialog>

      <Dialog opened={videoPreviewOpen} onclose={() => setVideoPreviewOpen(false)} width="600px">
        <div style={{ padding: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: '700' }}>Video Preview</span>
            <X onClick={() => setVideoPreviewOpen(false)} style={{ cursor: 'pointer' }} />
          </div>
          <video src={videoPreview} controls style={{ width: '100%', borderRadius: '12px' }} />
        </div>
      </Dialog>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}