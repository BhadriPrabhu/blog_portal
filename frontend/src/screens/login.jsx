import Button from "../components/button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useStore } from "../data/zustand";
import { login } from '../utils/api';

export default function Login() {
  const navigate = useNavigate();
  const setProfileData = useStore((state) => state.setProfileData);
  const setIsAuth = useStore((state) => state.setIsAuth);

  const [hover, setHover] = useState(false);
  const [loginData, setLoginData] = useState({
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

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setError("Email and password are required");
      return;
    }
    try {
      const res = await login(loginData);
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
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Try again.");
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
        Login
      </h1>
      {error && (
        <div style={{ color: "#FF6B6B", fontSize: "14px", marginBottom: "8px" }}>
          {error}
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <label style={labelStyle}>Email</label>
        <input
          required
          placeholder="Enter Email"
          type="email"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
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
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          style={inputStyle}
          aria-label="Password"
        />
      </div>
      <Button
        value="Login"
        onClick={handleLogin}
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
        <p style={{ margin: 0, fontFamily: "'Poppins', sans-serif" }}>Don't have an account?</p>
        <a
          href="/register"
          style={{
            color: "#3498DB",
            textDecoration: "none",
            fontFamily: "'Poppins', sans-serif",
            transition: "color 0.2s ease-in-out",
          }}
          onMouseEnter={(e) => (e.target.style.color = "#3498DBCC")}
          onMouseLeave={(e) => (e.target.style.color = "#3498DB")}
        >
          Register Now
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