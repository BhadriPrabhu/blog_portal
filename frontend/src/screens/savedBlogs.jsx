// import React from "react";
// import PostCard from "../components/postCard";
// import axios from "axios";


// export default function SavedBlogs(){

//     const [data,setData] = React.useState([]);

//     React.useEffect(() => {
//         axios.get("http://localhost:3000/blog/saved").then((res) => {
//             setData(res.data);
//             console.log("Saved",res.data);
//         }).catch((err) => {
//             console.error(err);
//         })
//     },[])

//     return(
//         <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", padding: "20px", gap: "20px" }}>
//             <h2 style={{padding: "0px", margin: "0px"}}>Saved Blogs</h2>
//             <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap",}}>
//                 <PostCard postsData={data} />
//             </div>
//         </div>
//     );
// }

import React from 'react';
import axios from 'axios';
import { useStore } from '../data/zustand.jsx';
import PostCard from '../components/postCard.jsx';
import { fetchSavedBlogs } from '../utils/api';

export default function SavedBlogs() {
    const [posts, setPosts] = React.useState([]);
    const profileData = useStore((state) => state.profileData);

    React.useEffect(() => {
        const userId = profileData?.email || '';
        if (!userId) {
            console.error('No userId found for saved blogs');
            return;
        }

        console.log('Fetching saved blogs for userId:', userId);
        fetchSavedBlogs(userId)
            .then((res) => {
                console.log('Fetched saved blogs:', res.data);
                setPosts(res.data);
            })
            .catch((err) => {
                console.error('Error fetching saved blogs:', err.response?.data || err.message);
            });
    }, [profileData]);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", padding: "20px", gap: "20px" }}>
                <h2 style={{ padding: "0px", margin: "0px 5px" }}>Saved Post</h2>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                    <PostCard postsData={posts} onReload={() => setPosts([])} />
                </div>

            </div>

        </>


    );
}