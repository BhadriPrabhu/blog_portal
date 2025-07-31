import axios from "axios";
import Button from "../components/button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../data/zustand";
import { register } from '../utils/api';

export default function Register() {
  const navigate = useNavigate();
  const setProfileData = useStore((state) => state.setProfileData);
  const setIsAuth = useStore((state) => state.setIsAuth);

  const [hover, setHover] = useState(false);
  const [registerData, setRegisterData] = useState({
    user: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    margin: "100px auto 0",
    border: "1px solid #D5DBDB",
    width: "fit-content",
    padding: "16px 24px",
    borderRadius: "12px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    maxWidth: "400px",
  };

  const hoverStyle = {
    backgroundColor: "#EDEFF2",
  };

  const inputStyle = {
    height: "32px",
    width: "270px",
    fontSize: "14px",
    backgroundColor: "#F7F9FA",
    border: "1px solid #D5DBDB",
    borderRadius: "6px",
    fontFamily: "'Poppins', sans-serif",
    padding: "6px 12px",
    color: "#2C3E50",
    transition: "border-color 0.2s ease-in-out",
  };

  const labelStyle = {
    fontSize: "14px",
    color: "#2C3E50",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "500",
  };

  const handleRegister = async () => {
    if (!registerData.user || !registerData.email || !registerData.password) {
      setError("Name, email, and password are required");
      return;
    }
    try {
      const res = await register(registerData);
      setProfileData({
        _id: res.data._id,
        user: res.data.user,
        email: res.data.email,
        role: res.data.role || "user",
      });
      setIsAuth(true);
      console.log("Profile:", useStore.getState().profileData);
      navigate("/blog");
    } catch (err) {
      console.error("Register error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div
      style={hover ? { ...cardStyle, ...hoverStyle } : cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <h1
        style={{
          margin: "0",
          padding: "0",
          fontWeight: "600",
          fontSize: "24px",
          color: "#2C3E50",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        Register
      </h1>
      {error && (
        <div style={{ color: "#FF6B6B", fontSize: "14px", marginBottom: "8px" }}>
          {error}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={labelStyle}>Name</label>
        <input
          required
          placeholder="Enter Name"
          type="text"
          value={registerData.user}
          onChange={(e) => setRegisterData({ ...registerData, user: e.target.value })}
          style={inputStyle}
          aria-label="Name"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={labelStyle}>Email</label>
        <input
          required
          placeholder="Enter Email"
          type="email"
          value={registerData.email}
          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
          style={inputStyle}
          aria-label="Email"
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={labelStyle}>Password</label>
        <input
          required
          placeholder="Enter Password"
          type="password"
          value={registerData.password}
          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
          style={inputStyle}
          aria-label="Password"
        />
      </div>
      <Button
        value="Register"
        onClick={handleRegister}
        style={{
          backgroundColor: "#3498DB",
          color: "#FFFFFF",
          fontFamily: "'Poppins', sans-serif",
          fontSize: "14px",
          fontWeight: "500",
          padding: "8px 16px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          transition: "background-color 0.2s ease-in-out",
        }}
        hoverStyle={{ backgroundColor: "#3498DBCC" }}
      />
      <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "14px", color: "#2C3E50" }}>
        <p style={{ margin: 0, fontFamily: "'Poppins', sans-serif" }}>Already have an account?</p>
        <a
          href="/"
          style={{
            color: "#3498DB",
            textDecoration: "none",
            fontFamily: "'Poppins', sans-serif",
            transition: "color 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#3498DBCC")}
          onMouseLeave={(e) => (e.target.style.color = "#3498DB")}
        >
          Login
        </a>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="maxWidth: 400px"] {
            padding: 12px 16px;
            margin: 80px auto 0;
          }
          h1 {
            font-size: 20px !important;
          }
          input,
          label,
          p,
          a {
            font-size: 12px !important;
          }
          input {
            width: 220px !important;
            padding: 4px 8px !important;
          }
        }
      `}</style>
    </div>
  );
}