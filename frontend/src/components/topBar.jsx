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
import { Bell, LogOut, RotateCcw, RotateCw, X } from "lucide-react";
import ButtonTrans from "./buttonTran";
import DropBox from "./dropbox";
import { deleteNotify, getNotify } from "../utils/api";


import ReactDOM from "react-dom";

const Portal = ({ children }) => {
  // This teleports the dropdown to document.body, outside the Z-index mess
  return ReactDOM.createPortal(children, document.body);
};

export default function TopBar() {
  const navigate = useNavigate();
  const profile = useStore((state) => state.profileData);
  const setIsAuth = useStore((state) => state.setIsAuth);
  const setProfileData = useStore((state) => state.setProfileData);

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = React.useState(false);
  const [hover1, setHover1] = React.useState(false);
  const [hover2, setHover2] = React.useState(false);
  const [hover3, setHover3] = React.useState(false);
  const [hover4, setHover4] = React.useState(false);
  const [hover5, setHover5] = React.useState(false);
  const [hover6, setHover6] = React.useState(false);
  const [hover7, setHover7] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);

  const ref = React.useRef();
  const notifyRef = React.useRef();

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

  const fetchNotifyData = async () => {
    try {
      const notifyres = await getNotify(profile._id);
      setNotifications(notifyres.data.data);
      console.log("Notify", notifyres.data);
    } catch (err) {
      console.log("Error", err);
    }
  }

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

  const HandleRefresh = () => {
    setIsLoading(true);
    try {
      fetchNotifyData();
      setIsLoading(false);
    } catch (err) {
      console.log("Error", err);
    }
  }

  const handleNotifyDelete = async (id) => {

    try {
      const res = await deleteNotify(id);
      console.log("Notification Delete", res.data.message)
      fetchNotifyData();
    } catch (err) {
      console.log("Error", err);
    }
  }

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
        zIndex: 9999,
      }}
    >
      <ButtonTrans
        child={<>
          <Bell color="grey" size="18px" />
        </>}
        ClickEvent={() => {
          setIsNotifyOpen(!isNotifyOpen);
          try {
            fetchNotifyData();
            setIsLoading(false);
          } catch (err) {
            console.log("Error", err);
          }
        }}
        buttonType="button"
        label="Notifications"
        mouseEnter={() => setHover4(true)}
        mouseLeave={() => setHover4(false)}
        hover={hover4}
        noToolTip="true"
        paddingEdit="4px 4px"
      />
      {profile?.user ? (
        <Avatar
          sx={{
            bgcolor: "#3498DB",
            cursor: "pointer",
            width: 32,
            height: 32,
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
      {isNotifyOpen && (
        <DropBox
          child={<>
            <div style={{ display: "flex", flexDirection: "column", }}>
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ margin: "0px", fontSize: "18px" }}>Notification</p>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "2px" }}>
                  <ButtonTrans child={<>
                    <RotateCw size="16px" color={isLoading ? "red" : "grey"} style={{
                      animation: `${isLoading ? "spin 1s linear infinite" : "none"}`,
                    }} />
                  </>}
                    buttonType="button"
                    noToolTip={true}
                    hover={hover5}
                    mouseEnter={() => setHover5(true)}
                    mouseLeave={() => setHover5(false)}
                    label="Refresh"
                    ClickEvent={HandleRefresh}
                    paddingEdit="4px 4px"
                  />
                  <ButtonTrans
                    child={<>
                      <X size="20px" color="grey" />
                    </>}
                    noToolTip={true}
                    label="Close"
                    buttonType="button"
                    hover={hover6}
                    mouseEnter={() => setHover6(true)}
                    mouseLeave={() => setHover6(false)}
                    paddingEdit="2px 2px"
                    ClickEvent={() => {
                      setIsNotifyOpen(false)
                      setHover6(false);
                    }}
                  />

                </div>

              </div>
              {/* --- Notification List Content --- */}
              <div style={{
                marginTop: "10px",
                maxHeight: "400px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item._id} // Using the actual MongoDB _id
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: item.isRead ? "transparent" : "#f0f7ff",
                        borderBottom: "1px solid #eee",
                        cursor: "pointer",
                        transition: "background 0.2s",
                        fontFamily: "Poppins, sans-serif"
                      }}
                      onClick={() => {
                        navigate(item.link)
                        setIsNotifyOpen(false);
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                        <span style={{ fontWeight: "600", fontSize: "14px", color: "#2C3E50", lineHeight: "14px" }}>
                          {item.content}
                        </span>
                        <div style={{ color: "grey", whiteSpace: "nowrap", gap: "4px", display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                          <p style={{ margin: "0px", fontSize: "10px" }}>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <ButtonTrans
                            child={<>
                              <X size="14px" color="grey" />
                            </>}
                            noToolTip="true"
                            paddingEdit="0px 0px"
                            label="Delete"
                            hover={hover7}
                            mouseEnter={() => setHover7(true)}
                            mouseLeave={() => setHover7(false)}
                            buttonType="button"
                            ClickEvent={() => handleNotifyDelete(item._id)}
                          />
                        </div>
                      </div>

                      {/* Showing the Type or Blog ID as secondary info */}
                      <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#5dade2", fontWeight: "500", lineHeight: "14px" }}>
                        #{item.type.replace('_', ' ')}
                      </p>
                    </div>
                  ))
                ) : (
                  /* Empty State */
                  <div style={{
                    padding: "40px 20px",
                    textAlign: "center",
                    color: "grey",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}>
                    <p style={{ fontSize: "14px" }}>No new notifications</p>
                  </div>
                )}
              </div>

              {/* --- Optional Footer --- */}
              <div style={{
                borderTop: "1px solid #eee",
                marginTop: "10px",
                paddingTop: "10px",
                textAlign: "center"
              }}>
                <button style={{
                  background: "none",
                  border: "none",
                  color: "#007bff",
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "Poppins"
                }}
                >
                  Mark all as read
                </button>
              </div>
            </div>
          </>}
          boxRef={notifyRef}
          top="60px"
          right="180px"
        />
      )}
      {isOpen && (
        <DropBox
          child={<>
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
          </>}
          boxRef={ref}
          top="60px"
          right="60px"

        />
      )}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
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