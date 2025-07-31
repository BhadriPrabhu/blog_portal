// import React from "react";
// // import Profile from "../assets/icons/profile";
// import Avatar from '@mui/material/Avatar';
// import { useNavigate } from "react-router-dom";
// import { useStore } from "../data/zustand";
// import { LogOut } from "lucide-react";


// export default function TopBar() {

//     const isProfile = true;
//     const navigate = useNavigate();
//     const profile = useStore((state) => state.profileData);
//     const setIsAuth = useStore((state) => state.setIsAuth);
//     // console.log(profile.user);


//     const [isOpen, setIsOpen] = React.useState(false);
//     const ref = React.useRef();

//     React.useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (ref.current && !ref.current.contains(event.target)) {
//                 setIsOpen(false);
//             }
//         };
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);


//     const buttonStyle = { backgroundColor: "transparent", border: "0px", borderRadius: "15px", height: "30px", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "poppins", cursor: "pointer", fontSize: "14px", fontWeight: "bold", };

//     const hoverStyle = { backgroundColor: "#a854541a", }

//     const buttonStyle1 = { backgroundColor: "#9637371a", border: "0px", borderRadius: "15px", height: "30px", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "poppins", cursor: "pointer", fontSize: "16px", fontWeight: "bold", };

//     const hoverStyle1 = { backgroundColor: "transparent", }

//     const [hover1, setHover1] = React.useState(false);
//     const [hover2, setHover2] = React.useState(false);
//     const [hover3, setHover3] = React.useState(false);

//     return (
//         <div style={{ display: "flex", alignItems: "center", justifyContent: "end", gap: "4px", borderBottom: "solid 1px #ddd", width: "100%", padding: "10px 60px", backgroundColor: "white", }}>
//             {isProfile ? <Avatar sx={{ bgcolor: "deepskyblue", cursor: "pointer" }} onClick={() => setIsOpen(!isOpen)}>{profile.user.toUpperCase().charAt(0)}</Avatar> : <img src="" alt="" style={{ height: "40px", width: "40px", backgroundColor: "aqua", border: "0px", borderRadius: "50%" }} />}
//             {profile.role === "admin" && <button style={hover3 ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
//                 onMouseEnter={() => setHover3(true)}
//                 onMouseLeave={() => setHover3(false)}
//                 onClick={() => {
//                     navigate("/admin");
//                 }}
//             >Admin Page</button>}
//             <button style={hover1 ? { ...buttonStyle1, ...hoverStyle1 } : buttonStyle1}
//                 onMouseEnter={() => setHover1(true)}
//                 onMouseLeave={() => setHover1(false)}
//                 onClick={() => {
//                     setIsAuth(false);
//                     navigate("/")
//                 }}
//             ><LogOut size={16} color="red" /></button>
//             {/* <p>Bhadri Prabhu K</p> */}


//             {isOpen && (
//                 <div
//                     style={{
//                         position: 'absolute',
//                         top: '90%',
//                         right: "0",
//                         marginTop: '0px',
//                         background: '#fff',
//                         boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
//                         borderRadius: '6px',
//                         padding: '10px',
//                         zIndex: 9999,
//                     }}
//                 >
//                     <p style={{ fontSize: "16px", padding: "0px", margin: "0px" }}>Name: {profile.user}</p>
//                     <p style={{ fontSize: "16px", padding: "0px", margin: "0px", width: "300px" }}>Email: {profile.email}</p>
//                     <div style={{display: "flex", justifyContent: "center"}}>
//                         <button style={hover2 ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
//                             onMouseEnter={() => setHover2(true)}
//                             onMouseLeave={() => setHover2(false)}
//                             onClick={() => {
//                                 setIsOpen(false);
//                             }}
//                         >Close</button>
//                     </div>

//                 </div>
//             )}
//         </div>
//     );
// }


import React, { useEffect } from "react";
import Avatar from '@mui/material/Avatar';
import { useNavigate } from "react-router-dom";
import { useStore } from "../data/zustand";
import { LogOut } from "lucide-react";

export default function TopBar() {
  const navigate = useNavigate();
  const profile = useStore((state) => state.profileData);
  const setIsAuth = useStore((state) => state.setIsAuth);
  const setProfileData = useStore((state) => state.setProfileData);

  const [isOpen, setIsOpen] = React.useState(false);
  const [hover1, setHover1] = React.useState(false);
  const [hover2, setHover2] = React.useState(false);
  const [hover3, setHover3] = React.useState(false);
  const ref = React.useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const buttonStyle = {
    backgroundColor: "#EDEFF2",
    border: "1px solid #D5DBDB",
    borderRadius: "12px",
    padding: "6px 12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
    color: "#2C3E50",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease-in-out, transform 0.1s",
  };

  const hoverStyle = {
    backgroundColor: "#3498DB33",
    transform: "scale(1.02)",
  };

  const logoutButtonStyle = {
    backgroundColor: "#FFE6E6",
    border: "1px solid #FF6B6B",
    borderRadius: "12px",
    padding: "6px 12px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
    cursor: "pointer",
    color: "#FF6B6B",
    fontSize: "14px",
    fontWeight: "500",
    transition: "background-color 0.2s ease-in-out, transform 0.1s",
  };

  const logoutHoverStyle = {
    backgroundColor: "#FF6B6B33",
    transform: "scale(1.02)",
  };

  const handleLogout = () => {
    setIsAuth(false);
    setProfileData({}); // Clear profile data
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "12px",
        borderBottom: "1px solid #D5DBDB",
        width: "100%",
        padding: "12px 60px",
        backgroundColor: "#F7F9FA",
      }}
    >
      {profile?.user ? (
        <Avatar
          sx={{
            bgcolor: "#3498DB",
            cursor: "pointer",
            width: 36,
            height: 36,
            fontSize: "16px",
            fontWeight: "600",
            fontFamily: "'Poppins', sans-serif",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {profile.user.charAt(0).toUpperCase()}
        </Avatar>
      ) : (
        <Avatar
          sx={{
            bgcolor: "#D5DBDB",
            width: 36,
            height: 36,
          }}
        />
      )}
      {profile?.role === "admin" && (
        <button
          style={hover3 ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
          onMouseEnter={() => setHover3(true)}
          onMouseLeave={() => setHover3(false)}
          onClick={() => navigate("/admin")}
          aria-label="Go to admin page"
        >
          Admin Page
        </button>
      )}
      <button
        style={hover1 ? { ...logoutButtonStyle, ...logoutHoverStyle } : logoutButtonStyle}
        onMouseEnter={() => setHover1(true)}
        onMouseLeave={() => setHover1(false)}
        onClick={handleLogout}
        aria-label="Log out"
      >
        <LogOut size={16} color="#FF6B6B" />
      </button>
      {isOpen && (
        <div
          ref={ref}
          style={{
            position: "absolute",
            top: "60px",
            right: "60px",
            backgroundColor: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
            border: "1px solid #D5DBDB",
            borderRadius: "8px",
            padding: "12px",
            zIndex: 9999,
            minWidth: "200px",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#2C3E50",
              fontFamily: "'Poppins', sans-serif",
              margin: "0 0 8px 0",
            }}
          >
            Name: {profile?.user || "Unknown"}
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#2C3E50",
              fontFamily: "'Poppins', sans-serif",
              margin: "0 0 12px 0",
            }}
          >
            Email: {profile?.email || "No email"}
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              style={hover2 ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
              onMouseEnter={() => setHover2(true)}
              onMouseLeave={() => setHover2(false)}
              onClick={() => setIsOpen(false)}
              aria-label="Close dropdown"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <style jsx>{`
        @media (max-width: 768px) {
          div[style*="padding: 12px 60px"] {
            padding: 8px 16px;
          }
          button {
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
          div[style*="minWidth: 200px"] {
            min-width: 150px;
            right: 16px;
            top: 48px;
          }
          p {
            font-size: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}