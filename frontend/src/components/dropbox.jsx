

export default function DropBox({ child, boxRef, top, right, left }) {



    return (
        <div
            ref={boxRef}
            style={{
                position: "absolute",
                top: `${top}`,
                right: `${right}`,
                backgroundColor: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                border: "1px solid #D5DBDB",
                borderRadius: "8px",
                padding: "12px",
                zIndex: 9999,
                minWidth: "200px",
            }}
        >
            {child}
        </div>
    )
}