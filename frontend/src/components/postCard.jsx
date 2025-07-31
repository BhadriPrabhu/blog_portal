// import React from 'react';
// import { MessageSquareText, Share2 } from 'lucide-react'
// // import { ThumbsUp } from 'lucide-react'
// import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
// import ThumbUpIcon from '@mui/icons-material/ThumbUp';
// import ThumbDownIcon from '@mui/icons-material/ThumbDown';
// import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
// import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
// import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
// import Comment from './comment';
// // import Avatar from '@mui/material/Avatar';
// import { data } from '../data/data.jsx'
// import ViewData from './viewdata.jsx';
// import axios from 'axios';
// import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
// import BookmarkIcon from '@mui/icons-material/Bookmark';
// import { useStore } from '../data/zustand.jsx';



// export default function PostCard() {

//     const [sampleDatas, setSampleDatas] = React.useState([]);
//     const [selectedComments, setSelectedComments] = React.useState([]);
//     const [selectedId,setSelectedId] = React.useState("");


//     const profileData = useStore((state) => state.profileData)

//     React.useEffect(() => {
//         const result = axios.get("http://localhost:3000/blog")

//         result.then((res) => {
//             setSampleDatas(res.data);
//             console.log("Sample", res.data);
//         }).catch((err) => {
//             console.log(err);
//         })

//     }, []);

//     React.useEffect(() => {
//         console.log(sampleDatas, "sampleDatas")
//     }, [sampleDatas])

//     const likeBlog = async (blogId, idx, userId) => {
//         try {
//             const result = await axios.put("http://localhost:3000/blog/like", {blogId,userId});

//             const updatedLikeCount = result.data.likeCount;

//             setSampleDatas(prev =>
//                 prev.map((item, i) =>
//                     i === idx
//                         ? {
//                             ...item,
//                             like: updatedLikeCount,
//                             liked: !item.liked,
//                         }
//                         : item
//                 )
//             );

//             console.log("Like updated:", result.data);
//         } catch (error) {
//             console.error("Error liking blog:", error);
//         }
//     };

//     const handleSave = async (blogId,index) => {
//         const result = axios.post("http://localhost:3000/blog/save",{blogId})

//         result.then((res) => {
//             setSampleDatas((data) => data.map((d,i) => {
//                 return i === index ? {...d, saved: res.data.saved} : d;
//             }))
//         }).catch((err) => {
//             console.log(err);
//         })
//     }

//     const [hover1, setHover1] = React.useState(null);
//     const [hover2, setHover2] = React.useState(null);
//     const [hover3, setHover3] = React.useState(null);
//     const [hover4, setHover4] = React.useState(null);
//     const [isOpen, setIsOpen] = React.useState(false);
//     const [openModel, setOpenModel] = React.useState(false);
//     const [viewData, setViewData] = React.useState({});

//     // const isProfile = true;

//     const buttonStyle = { backgroundColor: "transparent", border: "0px", borderRadius: "15px", height: "30px", display: "flex", justifyContent: "start", alignItems: "center", fontfamily: "poppins", cursor: "pointer" };

//     const hoverStyle = { backgroundColor: "#9637371a", }

//     return (
//         <>
//             {sampleDatas.map((item, idx) => {
//                 // console.log(item);
//                 return (
//                     <div key={item.id || idx} style={{ width: "360px", border: "solid 2px #767676", padding: "10px", borderRadius: "10px", backgroundColor: "#f6e9e9ff", margin: "5px" }}>
//                         <div onClick={() => {
//                             setViewData(item);
//                             setOpenModel(true);
//                         }} style={{ cursor: "pointer" }} >
//                             <div style={{ display: "flex", justifyContent: "space-between", }}>
//                                 <p style={{ margin: "4px 0px", padding: "4px 6px", fontSize: "14px" }}>{new Date(item.date).toLocaleDateString("en-US", {
//                                     year: "numeric",
//                                     month: "long",
//                                     day: "numeric",
//                                 })}</p>
//                                 <div style={{ backgroundColor: "azure", margin: '4px 0px', padding: "4px 6px", borderRadius: '6px', display: "flex", gap: "5px", justifyContent: "center", alignItems: "center", fontSize: "14px" }}><div style={{ width: "20px", height: "20px", backgroundColor: "#0c5686ff", fontSize: "12px", borderRadius: "50%", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }} >{item.user?.user?.toUpperCase()?.charAt(0)}</div>{item.user?.user}</div>
//                             </div>
//                             <h3 style={{ margin: "0px", padding: "0px", height: "30px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.title}</h3>
//                             <p style={{ margin: "5px 0px", height: "70px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.desc}</p>
//                             <div style={{ display: "flex", justifyContent: "space-between" }}>
//                                 <div style={{ display: "flex", alignItems: "center", fontSize: "14px", gap: "4px" }}><FavoriteRoundedIcon sx={{ width: "18px", height: "18px" }} />{item.like} likes</div>
//                                 <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "14px" }}><ChatRoundedIcon sx={{ width: "18px", height: "18px" }} /> {item.comments.length} comments</div>
//                             </div>
//                         </div>

//                         <hr />
//                         <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around", marginTop: "10px" }}>
//                             <button style={hover1 === idx ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
//                                 onMouseEnter={() => setHover1(idx)}
//                                 onMouseLeave={() => setHover1(null)}
//                                 onClick={() => {
//                                     likeBlog(item._id, idx, profileData.email)
//                                     // setSampleDatas((data) =>
//                                     //     data.map((d, i) => i === idx ? { ...d, liked: !d.liked } : d)
//                                     // )
//                                     // setSampleDatas((data) => data.map((d, i) => {
//                                     //     if (i === idx) {
//                                     //         return {
//                                     //             ...d,
//                                     //             disliked: false
//                                     //         }
//                                     //     }
//                                     //     else {
//                                     //         return {
//                                     //             ...d
//                                     //         }
//                                     //     }
//                                     // }
//                                     // ))
//                                     // setSampleDatas({ ...sampleDatas, disliked: false })
//                                 }}
//                             >
//                                 <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" }}>{item.liked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}</div>
//                             </button>


//                             <button style={hover2 === idx ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
//                                 onMouseEnter={() => setHover2(idx)}
//                                 onMouseLeave={() => setHover2(null)}
//                                 onClick={() => handleSave(item._id,idx)}
//                             >
//                                 <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" }}>{item.saved ? <BookmarkIcon /> : <BookmarkBorderOutlinedIcon />}</div>
//                             </button>
//                             <button style={hover3 === idx ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
//                                 onMouseEnter={() => setHover3(idx)}
//                                 onMouseLeave={() => setHover3(null)}
//                                 onClick={() => {
//                                     setIsOpen(true)
//                                     setSelectedComments(item.comments || [])
//                                     setSelectedId(item._id);
//                                     console.log("Id",item._id);
//                                 }}
//                             >
//                                 <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" }}><MessageSquareText /></div>
//                             </button>
//                             <button style={hover4 === idx ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
//                                 onMouseEnter={() => setHover4(idx)}
//                                 onMouseLeave={() => setHover4(null)}
//                             >
//                                 <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "4px" }}><Share2 /></div>
//                             </button>
//                         </div>

//                     </div >
//                 );
//             })}

//             <Comment opened={isOpen} isClose={() => setIsOpen(false)} commentData={selectedComments} userId={selectedId} />

//             <ViewData isOpen={openModel} isClose={() => setOpenModel(false)} viewValue={[viewData]} />
//         </>
//     );
// }


import React from 'react';
import { MessageSquareText, Share2 } from 'lucide-react';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import ChatRoundedIcon from '@mui/icons-material/ChatRounded';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Comment from './comment';
import ViewData from './viewdata';
import axios from 'axios';
import { useStore } from '../data/zustand.jsx';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

export default function PostCard({ postsData = null, onReload = null }) {
    const [sampleDatas, setSampleDatas] = React.useState([]);
    const [selectedComments, setSelectedComments] = React.useState([]);
    const [selectedId, setSelectedId] = React.useState('');
    const [hover1, setHover1] = React.useState(null);
    const [hover2, setHover2] = React.useState(null);
    const [hover3, setHover3] = React.useState(null);
    const [hover4, setHover4] = React.useState(null);
    const [isOpen, setIsOpen] = React.useState(false);
    const [openModel, setOpenModel] = React.useState(false);
    const [viewData, setViewData] = React.useState({});

    const profileData = useStore((state) => state.profileData);
    const location = useLocation();

    React.useEffect(() => {
        fetchPosts();
    }, [postsData, location.search, profileData]);


    const fetchPosts = async () => {
        if (postsData) {
            setSampleDatas(postsData);
            return;
        }

        const urlParams = new URLSearchParams(location.search);
        const sortBy = urlParams.get('sortBy') || 'newest';
        const search = urlParams.get('search') || '';
        const userId = profileData?.email || '';
        if (!userId) {
            console.error('No userId found for fetching posts');
            return;
        }

        const endpoint = sortBy === 'saved' ? '/blog/saved' : sortBy === 'liked' ? '/blog/liked' : '/blog';
        let query = sortBy === 'saved' || sortBy === 'liked'
            ? `?userId=${encodeURIComponent(userId)}`
            : `?sortBy=${sortBy}&userId=${encodeURIComponent(userId)}${search ? `&search=${encodeURIComponent(search)}` : ''}`;

        console.log('Fetching posts:', { endpoint, query, userId });
        try {
            const res = await api.get(`${endpoint}${query}`);
            console.log('Fetched posts:', res.data);
            setSampleDatas(res.data);
        } catch (err) {
            console.error('Fetch posts error:', err.response?.data || err.message);
        }
    };

    const likeBlog = async (blogId, idx, userId) => {
        try {
            if (!userId) throw new Error('User ID is missing');
            const res = await api.put('/blog/like', { blogId, userId });
            const { likeCount, liked } = res.data;

            console.log('Like response:', res.data);
            setSampleDatas(prev =>
                prev.map((item, i) =>
                    i === idx ? { ...item, like: likeCount, liked } : item
                )
            );

            if (onReload) onReload();
            fetchPosts();
        } catch (error) {
            console.error('Error liking blog:', error.response?.data || error.message);
        }
    };

    const handleSave = async (blogId, idx) => {
        try {
            if (!profileData.email) throw new Error('User ID is missing');
            const res = await api.post('/blog/save', { blogId, userId: profileData.email });

            console.log('Save response:', res.data);
            setSampleDatas((data) => data.map((d, i) =>
                i === idx ? { ...d, saved: res.data.saved } : d
            ));

            if (onReload) onReload();
            fetchPosts();
        } catch (err) {
            console.error('Error saving blog:', err.response?.data || err.message);
        }
    };


    const buttonStyle = {
        backgroundColor: 'transparent',
        border: '0px',
        borderRadius: '15px',
        height: '30px',
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        fontFamily: 'Poppins, sans-serif',
        cursor: 'pointer',
        color: '#2C3E50',
    };
    const hoverStyle = { backgroundColor: '#9637371a' };

    return (
        <>
            {sampleDatas.length === 0 && (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                    No posts to show.
                </div>
            )}

            {sampleDatas.map((item, idx) => (
                <div
                    key={item._id || idx}
                    style={{
                        width: '360px',
                        border: 'solid 2px #767676',
                        padding: '10px',
                        borderRadius: '10px',
                        backgroundColor: '#E8ECEF',
                        margin: '5px',
                    }}
                >
                    <div
                        onClick={() => {
                            setViewData(item);
                            setOpenModel(true);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <p style={{ margin: '4px 0px', padding: '4px 6px', fontSize: '14px' }}>
                                {new Date(item.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            <div
                                style={{
                                    backgroundColor: 'azure',
                                    margin: '4px 0px',
                                    padding: '4px 6px',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    gap: '5px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '14px',
                                }}
                            >
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#0c5686ff',
                                        fontSize: '12px',
                                        borderRadius: '50%',
                                        color: 'white',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    {item.user?.user?.toUpperCase()?.charAt(0) || 'U'}
                                </div>
                                {item.user?.user || 'Unknown'}
                            </div>
                        </div>

                        <h3
                            style={{
                                margin: 0,
                                padding: 0,
                                height: '30px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {item.title}
                        </h3>
                        <p
                            style={{
                                margin: '5px 0px',
                                height: '70px',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {item.desc}
                        </p>
                        {/* <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
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
                        </div> */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '14px', gap: '4px', color: '#100f0fff' }}>
                                <FavoriteRoundedIcon sx={{ width: '18px', height: '18px', color: 'red' }} />
                                {item.like} likes
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', color: '#100f0fff' }}>
                                <ChatRoundedIcon sx={{ width: '18px', height: '18px', color: 'gray' }} />
                                {item.comments?.length || 0} comments
                            </div>
                        </div>
                    </div>

                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
                        <button
                            style={hover1 === idx ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                            onMouseEnter={() => setHover1(idx)}
                            onMouseLeave={() => setHover1(null)}
                            onClick={() => likeBlog(item._id, idx, profileData.email)}
                            aria-label={item.liked ? 'Unlike post' : 'Like post'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {item.liked ? <ThumbUpIcon sx={{ color: '#0a82d2ff' }} /> : <ThumbUpOutlinedIcon sx={{ color: 'gray' }} />}
                            </div>
                        </button>

                        <button
                            style={hover2 === idx ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                            onMouseEnter={() => setHover2(idx)}
                            onMouseLeave={() => setHover2(null)}
                            onClick={() => handleSave(item._id, idx)}
                            aria-label={item.saved ? 'Unsave post' : 'Save post'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {item.saved ? <BookmarkIcon sx={{ color: '#0a82d2ff' }} /> : <BookmarkBorderOutlinedIcon sx={{ color: 'gray' }} />}
                            </div>
                        </button>

                        <button
                            style={hover3 === idx ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                            onMouseEnter={() => setHover3(idx)}
                            onMouseLeave={() => setHover3(null)}
                            onClick={() => {
                                setIsOpen(true);
                                setSelectedComments(item.comments || []);
                                setSelectedId(item._id);
                            }}
                            aria-label='View comments'
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MessageSquareText color={hover3 === idx ? '#2ECC71' : 'gray'} />
                            </div>
                        </button>

                        <button
                            style={hover4 === idx ? { ...buttonStyle, ...hoverStyle } : buttonStyle}
                            onMouseEnter={() => setHover4(idx)}
                            onMouseLeave={() => setHover4(null)}
                            aria-label='Share post'
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Share2 color={hover4 === idx ? '#3498DB' : 'gray'} />
                            </div>
                        </button>
                    </div>
                </div>
            ))}

            <Comment opened={isOpen} isClose={() => setIsOpen(false)} commentData={selectedComments} userId={selectedId} />
            <ViewData isOpen={openModel} isClose={() => setOpenModel(false)} viewValue={[viewData]} />
        </>
    );
}