// import { useState } from "react";
// import Profile from "../assets/icons/profile";
// import SearchBar from "./searchbar";



// export default function SideBar() {


//     // const isProfile = true;

//     // const [isSearch,setIsSearch] = useState(false);

//     const iconStyle = {
//         width: '20px',
//         height: '20px',
//         // marginRight: '10px',
//         stroke: '#6B7280', // Tailwind gray-500
//         flexShrink: 0,
//     };

//     return (
//         <div style={{ width: "320px", padding: "20px", borderRight: "solid 1px #767676", height: "100%", position: "sticky", top: "0px"}}>
//             <div>
//                 <SearchBar />
//             </div>
//             <div>
                
//             </div>
//         </div>
//     );
// }


// import { useState } from 'react';
// import SearchBar from './searchbar';
// import { Home, Settings, LogOut, HelpCircle, Heart } from 'lucide-react';
// import Post from '@mui/icons-material/ArticleOutlined';
// import Bookmark from '@mui/icons-material/BookmarkBorderOutlined';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useStore } from '../data/zustand';

// function NavItem({ icon, label, Click, style }) {
//     const style1 = { fontSize: '16px' };
//     return (
//         <div
//             style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '10px',
//                 padding: '10px 12px',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 color: '#333',
//                 transition: 'background-color 0.2s ease-in-out',
//             }}
//             onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e7e7e7')}
//             onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
//             onClick={Click}
//         >
//             <div style={{ color: '#6B7280', display: 'flex', alignItems: 'center' }}>{icon}</div>
//             <span style={style ? { ...style1, ...style } : { ...style1 }}>{label}</span>
//         </div>
//     );
// }

// export default function SideBar() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const setIsAuth = useStore((state) => state.setIsAuth);
//     const profileData = useStore((state) => state.profileData);

//     const sortOptions = [
//         { label: 'Newest First', value: 'newest' },
//         { label: 'Oldest First', value: 'oldest' },
//         { label: 'Most Liked', value: 'liked' },
//         { label: 'Most Commented', value: 'commented' },
//     ];

//     const urlParams = new URLSearchParams(location.search);
//     const currentSort = urlParams.get('sortBy') || 'newest';

//     const handleSortChange = (value) => {
//         const userId = profileData?.email || '';
//         const query = value === 'saved' ? `/blog?sortBy=${value}&userId=${encodeURIComponent(userId)}` : `/blog?sortBy=${value}`;
//         navigate(query);
//     };

//     return (
//         <div
//             style={{
//                 width: '300px',
//                 padding: '20px',
//                 borderRight: '1px solid #ddd',
//                 height: '95vh',
//                 position: 'sticky',
//                 top: 0,
//                 fontFamily: 'Poppins, sans-serif',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 justifyContent: 'space-between',
//                 gap: '20px',
//                 backgroundColor: '#fafafa',
//             }}
//         >
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
//                 <SearchBar />
//                 <div>
//                     <NavItem Click={() => navigate('/blog')} icon={<Home size={18} />} label='Home' />
//                     <NavItem Click={() => navigate('/blog/mypost')} icon={<Post fontSize='small' />} label='My Posts' />
//                     <NavItem
//                         Click={() => navigate(`/blog/saved?userId=${encodeURIComponent(profileData?.email || '')}`)}
//                         icon={<Bookmark fontSize='small' />}
//                         label='Saved'
//                     />
//                     <NavItem
//                         Click={() => navigate(`/blog/liked?userId=${encodeURIComponent(profileData?.email || '')}`)}
//                         icon={<Heart size={18} />}
//                         label='Liked'
//                     />
//                 </div>

//                 <div
//                     style={{
//                         padding: '10px',
//                         backgroundColor: '#f1f1f1',
//                         borderRadius: '12px',
//                         border: '1px solid #ddd',
//                     }}
//                 >
//                     <h3 style={{ fontSize: '16px', margin: '5px', color: '#444', padding: '0px' }}>Sort By</h3>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//                         {sortOptions.map((option) => (
//                             <label
//                                 key={option.value}
//                                 style={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: '10px',
//                                     fontSize: '16px',
//                                     color: '#333',
//                                     cursor: 'pointer',
//                                 }}
//                             >
//                                 <input
//                                     type='radio'
//                                     name='sortBy'
//                                     value={option.value}
//                                     checked={currentSort === option.value}
//                                     onChange={() => handleSortChange(option.value)}
//                                     style={{
//                                         accentColor: '#0c5686ff',
//                                         cursor: 'pointer',
//                                     }}
//                                 />
//                                 {option.label}
//                             </label>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             <div>
//                 <NavItem icon={<Settings size={18} />} label='Settings' />
//                 <NavItem icon={<HelpCircle size={18} />} label='Help' />
//                 <NavItem
//                     icon={<LogOut size={18} color='red' />}
//                     style={{ color: 'red' }}
//                     Click={() => {
//                         setIsAuth(false);
//                         navigate('/');
//                     }}
//                     label='Logout'
//                 />
//             </div>
//         </div>
//     );
// }

import React from 'react';
import { useState } from 'react';
import SearchBar from './SearchBar';
import { Home, Settings, LogOut, HelpCircle, Heart } from 'lucide-react';
import Post from '@mui/icons-material/ArticleOutlined';
import Bookmark from '@mui/icons-material/BookmarkBorderOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../data/zustand';

function NavItem({ icon, label, Click, style }) {
    const style1 = { fontSize: '16px' };
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#333',
                transition: 'background-color 0.2s ease-in-out',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e7e7e7')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            onClick={Click}
        >
            <div style={{ color: '#6B7280', display: 'flex', alignItems: 'center' }}>{icon}</div>
            <span style={style ? { ...style1, ...style } : { ...style1 }}>{label}</span>
        </div>
    );
}

export default function SideBar() {
    const navigate = useNavigate();
    const location = useLocation();
    const setIsAuth = useStore((state) => state.setIsAuth);
    const profileData = useStore((state) => state.profileData);
    const [searchTerm, setSearchTerm] = useState('');

    const sortOptions = [
        { label: 'Newest First', value: 'newest' },
        { label: 'Oldest First', value: 'oldest' },
        { label: 'Most Liked', value: 'liked' },
        { label: 'Most Commented', value: 'commented' },
    ];

    const urlParams = new URLSearchParams(location.search);
    const currentSort = urlParams.get('sortBy') || 'newest';
    const currentSearch = urlParams.get('search') || '';

    React.useEffect(() => {
        setSearchTerm(currentSearch);
    }, [currentSearch]);

    const handleSortChange = (value) => {
        const userId = profileData?.email || '';
        if (!userId) {
            console.error('No userId for navigation');
            return;
        }
        const query = value === 'saved' ? `/blog/saved?userId=${encodeURIComponent(userId)}` :
                     value === 'liked' ? `/blog/liked?userId=${encodeURIComponent(userId)}` :
                     `/blog?sortBy=${value}&userId=${encodeURIComponent(userId)}${searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : ''}`;
        console.log('Navigating to:', query);
        navigate(query);
    };

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        const userId = profileData?.email || '';
        if (!userId) {
            console.error('No userId for search');
            return;
        }
        const query = term ? `/blog?sortBy=${currentSort}&userId=${encodeURIComponent(userId)}&search=${encodeURIComponent(term)}` :
                            `/blog?sortBy=${currentSort}&userId=${encodeURIComponent(userId)}`;
        console.log('Search navigating to:', query);
        navigate(query);
    };

    return (
        <div
            style={{
                width: '300px',
                padding: '20px',
                borderRight: '1px solid #ddd',
                height: '95vh',
                position: 'sticky',
                top: 0,
                fontFamily: 'Poppins, sans-serif',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '20px',
                backgroundColor: '#fafafa',
            }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <SearchBar value={searchTerm} onChange={handleSearch} />
                <div>
                    <NavItem Click={() => navigate(`/blog?userId=${encodeURIComponent(profileData?.email || '')}`)} icon={<Home size={18} />} label='Home' />
                    <NavItem Click={() => navigate('/blog/mypost')} icon={<Post fontSize='small' />} label='My Posts' />
                    <NavItem
                        Click={() => navigate(`/blog/saved?userId=${encodeURIComponent(profileData?.email || '')}`)}
                        icon={<Bookmark fontSize='small' />}
                        label='Saved'
                    />
                    <NavItem
                        Click={() => navigate(`/blog/liked?userId=${encodeURIComponent(profileData?.email || '')}`)}
                        icon={<Heart size={18} />}
                        label='Liked'
                    />
                </div>

                <div
                    style={{
                        padding: '10px',
                        backgroundColor: '#f1f1f1',
                        borderRadius: '12px',
                        border: '1px solid #ddd',
                    }}
                >
                    <h3 style={{ fontSize: '16px', margin: '5px', color: '#444', padding: '0px' }}>Sort By</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {sortOptions.map((option) => (
                            <label
                                key={option.value}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    fontSize: '16px',
                                    color: '#333',
                                    cursor: 'pointer',
                                }}
                            >
                                <input
                                    type='radio'
                                    name='sortBy'
                                    value={option.value}
                                    checked={currentSort === option.value}
                                    onChange={() => handleSortChange(option.value)}
                                    style={{
                                        accentColor: '#0c5686ff',
                                        cursor: 'pointer',
                                    }}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <NavItem icon={<Settings size={18} />} label='Settings' />
                <NavItem icon={<HelpCircle size={18} />} label='Help' />
                <NavItem
                    icon={<LogOut size={18} color='red' />}
                    style={{ color: 'red' }}
                    Click={() => {
                        setIsAuth(false);
                        navigate('/');
                    }}
                    label='Logout'
                />
            </div>
        </div>
    );
}