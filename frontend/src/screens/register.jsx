import axios from "axios";
import Button from "../components/button";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../data/zustand";
import { register } from '../utils/api';
import loginIcon from '../assets/image/login.svg'
import OtpSender from "../utils/otp";
import { RotateCcw } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const setProfileData = useStore((state) => state.setProfileData);
  const setIsAuth = useStore((state) => state.setIsAuth);

  const [hover, setHover] = React.useState(false);
  const [registerData, setRegisterData] = React.useState({
    user: "",
    email: "",
    password: "",
    username: "",
  });
  const [confirmPass, setConfirmPass] = React.useState("");
  const [error, setError] = React.useState("");
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [otp, setOtp] = React.useState(new Array(6).fill(""));
  const [activeInput, setActiveInput] = React.useState(null);
  const [hover1, setHover1] = React.useState(false);
  const [time, setTime] = React.useState(1);
  const [seconds, setSeconds] = React.useState(time * 60);
  const [activeOtp, setActiveOtp] = React.useState(null);

  let interval = null;

  useEffect(() => {
    let timerInterval;

    if (isFlipped && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);

    } else if (seconds == 0) {
      clearInterval(interval);

    }
    return () => clearInterval(interval);
  }, [isFlipped, seconds]);

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    // margin: "100px auto 0",
    border: "1px solid #D5DBDB",
    width: "fit-content",
    padding: "16px 24px",
    borderRadius: "12px",
    backgroundColor: "#FFFFFF",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    maxWidth: "400px",
    transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
    transformStyle: "preserve-3d",
    perspective: "1000px"
  };

  const hoverStyle = {
    backgroundColor: "#EDEFF2",
  };

  const isFlip = {
    transform: "rotateY(360deg)",
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
    fontSize: "16px",
    color: "#2C3E50",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "500",
  };

  const inputNumStyle = {
    width: '48px',
    height: '56px',
    margin: '0',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#E5E7EB',
    borderRight: 'none',
    borderRadius: '12px',
    backgroundColor: '#F9FAFB',
    textAlign: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#020a1b',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    fontFamily: "'Poppins', sans-serif",
  };

  const focusStyle = {
    borderColor: '#3B82F6',
    backgroundColor: '#FFFFFF',
    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)',
  };

  const buttonStyle = {
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "12px",
    padding: "6px 10px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Poppins', sans-serif",
    color: "#2C3E50",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease-in-out",
    width: "fit"
  };

  const handleRegister = async () => {
    setError("");
    if (activeOtp !== otp.join('')) {
      setError("Please Enter the valid OTP.");
      return;
    }
    try {
      const res = await register(registerData);

      // Save the token to localStorage immediately!
      localStorage.setItem("token", res.data.token);

      // Access data through res.data.result (based on your controller)
      const userData = res.data.result;

      setProfileData({
        _id: userData._id,
        user: userData.user,
        email: userData.email,
        role: userData.role || "user",
        username: userData.username,
      });

      setIsAuth(true);
      ToastBlog("Registration Successful!");
      navigate("/blog");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  const handleChange = (target, index) => {
    // Allow only numbers
    if (isNaN(target.value)) return false;

    // Create a copy of the current OTP array
    const newOtp = [...otp];
    // Take only the last character entered (in case user types fast)
    newOtp[index] = target.value.substring(target.value.length - 1);
    setOtp(newOtp);

    // Move focus to next box if value is entered
    if (target.value && target.nextSibling) {
      target.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      // If current box is empty and there is a previous box, move back
      if (!otp[index] && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
    }
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const validate = (val) => {
    const regex = /^[a-z0-9_.]+$/; // Only lowercase, numbers, and underscores

    if (val.length > 0 && val.length < 3) {
      setError('Too short (min 3 characters)');
    } else if (!regex.test(val) && val.length > 0) {
      setError('Only letters, numbers, dots and underscores allowed');
    } else {
      setError('');
    }
  };

  const handleChangeUserName = (e) => {
    const cleanValue = e.target.value.toLowerCase().replace(/\s/g, '');
    setRegisterData({ ...registerData, username: cleanValue })
    validate(cleanValue);
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: "50px", margin: "30px 0" }}

    >
      <img
        src={loginIcon}
        alt="OTP Illustration"
        style={{ width: '400px', height: 'auto' }}
      />
      <div
        // style={ isFlipped ? {...isFlip} : '' ,hover ? { ...cardStyle, ...hoverStyle } : cardStyle}
        style={{ ...cardStyle, ...(isFlipped ? isFlip : {}), ...(hover ? hoverStyle : {}) }}
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
          <div style={{ color: "#FF6B6B", fontSize: "14px", flexWrap: "wrap", width: "300px", }}>
            {error}
          </div>
        )}
        {isFlipped ? (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                <label style={labelStyle}>OTP</label>
                <p style={{ color: "red", lineHeight: "12px", margin: 0, }}>{formatTime(seconds)}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onFocus={(e) => {
                      setActiveInput(index);
                      e.target.select();
                    }}
                    onBlur={() => setActiveInput(null)}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    // COMBINE STYLES HERE
                    style={{
                      ...inputNumStyle,
                      borderRight: index === 5 ? '2px solid #E5E7EB' : 'none',
                      ...(activeInput === index ? focusStyle : {})
                    }}
                  />
                ))}
              </div>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
                <button
                  style={hover1 ? { ...buttonStyle, backgroundColor: "#3498DB33" } : buttonStyle}
                  onMouseEnter={() => setHover1(true)}
                  onMouseLeave={() => setHover1(false)}
                  aria-label="Resend OTP"
                  onClick={async () => {
                    const emailData = {
                      email: registerData.email,
                      name: registerData.user,
                      timing: time,
                    }
                    try {
                      const ResOtp = await OtpSender(emailData);
                      setActiveOtp(ResOtp);
                      setSeconds(time * 60);
                      setOtp(new Array(6).fill(""));
                    } catch (err) {
                      console.log("Error: ", err);
                      setError("Failed to send email. Please try again.");
                    }

                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "4px", }}>
                    <RotateCcw size="18px" />
                    Resend OTP
                  </div>
                </button>
              </div>


              <p style={{ margin: 0, fontSize: "12px", color: "red", lineHeight: "10px" }}>*Check your email inbox</p>

            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <Button
                value="Back to form"
                normalField="true"
                onClick={() => {
                  setIsFlipped(false);
                  setOtp(new Array(6).fill(""));
                  setSeconds(time * 60);
                }}
                style={{
                  backgroundColor: "#95A5A6",
                  color: "#FFFFFF",
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: "14px",
                  fontWeight: "500",
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease-in-out",
                  outline: "none"
                }}
                hoverStyle={{ backgroundColor: "#7F8C8D" }}
              />
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
                disabled={otp.join('').length !== 6 || time === 0}
              />
            </div>

          </>

        ) : (
          <>
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
              <label style={labelStyle}>Username</label>
              <input
                required
                placeholder="Enter Username"
                type="text"
                value={registerData.username}
                onChange={handleChangeUserName}
                style={inputStyle}
                aria-label="Name"
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
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                required
                placeholder="Confirm Password"
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                style={inputStyle}
                aria-label="Confirm Password"
              />
            </div>
            <Button
              value="Get OTP"
              onClick={async () => {

                if (registerData.password !== confirmPass) {
                  setError("Password Mismatch(Password and Confirm Password)");
                  return;
                }
                if (!registerData.user || !registerData.email || !registerData.password || !registerData.username || !confirmPass) {
                  setError("Name, email, username and password are required");
                  return;
                }

                setError("");

                const emailData = {
                  email: registerData.email,
                  name: registerData.user,
                  timing: time,
                }
                try {
                  const ResOtp = await OtpSender(emailData);
                  if (ResOtp) {
                    setActiveOtp(ResOtp);
                    setIsFlipped(true);
                    setSeconds(time * 60);
                  }

                } catch (err) {
                  console.log("Error: ", err);
                  setError("Failed to send email. Please try again.");
                }

              }}
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
          </>
        )}


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
    </div>
  );
}