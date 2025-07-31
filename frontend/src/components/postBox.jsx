import React, { useEffect } from "react";
import Insert from "../assets/icons/insert";
import Send from "../assets/icons/send";
import Profile from "../assets/icons/profile";
import axios from "axios";
import { useStore } from "../data/zustand";
import { TagsRefer } from '../data/tagsRefer';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BeatLoader } from 'react-spinners';

export default function PostBox() {
  const profileData = useStore((state) => state.profileData);
  const [hover1, setHover1] = React.useState(false);
  const [hover2, setHover2] = React.useState(false);
  const [hover3, setHover3] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [generatedTags, setGeneratedTags] = React.useState([]);
  const [data, setData] = React.useState({
    title: "",
    desc: "",
    userId: "",
    email: "",
    tags: [],
  });

  const buttonStyle = {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "12px",
    padding: "8px 12px",
    display: "flex",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    cursor: isLoading ? "not-allowed" : "pointer",
    color: "#2C3E50",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease-in-out",
  };

  const chatApi = import.meta.env.VITE_API_GEMINI_KEY;

  const fetchData = async (retryCount = 0, maxRetries = 3) => {
    if (!chatApi) {
      console.error("Gemini API key is missing");
      setError("API key is missing. Contact support.");
      return [];
    }

    try {
      const genAI = new GoogleGenerativeAI(chatApi);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Select relevant tags from the following title and description based on the provided tags reference. Return tags as a JSON array of strings.

Title: ${data.title}
Description: ${data.desc}
Tags Reference: ${JSON.stringify(TagsRefer)}
Example Output: ["tech", "programming"]`;

      const result = await model.generateContent(prompt);
      let tagsText = result.response.text();

      // Clean Markdown code fences
      tagsText = tagsText.replace(/```json\n|```/g, '').trim();

      let tags = [];
      try {
        tags = JSON.parse(tagsText);
        if (!Array.isArray(tags) || !tags.every(tag => typeof tag === 'string')) {
          throw new Error("Invalid tags format");
        }
        tags = tags.filter(tag => TagsRefer.includes(tag));
      } catch (parseError) {
        console.error("Error parsing tags:", parseError, "Raw tagsText:", tagsText);
        setError("Failed to parse tags from AI response");
        return [];
      }

      console.log("Generated tags:", tags);
      setGeneratedTags(tags);
      return tags;
    } catch (error) {
      console.error("Error fetching tags:", error);
      if (error.message.includes("503") && retryCount < maxRetries) {
        console.log(`Retrying (${retryCount + 1}/${maxRetries}) after 5s...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        return fetchData(retryCount + 1, maxRetries);
      }
      setError(`Failed to generate tags: ${error.message}`);
      return [];
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (data.title.trim() && data.desc.trim()) {
        fetchData().then(tags => setGeneratedTags(tags));
      } else {
        setGeneratedTags([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [data.title, data.desc]);

  const handlePost = async () => {
    if (!data.title.trim() || !data.desc.trim()) {
      setError("Title and description are required");
      return;
    }
    if (!profileData?._id || !profileData?.email) {
      setError("User authentication required. Please log in again.");
      console.error("Profile data missing:", profileData);
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      let tags = await fetchData();
      if (tags.length === 0) {
        console.warn("No valid tags generated, using fallback: ['general']");
        tags = ["general"];
        setGeneratedTags(tags);
      }

      const postData = {
        title: data.title,
        desc: data.desc,
        userId: profileData._id,
        email: profileData.email,
        tags,
      };

      const res = await axios.post("http://localhost:3000/blog/add", postData);
      console.log("Blog added:", res.data);
      setData({ title: "", desc: "", userId: "", email: "", tags: [] });
      setGeneratedTags([]);
    } catch (err) {
      console.error("Error adding blog:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to post blog. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      backgroundColor: "#fff",
      padding: "16px",
      borderRadius: "12px",
      border: "1px solid #D5DBDB",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      margin: "16px auto",
      maxWidth: "600px",
      width: "100%",
      // position: "relative",
      zIndex: "0px",
    }}>
      {error && (
        <div style={{ color: 'red', fontSize: '14px', marginBottom: '8px' }}>{error}</div>
      )}
      <div style={{ display: "flex", flexDirection: "row", gap: "12px", alignItems: "flex-start" }}>
        <div style={{
          height: "32px",
          width: "32px",
          backgroundColor: "#1e7fc0ff",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#FFFFFF",
          fontSize: "16px",
          fontWeight: "600",
        }}>
          {profileData?.user ? <p>{profileData.user.charAt(0).toUpperCase()}</p> : <Profile size={16} />}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
          <input
            required
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="Enter Your Challenge"
            type="text"
            style={{
              height: "32px",
              fontSize: "14px",
              fontFamily: "'Poppins', sans-serif",
              borderRadius: "8px",
              border: "1px solid #D5DBDB",
              padding: "8px",
              backgroundColor: "#F7F9FA",
              color: "#2C3E50",
            }}
            aria-label="Challenge title"
          />
          <textarea
            rows="4"
            value={data.desc}
            onChange={(e) => setData({ ...data, desc: e.target.value })}
            placeholder="Explain Your Challenge - Tags will be generated"
            style={{
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "'Poppins', sans-serif",
              padding: "8px",
              border: "1px solid #D5DBDB",
              backgroundColor: "#F7F9FA",
              color: "#2C3E50",
              resize: "vertical",
            }}
            aria-label="Challenge description"
          />
          {generatedTags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {generatedTags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: '#3498DB',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
        <button
          style={hover1 ? { ...buttonStyle, backgroundColor: isLoading ? "transparent" : "#3498DB33" } : buttonStyle}
          onMouseEnter={() => setHover1(true)}
          onMouseLeave={() => setHover1(false)}
          aria-label="Insert image"
          disabled={isLoading}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Insert size={16} />
            Image
          </div>
        </button>
        <button
          style={hover2 ? { ...buttonStyle, backgroundColor: isLoading ? "transparent" : "#3498DB33" } : buttonStyle}
          onMouseEnter={() => setHover2(true)}
          onMouseLeave={() => setHover2(false)}
          aria-label="Insert video"
          disabled={isLoading}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Insert size={16} />
            Video
          </div>
        </button>
        <button
          style={hover3 ? { ...buttonStyle, backgroundColor: isLoading ? "transparent" : "#3498DB33" } : buttonStyle}
          onMouseEnter={() => setHover3(true)}
          onMouseLeave={() => setHover3(false)}
          onClick={handlePost}
          disabled={isLoading}
          aria-label="Post challenge"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Send size={16} />
            Post
          </div>
        </button>
      </div>
      {isLoading && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "transparent",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
          padding: "10px",
          borderRadius: "8px",
        }}>
          <BeatLoader color="#2C3E50" size={10} />
        </div>
      )}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="maxWidth: 600px"] {
            margin: 8px 4px;
            padding: 12px;
          }
          input, textarea {
            font-size: 12px !important;
            padding: 6px !important;
          }
          div[style*="width: 32px"] {
            width: 24px !important;
            height: 24px !important;
            font-size: 12px !important;
          }
          button {
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}