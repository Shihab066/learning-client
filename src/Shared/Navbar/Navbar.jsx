import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import { Helmet } from "react-helmet-async";
import logo from '/logo.png'
import { useEffect, useState } from "react";
import searchIcon from '../../assets/icon/search_icon.svg';


function usePathQuery() {
    return new URLSearchParams(useLocation().search);
}


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

    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (event) => {
        event.preventDefault()
        const search = event.target.search.value;        
        setSearchValue(search)
        navigate(`/class`, { state: { search: search } })
    }

    const search = usePathQuery().get('search');
    useEffect(() => {
        setSearchValue(search)
    }, [search])
    return (
        <><Helmet>
            {/* <html lang="en" data-theme={theme ? 'dark' : 'light'} /> */}
        </Helmet>
            <nav className={`bg-white z-50 sticky drop-shadow ${stickyNav ? 'fade-in' : 'fade-out'}`}>
                <div className="lg-container flex justify-between px-4 lg:py-3">
                    <div className="flex items-center z-20">
                        {/* <div className="dropdown">
                            <label tabIndex={0} className="btn btn-ghost pl-0 lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                                {navbarItem}
                            </ul>
                        </div> */}
                        <div className="flex gap-x-2 items-center">
                            <img src={logo} className="w-8 sm:w-10" alt="" />
                            <a href="/" className="text-gray-900 tracking-wide normal-case text-lg sm:text-2xl font-bold">Learning Point</a>
                        </div>

                        {/* Search input */}
                        <form
                            onSubmit={handleSearch}
                            className="ml-10 w-fit h-fit relative">
                            <input
                                onChange={(e) => setSearchValue(e.target.value)}
                                type="text"
                                name="search"
                                className="w-[450px] border-2 rounded-md border-blue-400 focus:outline-none pl-3 pr-10 py-2"
                                placeholder="Search"
                                autoComplete="off"
                                value={searchValue || ''}

                            />

                            {/* search icon */}
                            <button type="submit" className="cursor-pointer absolute right-[10px] top-1/2 -translate-y-1/2">
                                <img className="text-gray-600" src={searchIcon} alt="search icon" />
                            </button>
                        </form>
                    </div>


                    <div className="flex items-center">
                        <div className="hidden lg:flex">
                            <ul className="menu menu-horizontal px-1 font-medium">
                                {navbarItem}
                            </ul>
                        </div>

                        <div>
                            {loading ? <span className="loading loading-ring loading-lg"></span> :
                                user ? <div className="flex items-center gap-2">
                                    {user.photoURL && <img src={user.photoURL} className="w-9 sm:w-10 h-9 sm:h-10 rounded-full object-cover" referrerPolicy="no-referrer" title={user.displayName ? user.displayName : ''} alt="" />}
                                    <div onClick={signOut} className="btn bg-blue-600 hover:bg-blue-700 text-white normal-case hidden md:flex">Logout</div>
                                </div> :
                                    <Link to={'/login'}><div className="btn btn-sm sm:btn-md bg-blue-600 hover:bg-blue-700 text-white normal-case">Login</div></Link>
                            }
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;