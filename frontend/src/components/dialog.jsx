import React from "react";

export default function Dialog({ children, onclose, opened, width, height }) {
  React.useEffect(() => {
    if (opened) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  if (!opened) return null;

  const styled = {
    backgroundColor: "#F7F9FA",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(12px)",
    width: `${width}`,
    height: `${height}`,
    borderRadius: "12px",
    overflowY: "auto",
    padding: "15px",
    border: "1px solid #D5DBDB",
  };

  return (
    <div
      onClick={onclose}
      style={{
        position: "fixed",
        inset: "0px",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "999",
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={styled}>
        {children}
      </div>
    </div>
  );
}