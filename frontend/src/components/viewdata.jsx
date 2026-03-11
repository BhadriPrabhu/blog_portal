// import React from "react";
// import Dialog from "./dialog";
// import CommentData from "./commentData";

// export default function ViewData({ isOpen, viewValue, isClose }) {
//     return (
//         <Dialog
//             children={
//                 <>
//                     {viewValue.map((item) => (
//                         <div key={item._id} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//                             <h2 style={{
//                                 margin: "0px",
//                                 padding: "5px 50px",
//                                 display: "flex",
//                                 justifyContent: "center",
//                                 textAlign: "center",
//                                 fontSize: "20px",
//                                 color: "#2C3E50",
//                                 fontFamily: "'Poppins', sans-serif",
//                             }}>
//                                 {item.title}
//                             </h2>
//                             <p style={{
//                                 margin: "0px 20px",
//                                 fontSize: "14px",
//                                 color: "#7F8C8D",
//                                 fontFamily: "'Poppins', sans-serif",
//                                 lineHeight: "1.5",
//                             }}>
//                                 {item.desc}
//                             </p>
//                             <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', margin: '5px 20px' }}>
//                                 {item.tags?.map((tag, index) => (
//                                     <span
//                                         key={index}
//                                         style={{
//                                             backgroundColor: 'gray',
//                                             color: 'white',
//                                             padding: '2px 8px',
//                                             borderRadius: '12px',
//                                             fontSize: '12px',
//                                         }}
//                                     >
//                                         {tag}
//                                     </span>
//                                 ))}
//                             </div>
//                             <CommentData commentData={item.comments} blogId={item._id} />
//                         </div>
//                     ))}
//                 </>
//             }
//             onclose={isClose}
//             opened={isOpen}
//             width="650px"
//             height="500px"
//         />
//     );
// }


import React from "react";
import CommentData from "./commentData";
import { useParams, useNavigate } from "react-router-dom";
import { getBlog } from "../utils/api";
import { ArrowLeft } from "lucide-react";
import ButtonTrans from "./buttonTran";

export default function ViewData() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [hover1,setHover1] = React.useState(false);

    React.useEffect(() => {
        const loadBlog = async () => {
            setLoading(true);
            try {
                const res = await getBlog(id);
                setBlog(res.data);
            } catch (err) {
                console.error("Link error:", err);
            } finally {
                setLoading(false);
            }
        };
        if (id) loadBlog();
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Post...</div>;
    if (!blog) return <div style={{ textAlign: 'center', padding: '50px' }}>Post not found.</div>;

    return (
        <div style={{
            maxWidth: "800px",
            minWidth: "700px",
            margin: "20px auto",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
        }}>
            <ButtonTrans
                child={<>
                    <ArrowLeft size="20px" />
                </>}
                buttonType="button"
                noToolTip={true}
                label="back"
                paddingEdit="4px 4px"
                ClickEvent={() => navigate(-1)}
                hover={hover1}
                mouseEnter={() => setHover1(true)}
                mouseLeave={() => setHover1(false)}

            />

            <h1 style={{
                textAlign: "center",
                fontSize: "32px",
                color: "#2C3E50",
                fontFamily: "'Poppins', sans-serif",
                margin: "0px",
            }}>
                {blog.title}
            </h1>

            <p style={{
                fontSize: "16px",
                color: "#34495E",
                fontFamily: "'Poppins', sans-serif",
                lineHeight: "1.8",
                margin: "25px 0"
            }}>
                {blog.desc}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: "30px" }}>
                {blog.tags?.map((tag, index) => (
                    <span key={index} style={{ backgroundColor: '#ECF0F1', color: '#7F8C8D', padding: '4px 12px', borderRadius: '20px', fontSize: '13px' }}>
                        #{tag}
                    </span>
                ))}
            </div>

            <hr style={{ border: "0.5px solid #eee", marginBottom: "30px" }} />

            <h3 style={{ marginBottom: "20px" }}>Comments</h3>
            <CommentData commentData={blog.comments} blogId={blog._id} />
        </div>
    );
}