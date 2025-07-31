import React from "react";
import { useStore } from "../data/zustand";
import axios from "axios";
import PostCard from "../components/postCard";
import { fetchMyPosts } from '../utils/api';

export default function MyPost() {
    const profileData = useStore((state) => state.profileData);
    const [data, setData] = React.useState([]);

    React.useEffect(() => {
        fetchMyPosts(profileData._id)
            .then((res) => {
                setData(res.data);
                console.log("My", res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", padding: "20px", gap: "20px" }}>
            <h2 style={{ padding: "0px", margin: "0px 5px" }}>My Post</h2>
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                <PostCard postsData={data} />
                {data.length === 0 && (
                    <div style={{ justifyContent: "center", alignItems: "center", display: "flex", width: "100%" }}>
                        Empty
                    </div>
                )}
            </div>
        </div>
    );
}
