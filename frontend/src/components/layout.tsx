import { Outlet } from "react-router-dom"
import SideBar from "./sidebar"
import TopBar from "./topBar"

export const Layout = () => {
    return (
        <div style={{ display: "flex", flexDirection: "row", backgroundColor: "aliceblue", }}>
            <SideBar />
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "end", position: "sticky", top: '0px', zIndex: 100 }}>
                    <TopBar />
                </div>
                <div style={{ zIndex: 1}}>
                    <Outlet />
                </div>

            </div>

        </div>
    )
}