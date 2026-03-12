import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default function ButtonTrans({ child, ClickEvent, disable, mouseEnter, mouseLeave, buttonType, hover, isLoading, label, tooltipContent, font, noToolTip, paddingEdit, addStyle }) {

    const buttonStyle = {
        backgroundColor: "transparent",
        border: "none",
        borderRadius: "12px",
        padding: `${paddingEdit ? paddingEdit    : "6px 10px"}`,
        display: "flex",
        alignItems: "center",
        fontFamily: "'Poppins', sans-serif",
        cursor: isLoading ? "not-allowed" : "pointer",
        color: "#2C3E50",
        fontSize: "14px",
        fontWeight: "500",
        transition: "background-color 0.2s ease-in-out",
        ...addStyle,
    };
    return (
        <Tippy disabled={noToolTip} content={<span style={{ fontSize: `${font}`}}>{tooltipContent}</span>} >
            <button
                type={buttonType}
                onClick={ClickEvent}
                disabled={disable}
                onMouseEnter={mouseEnter}
                onMouseLeave={mouseLeave}
                style={hover ? { ...buttonStyle, backgroundColor: isLoading ? "transparent" : "#3498DB33", display: "flex", gap: "4px", flexDirection: "row", alignItems: "center" } : { ...buttonStyle, display: "flex", gap: "4px", flexDirection: "row", alignItems: "center" }}
                aria-label={label}
            >
                {child}
            </button>
        </Tippy>

    );
}