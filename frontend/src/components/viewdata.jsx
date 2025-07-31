import React from "react";
import Dialog from "./dialog";
import CommentData from "./commentData";

export default function ViewData({ isOpen, viewValue, isClose }) {
    return (
        <Dialog
            children={
                <>
                    {viewValue.map((item) => (
                        <div key={item._id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            <h2 style={{
                                margin: "0px",
                                padding: "5px 50px",
                                display: "flex",
                                justifyContent: "center",
                                textAlign: "center",
                                fontSize: "20px",
                                color: "#2C3E50",
                                fontFamily: "'Poppins', sans-serif",
                            }}>
                                {item.title}
                            </h2>
                            <p style={{
                                margin: "0px 20px",
                                fontSize: "14px",
                                color: "#7F8C8D",
                                fontFamily: "'Poppins', sans-serif",
                                lineHeight: "1.5",
                            }}>
                                {item.desc}
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: '5px 20px' }}>
                                {item.tags?.map((tag, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            backgroundColor: 'gray',
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                        }}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <CommentData commentData={item.comments} blogId={item._id} />
                        </div>
                    ))}
                </>
            }
            onclose={isClose}
            opened={isOpen}
            width="650px"
            height="500px"
        />
    );
}