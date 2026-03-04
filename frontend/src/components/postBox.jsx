import React, { useEffect, useState } from "react";
import Insert from "../assets/icons/insert";
import Send from "../assets/icons/send";
import Profile from "../assets/icons/profile";
import axios from "axios";
import { useStore } from "../data/zustand";
import { TagsRefer } from '../data/tagsRefer';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BeatLoader, ScaleLoader } from 'react-spinners';
import { addBlog, reportAiFlag } from '../utils/api';
// import OtpSender from "../utils/otp";
import { ToastContainer, toast } from 'react-toastify';
import { BadgePlus, Check, Tag } from "lucide-react";
import GenAI from "../utils/AI";
import ToastBlog from "../utils/toast";
import ButtonTrans from "./buttonTran";

export default function PostBox() {
  const profileData = useStore((state) => state.profileData);
  const setTriggerRefresh = useStore((state) => state.setTriggerRefresh);
  const [hover1, setHover1] = React.useState(false);
  const [hover2, setHover2] = React.useState(false);
  const [hover3, setHover3] = React.useState(false);
  const [hover4, setHover4] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [generatedTags, setGeneratedTags] = React.useState([]);
  const [selectedTags, setselectedTags] = React.useState([]);
  const [data, setData] = React.useState({
    title: "",
    desc: "",
    userId: "",
    email: "",
    tags: selectedTags.length > 0 ? selectedTags : ["General"],
  });

  const buttonStyle = {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "12px",
    padding: "6px 10px",
    display: "flex",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    cursor: isLoading ? "not-allowed" : "pointer",
    color: "#2C3E50",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease-in-out",
  };


  const fetchData = async (retryCount = 0, maxRetries = 3) => {
    if (!data.title.trim() || !data.desc.trim()) {
      setError("Title and description are required");
      return;
    }


    try {
      setIsLoading(true);
      const prompt = `Select relevant tags from the following title and description based on the provided tags reference. Return tags as a JSON array of strings.

Title: ${data.title}
Description: ${data.desc}
Tags Reference: ${JSON.stringify(TagsRefer)}
Example Output: ["tech", "programming"]`;

      const result = await GenAI(prompt);
      let tagsText = result.response.text();

      // Clean Markdown code fences
      tagsText = tagsText.replace(/```json\n|```/g, '').trim();

      let tags = ["Random"];
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

      setIsLoading(false);
      console.log("Generated tags:", tags);

      setGeneratedTags(tags);
      return tags;
    } catch (error) {
      console.error("Attempt failed:", error.message);

      // Specific logic for 429 (Rate Limit)
      if (error.message.includes("429") && retryCount < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s, 16s... plus a random "jitter"
        const waitTime = Math.pow(2, retryCount) * 2000 + Math.random() * 1000;
        console.log(`Rate limited. Retrying in ${Math.round(waitTime / 1000)}s...`);

        await new Promise(resolve => setTimeout(resolve, waitTime));
        return fetchData(retryCount + 1, maxRetries);
      }

      setIsLoading(false);
      setError(`Error: ${error.message}`);
      return [];
    }
  };

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (data.title.trim() && data.desc.trim()) {
  //       fetchData().then(tags => setGeneratedTags(tags));
  //     } else {
  //       setGeneratedTags([]);
  //     }
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // }, [data.title, data.desc]);


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
      // let tags = await fetchData();
      // if (tags.length === 0) {
      //   console.warn("No valid tags generated, using fallback: ['general']");
      //   tags = ["general"];
      //   setGeneratedTags(tags);
      // }

      const postData = {
        title: data.title,
        desc: data.desc,
        userId: profileData._id,
        email: profileData.email,
        tags: selectedTags.length > 0 ? selectedTags : ["General"],
      };


      const res = await addBlog(postData);
      const id = res.data.blog?._id;
      console.log("Blog", id);

      const prompt = `
Act as a legal content moderator. Analyze this blog post for violations of government laws and criminal codes.

Blog Title: ${data.title}
Blog Description: ${data.desc}

Flag "true" ONLY if the content includes:
1. National Security Threats: Terrorism, classified info, or inciting riots against government institutions.
2. Criminal Activity: Detailed instructions for committing crimes (e.g., making weapons, drug manufacturing, or financial fraud).
3. Regulated Goods: Illegal sale of firearms, prescription drugs, or human trafficking.
4. Non-consensual Content: Explicit material shared without consent or child exploitation.

DO NOT flag: Controversial opinions, political criticism, or general adult themes that are legal.

Return ONLY "true" if it violates government rules, or "false" if it is legally permissible.
Output must be lowercase.
`;

      const result = await GenAI(prompt);
      const aiResponse = result.response.text().toLowerCase();
      const isIllegal = aiResponse.includes("true");

      if (isIllegal) {
        ToastBlog("Content flagged for Manual review");
        try {
          await reportAiFlag(id);
        } catch (reportErr) {
          console.error("Failed to flag blog:", reportErr);
        }
      }

      // console.log("Blog added:", res.data);

      setData({ title: "", desc: "", userId: "", email: "", tags: [] });
      setGeneratedTags([]);
      ToastBlog("Posted successfully!");
      setTriggerRefresh();
    } catch (err) {
      console.error("Error adding blog:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to post blog. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggletag = (tag) => {
    if (selectedTags.includes(tag)) {
      setselectedTags(selectedTags.filter(t => t !== tag))
    } else {
      setselectedTags([...selectedTags, tag]);
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      backgroundColor: "#fff",
      padding: "10px",
      borderRadius: "12px",
      border: "1px solid #D5DBDB",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      margin: "12px auto",
      maxWidth: "600px",
      width: "100%",
      // position: "relative",
      zIndex: "0px",
    }}>
      <ToastContainer />
      <div>
        <p style={{ margin: "0px", fontSize: "20px", lineHeight: "20px" }}>Bring your ideas to life</p>
      </div>
      {error && (
        <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>
      )}

      {/* <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}> */}
      {/* <div style={{
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
        </div> */}
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
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", margin: "0px", padding: "0px" }}>
        <ButtonTrans
          child={
            <>
              <Tag size="16px" fontWeight="bold" /> {isLoading ? "Generating..." : "Suggest Tags"}
            </>
          }
          ClickEvent={() => fetchData()}
          disable={isLoading}
          buttonType="button"
          mouseEnter={() => setHover4(true)}
          mouseLeave={() => setHover4(false)}
          hover={hover4}
          isLoading={isLoading}
          label="Tags Suggestion"
          tooltipContent="Tags Suggestion"
          font="12px"
        />
      </div>

      {generatedTags.length > 0 && (
        <div style={{ display: "flex", flexDirection: 'row', justifyContent: "flex-start", alignItems: "flex-start", gap: "8px" }}>
          <p style={{ margin: "0px", padding: "0px", width: "110px" }}>Select Tags:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', }}>
            {generatedTags.map((tag, index) => {

              const isSelected = selectedTags.includes(tag);

              return (
                <button
                  key={index}
                  onClick={() => toggletag(tag)}
                  style={{
                    backgroundColor: isSelected ? "#1f73aa" : '#3498DB',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: "'Poppins', sans-serif",
                    border: isSelected ? '2px solid white' : '2px solid transparent',
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "2px"
                  }}
                >
                  {tag} {isSelected ? <Check size="16px" /> : <BadgePlus size="15px" />}
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap" }}>
        <ButtonTrans
          child={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Insert size={16} />
              Image
            </div>
          }
          disable={isLoading}
          mouseEnter={() => setHover1(true)}
          mouseLeave={() => setHover1(false)}
          buttonType="type"
          hover={hover1}
          isLoading={isLoading}
          label="Insert Image"
          tooltipContent="Insert Image"
          font="12px"
        />
        <ButtonTrans
          child={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Insert size={16} />
              Video
            </div>
          }
          disable={isLoading}
          mouseEnter={() => setHover2(true)}
          mouseLeave={() => setHover2(false)}
          buttonType="type"
          hover={hover2}
          isLoading={isLoading}
          label="Insert Video"
          tooltipContent="Insert Video"
          font="12px"
        />
        <ButtonTrans
          child={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Send size={16} />
              Post
            </div>
          }
          disable={isLoading}
          mouseEnter={() => setHover3(true)}
          mouseLeave={() => setHover3(false)}
          buttonType="type"
          hover={hover3}
          isLoading={isLoading}
          label="Post Challenge"
          ClickEvent={handlePost}
          tooltipContent="Post Challenge"
          font="12px"
        />
      </div>

      {/* </div> */}

      {/* <div>
        <button onClick={() => {
          // const randonNum = Math.floor(100000 + Math.random() * 900000);
          // setOtp(randonNum);
          const emailData = {
            email: profileData.email,
            name: profileData.user,
            timing: 5,
          }
          OtpSender(emailData);
        }}>Generate</button>
      </div> */}

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
          <ScaleLoader color="#2C3E50" size={10} />
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