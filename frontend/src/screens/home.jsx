import PostBox from "../components/postBox";
import PostCard from "../components/postCard";
// import SideBar from "../components/sidebar";


export default function Home() {


    return (
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "start", padding: "20px", gap: "20px" }}>
            <div style={{ display: "flex" }}>
                <PostBox />
            </div>
            <div style={{display: "flex", flexDirection: "row", flexWrap: "wrap",}}>
                <PostCard />
            </div>
        </div>
    );
}