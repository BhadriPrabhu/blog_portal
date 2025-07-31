import React from 'react';
import axios from 'axios';
import { useStore } from '../data/zustand.jsx';
import PostCard from '../components/postCard.jsx';

export default function LikedBlogs() {
    const [posts, setPosts] = React.useState([]);
    const profileData = useStore((state) => state.profileData);

    React.useEffect(() => {
        const userId = profileData?.email || '';
        if (!userId) {
            console.error('No userId found for liked blogs');
            return;
        }

        console.log('Fetching liked blogs for userId:', userId);
        axios.get(`http://localhost:3000/blog/liked?userId=${encodeURIComponent(userId)}`)
            .then((res) => {
                console.log('Fetched liked blogs:', res.data);
                setPosts(res.data);
            })
            .catch((err) => {
                console.error('Error fetching liked blogs:', err.response?.data || err.message);
            });
    }, [profileData]);

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", padding: "20px", gap: "20px" }}>
                <h2 style={{ padding: "0px", margin: "0px 5px" }}>Liked Post</h2>
                <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                    <PostCard postsData={posts} onReload={() => setPosts([])} />;
                </div>

            </div>

        </>
    )
}