// import { Navigate, Route, Routes } from 'react-router-dom'
// import Home from '../screens/home';
// import Login from '../screens/login';
// import Register from '../screens/register';
// // import SideBar from '../components/sidebar';
// import { Layout } from '../components/layout';
// import { useStore } from '../data/zustand';
// import Admin from '../components/admin';
// import SavedBlogs from '../screens/savedBlogs';
// import LikedBlogs from '../screens/likedBlogs';
// import MyPost from '../screens/myPost';
// import AdminHome from '../screens/adminHome';
// import Admin_Home from '../test/Admin_Home';
// import { useNavigate } from 'react-router-dom';
// import React from 'react';

// export default function Router() {

//     const navigate = useNavigate();
//     const isAuth = useStore((state) => state.isAuth);
//     const user = useStore((state) => state.profileData);
//     // React.useEffect(() => {
//     //     if(isAuth && user.role === "admin"){
//     //         navigate("/admin");
//     //     }else if(isAuth){
//     //         navigate("/blog");
//     //     }
//     // },[isAuth])



//     console.log(isAuth);

//     return (
//         <Routes>
//             {isAuth ? (
//                 <>
//                     <Route path="/" element={<Navigate to={"/blog"}/>}/>
//                     <Route path='/admin' element={
//                         user.role === "admin" ? (
//                             // <Admin />
//                             <AdminHome />
//                         ) : <Navigate to={"/blog"} />}
//                     />

//                     <Route path='/blog' element={<Layout />}>
//                         <Route index element={<Home />} />
//                         <Route path='/blog/saved' element={<SavedBlogs />} />
//                         <Route path='/blog/liked' element={<LikedBlogs />} />
//                         <Route path='/blog/mypost' element={<MyPost />} />
//                     </Route>
//                 </>
//             ) : (
//                 <>
//                     <Route path='/' element={<Login/>} />
//                     <Route path='/register' element={<div style={{ width: "100%", display: "flex", justifyContent: "center" }}><Register /></div>} />
//                 </>
//             )}


//         </Routes>
//     );
// }

import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '../screens/home';
import Login from '../screens/login';
import Register from '../screens/register';
import { Layout } from '../components/layout';
import { useStore } from '../data/zustand';
import AdminHome from '../screens/adminHome'; // Using AdminHome as primary
import SavedBlogs from '../screens/savedBlogs';
import LikedBlogs from '../screens/likedBlogs';
import MyPost from '../screens/myPost';
import React from 'react';

export default function Router() {
  const isAuth = useStore((state) => state.isAuth);
  const user = useStore((state) => state.profileData);

  console.log('Auth state:', isAuth, 'User role:', user?.role);

  return (
    <Routes>
      {isAuth ? (
        <>
          <Route path="/" element={<Navigate to="/blog" />} />
          <Route
            path="/admin"
            element={
              user?.role === "admin" ? <AdminHome /> : <Navigate to="/blog" />
            }
          />
          <Route path="/blog" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="saved" element={<SavedBlogs />} />
            <Route path="liked" element={<LikedBlogs />} />
            <Route path="mypost" element={<MyPost />} />
          </Route>
          {/* <Route path="*" element={<Navigate to="/blog" />} /> */}
          <Route path="*" element={<Navigate to={isAuth ? "/blog" : "/"} replace />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Login />} />
          <Route
            path="/register"
            element={
              <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <Register />
              </div>
            }
          />
          <Route path="*" element={<Navigate to="/" />} /> {/* Fallback route */}
        </>
      )}
    </Routes>
  );
}