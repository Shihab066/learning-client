import { Link, NavLink, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import { Helmet } from "react-helmet-async";
import logo from '/logo.png'
import { useEffect, useState } from "react";
// import { useState } from "react";


const Navbar = () => {
    const { user, logOut, loading } = useAuth();
    // const [theme, setTheme] = useState(false);
    const navigate = useNavigate()
    const signOut = () => {
        logOut()
        navigate('/')       
    }
    const [userRole] = useUserRole();
    const isAdmin = userRole === 'admin';
    const isStudent = userRole === 'student';
    const isInstructor = userRole === 'instructor';
    const navbarItem = <>
        <li><NavLink to={'/'} >Home</NavLink></li>
        <li><NavLink to={'/class'} >Classes</NavLink></li>
        <li><NavLink to={'/instructors'} >Instructors</NavLink></li>
        <li className={`${!user && 'hidden'}`}><NavLink to={`/dashboard/${isStudent && 'selectedClass' || isInstructor && 'myClass' || isAdmin && 'manageClass' || ''}`} >
            Dashboard
        </NavLink>
        </li>
        <li><div onClick={logOut} className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white normal-case w-fit ml-2 md:hidden">Logout</div></li>
    </>

    const [stickyNav, setStickyNav] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            const position = window.scrollY;

            if (position > 800) {
                setStickyNav(true)
            } else {
                setStickyNav(false)
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <><Helmet>
            {/* <html lang="en" data-theme={theme ? 'dark' : 'light'} /> */}
        </Helmet>
            <nav className={`bg-white z-50 sticky ${stickyNav ? 'fade-in drop-shadow' : 'fade-out'}`}>
                <div className="navbar lg-container px-4 lg:py-3">
                    <div className="navbar-start z-20">
                        <div className="dropdown">
                            <label tabIndex={0} className="btn btn-ghost pl-0 lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                {navbarItem}
                            </ul>
                        </div>
                        <div className="flex gap-x-2 items-center">
                            <img src={logo} className="w-10" alt="" />
                            <a href="/" className="text-gray-900 tracking-wide normal-case text-2xl">𝗦𝗵𝗶𝗸𝗵𝗼</a>
                        </div>
                        {/* <label className="swap swap-rotate ml-2 ">

                            
                            <input onClick={() => setTheme(!theme)} type="checkbox" />

                            
                            <svg className="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>

                            
                            <svg className="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>

                        </label> */}
                    </div>

                    <div className="navbar-end">
                        <div className="hidden lg:flex">
                            <ul className="menu menu-horizontal px-1 font-medium">
                                {navbarItem}
                            </ul>
                        </div>
                        <div>
                            {loading ? <span className="loading loading-ring loading-lg"></span> :
                                user ? <div className="flex items-center gap-2">
                                    {user.photoURL && <img src={user.photoURL} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" title={user.displayName ? user.displayName : ''} alt="" />}
                                    <div onClick={signOut} className="btn bg-blue-600 hover:bg-blue-700 text-white normal-case hidden md:flex">Logout</div>
                                </div> :
                                    <Link to={'/login'}><div className="btn bg-blue-600 hover:bg-blue-700 text-white normal-case">Login</div></Link>
                            }
                        </div>

                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;