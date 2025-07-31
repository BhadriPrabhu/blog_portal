import { Route, Routes } from 'react-router-dom'
import Home from '../screens/home';
import Login from '../screens/login';
import Register from '../screens/register';
// import SideBar from '../components/sidebar';
import { Layout } from '../components/layout';
import { useStore } from '../data/zustand';
import Admin from '../components/admin';
import SavedBlogs from '../screens/savedBlogs';
import LikedBlogs from '../screens/likedBlogs';
import MyPost from '../screens/myPost';
import AdminHome from '../screens/adminHome';
import Admin_Home from '../test/Admin_Home';
import { useNavigate } from 'react-router-dom';
import React from 'react';

export default function Router() {

    const navigate = useNavigate();
    const isAuth = useStore((state) => state.isAuth);    
    const user = useStore((state) => state.profileData);
    React.useEffect(() => {
        if(isAuth && user.role === "admin"){
            navigate("/admin");
        }else if(isAuth){
            navigate("/blog");
        }
    },[isAuth])



    console.log(isAuth);

    return (
        <Routes>
            {isAuth ? (
                <>
                    {user.role === "admin" && (
                            <Route path='/admin' element={
                                // <Admin />
                                <AdminHome/>
                                // <Admin_Home />
                                } />
                    )}

                    <Route path='/blog' element={<><Layout /></>}>
                        <Route index element={<Home />} />
                        <Route path='/blog/saved' element={<SavedBlogs />} />
                        <Route path='/blog/liked' element={<LikedBlogs />} />
                        <Route path='/blog/mypost' element={<MyPost />} />
                    </Route>
                </>
            ) : (
                <>
                    <Route path='/' element={<div style={{ width: "100%", display: "flex", justifyContent: "center" }}><Login /></div>} />
                    <Route path='/register' element={<div style={{ width: "100%", display: "flex", justifyContent: "center" }}><Register /></div>} />
                </>
            )}


        </Routes>
    );
}