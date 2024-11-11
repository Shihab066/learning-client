import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Turn as Hamburger } from "hamburger-react";

import logo from "/logo.png";
import searchIcon from "../../assets/icon/search_icon.svg";
import dummyImg from "../../assets/icon/user_icon.png";
import { useQuery } from "@tanstack/react-query";
import { fetchCartItems } from "../../services/cartService";
// import Hamburger from "./Hamburger/Hamburger";

// Custom hook to extract query parameters from URL
function usePathQuery() {
  return new URLSearchParams(useLocation().search);
}

const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Retrieve user role
  // const [userRole] = useUserRole();
  // const isAdmin = userRole === "admin";
  // const isStudent = userRole === "student";
  // const isInstructor = userRole === "instructor";

  // Handle logout and redirect to home
  const signOut = () => {
    logOut();
    navigate("/");
  };

  // Dynamic navigation links based on user role
  // const navbarItem = (
  //   <>
  //     <li><NavLink to="/courses">Courses</NavLink></li>
  //     <li><NavLink to="/instructors">Instructors</NavLink></li>
  //   </>
  // );

  const navbarMobileItem = (
    <>
      {/* <li><NavLink to="/">Home</NavLink></li> */}
      <li><NavLink to="/courses">Courses</NavLink></li>
      <li><NavLink to="/instructors">Instructors</NavLink></li>
      <hr className="mb-2" />
      <li><NavLink to="/instructors">Wishlist</NavLink></li>
      <li><NavLink to="/instructors">Notifications</NavLink></li>
      <li><NavLink to="/user">Manage Account</NavLink></li>
      {/* {user && (
        <li>
          <NavLink
            to={`/dashboard/${isStudent ? "selectedClass" : isInstructor ? "myClass" : isAdmin ? "manageClass" : ""}`}
          >
            Dashboard
          </NavLink>
        </li>
      )} */}
      <hr className="mb-3" />
      {user ? (
        <li>
          <div onClick={signOut} className="flex items-center gap-x-1 bg-black text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.232 3.25H9.768c-.813 0-1.469 0-2 .043c-.546.045-1.026.14-1.47.366a3.75 3.75 0 0 0-1.64 1.639c-.226.444-.32.924-.365 1.47c-.043.531-.043 1.187-.043 2v6.464c0 .813 0 1.469.043 2c.045.546.14 1.026.366 1.47a3.75 3.75 0 0 0 1.639 1.64c.444.226.924.32 1.47.365c.531.043 1.187.043 2 .043h2.464c.813 0 1.469 0 2-.043c.546-.045 1.026-.14 1.47-.366a3.75 3.75 0 0 0 1.64-1.639c.226-.444.32-.924.365-1.47c.043-.531.043-1.187.043-2V15a.75.75 0 0 0-1.5 0v.2c0 .852 0 1.447-.038 1.91c-.038.453-.107.714-.207.912c-.216.423-.56.767-.983.983c-.198.1-.459.17-.913.207c-.462.037-1.056.038-1.909.038H9.8c-.852 0-1.447 0-1.91-.038c-.453-.038-.714-.107-.911-.207a2.25 2.25 0 0 1-.984-.983c-.1-.198-.17-.459-.207-.913c-.037-.462-.038-1.057-.038-1.909V8.8c0-.852 0-1.447.038-1.91c.037-.453.107-.714.207-.911a2.25 2.25 0 0 1 .984-.984c.197-.1.458-.17.912-.207c.462-.037 1.057-.038 1.909-.038h2.4c.853 0 1.447 0 1.91.038c.453.037.714.107.912.207c.423.216.767.56.983.984c.1.197.17.458.207.912c.037.462.038 1.057.038 1.909V9a.75.75 0 0 0 1.5 0v-.232c0-.813 0-1.469-.043-2c-.045-.546-.14-1.026-.366-1.47a3.75 3.75 0 0 0-1.639-1.64c-.444-.226-.924-.32-1.47-.365c-.531-.043-1.187-.043-2-.043"></path><path fill="currentColor" d="M12.47 8.47a.75.75 0 1 1 1.06 1.06l-1.72 1.72H20a.75.75 0 0 1 0 1.5h-8.19l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06z"></path></svg>
            <span>
              Logout
            </span>
          </div>
        </li>
      ) : (
        <li className="sm:hidden">
          <Link to="/login" className="pl-2">
            <div className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white normal-case w-fit">Login</div>
          </Link>
        </li>
      )}
    </>
  )

  // Handle sticky navigation on scroll
  const [stickyNav, setStickyNav] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setStickyNav(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Search functionality
  const [searchValue, setSearchValue] = useState("");
  const handleSearch = (event) => {
    event.preventDefault();
    const searchKey = event.target.search.value || "";
    setSearchValue(searchKey);
    navigate("/courses", { state: { search: searchKey } });
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
  };

  // Get search query from URL
  const search = usePathQuery().get("search") || "";
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  // Disable scroll when hamburger menu is open
  useEffect(() => {
    document.body.style.overflow = isHamburgerOpen ? "hidden" : "";
  }, [isHamburgerOpen]);

  // Close hamburger menu on dropdown item click
  const handleDropdownItemClick = (event) => {
    if (event.target.closest("li")) {
      setIsHamburgerOpen(false);
    }
  };

  // cart items count 
  const { data: cartItemCount } = useQuery({
    queryKey: ['cartCount', user],
    enabled: user !== null,
    queryFn: async () => {
      const cartItems = await fetchCartItems(user?.uid);
      return cartItems.filter(item => item.savedForLater === false).length;
    }
  });


  return (
    <>
      <Helmet>
        {/* Add theme change logic here if needed */}
      </Helmet>
      <div className={`bg-white z-50 sticky top-0 w-full drop-shadow ${stickyNav ? "fade-in" : "fade-out"} relative h-fit`}>
        <div className="lg-container flex items-center justify-between gap-x-4 pr-3 sm:pl-1 xl:pl-4 sm:pr-3 md:pr-4 py-1 sm:py-1 lg:py-2.5">
          <div className="flex items-center z-20">
            {/* Hamburger icon */}
            <div onClick={() => setIsHamburgerOpen(!isHamburgerOpen)} className="xl:hidden h-12 flex items-center">
              {/* <Hamburger isHamburgerOpen={isHamburgerOpen} /> */}
              <Hamburger
                size={25}
                toggle={setIsHamburgerOpen}
                toggled={isHamburgerOpen}
                direction="right"
                rounded={true}
              />
            </div>

            {/* Site Logo */}
            <div onClick={() => navigate('/')} className="flex gap-x-1 items-center cursor-pointer">
              <img src={logo} className="w-8 xl:w-10" alt="Learning Point Logo" />
              <a className="text-gray-900 tracking-wide normal-case text-lg xl:text-2xl font-bold">
                Learning Point
              </a>
            </div>
          </div>

          {/* Search input */}
          <div className={`absolute lg:static top-[3.5rem] left-0 grow`}>
            <form onSubmit={handleSearch} className={`w-full h-fit relative`}>
              <input
                onChange={(e) => setSearchValue(e.target.value)}
                type="text"
                name="search"
                className={`w-screen lg:w-full shadow-lg lg:shadow-none lg:border lg:rounded lg:border-black focus:outline-none pl-3 pr-10 py-2 overflow-hidden ${isSearchOpen ? "border-t block" : " hidden lg:block"
                  }`}
                placeholder="Search"
                autoComplete="off"
                value={searchValue}
              />
              {/* Search icon */}
              <button type="submit" className={`cursor-pointer absolute right-[10px] top-1/2 -translate-y-1/2 lg:block ${!isSearchOpen && "hidden"}`}>
                <img className="text-gray-600" src={searchIcon} alt="Search Icon" />
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="flex items-center">
            <div className="hidden xl:flex">
              <ul className="menu menu-horizontal px-1 font-medium">
                <li><NavLink to="/courses">Courses</NavLink></li>
                <li><NavLink to="/instructors">Instructors</NavLink></li>
              </ul>
            </div>


            <div className="flex justify-center items-center gap-4">
              {/* Search icon for mobile */}
              <div
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`cursor-pointer lg:hidden ${isSearchOpen ? "text-blue-500" : "text-[#434343]"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="currentColor">
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
              </div>

              <div className="flex items-center gap-x-6">
                {/* wishlist */}
                {
                  user &&
                  <Link to='/wishlist' className="hidden lg:block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 hover:text-blue-700" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.75 3.5C5.127 3.5 3 5.76 3 8.547C3 14.125 12 20.5 12 20.5s9-6.375 9-11.953C21 5.094 18.873 3.5 16.25 3.5c-1.86 0-3.47 1.136-4.25 2.79c-.78-1.654-2.39-2.79-4.25-2.79"></path></svg>
                  </Link>
                }

                {/* cart */}
                <Link to='/cart'>
                  <div className="w-fit h-fit relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 hover:text-blue-700" viewBox="0 0 24 24"><path fill="currentColor" d="M17 18a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2M1 2h3.27l.94 2H20a1 1 0 0 1 1 1c0 .17-.05.34-.12.5l-3.58 6.47c-.34.61-1 1.03-1.75 1.03H8.1l-.9 1.63l-.03.12a.25.25 0 0 0 .25.25H19v2H7a2 2 0 0 1-2-2c0-.35.09-.68.24-.96l1.36-2.45L3 4H1zm6 16a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2c0-1.11.89-2 2-2m9-7l2.78-5H6.14l2.36 5z"></path></svg>
                    {
                      cartItemCount > 0 &&
                      <span className={`w-6 h-6 flex justify-center items-center rounded-full bg-pink-500 text-white ${cartItemCount > 99 ? 'text-xs' : 'text-sm'} font-medium absolute -top-3.5 -right-3`}>
                        {cartItemCount > 99 ? '99+' : cartItemCount}
                      </span>
                    }
                  </div>
                </Link>

                {/* notification */}
                {
                  user &&
                  <Link to='notification' className="hidden lg:block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 hover:text-blue-700" viewBox="0 0 24 24"><path fill="currentColor" d="M10 21h4c0 1.1-.9 2-2 2s-2-.9-2-2m11-2v1H3v-1l2-2v-6c0-3.1 2-5.8 5-6.7V4c0-1.1.9-2 2-2s2 .9 2 2v.3c3 .9 5 3.6 5 6.7v6zm-4-8c0-2.8-2.2-5-5-5s-5 2.2-5 5v7h10z"></path></svg>
                  </Link>
                }

                {/* Profile or Login */}
                {loading
                  ?
                  <span className="loading loading-ring loading-lg"></span>
                  :
                  user
                    ?
                    <Link to="/user/profile" className="hidden lg:block">
                      <img
                        src={user.photoURL || dummyImg}
                        className="w-9 sm:w-10 h-9 sm:h-10 rounded-full object-cover cursor-pointer shadow-lg shadow-gray-500"
                        referrerPolicy="no-referrer"
                        title={user.displayName || ""}
                        alt="User Profile"
                      />
                    </Link>
                    :
                    <div className="flex items-center gap-x-4 text-sm">
                      <Link to="/login" className="bg-white hover:bg-base-300 text-black border border-black rounded-none px-4 py-2 font-bold hidden sm:flex">
                        Log in
                      </Link>
                      <Link to="/signup" className="bg-black hover:bg-opacity-80 text-white border border-black rounded-none px-4 py-2 font-bold hidden sm:flex">
                        Sign up
                      </Link>
                    </div>
                }
              </div>
            </div>
          </nav>
        </div>
        {
          window.innerWidth < 1280 &&
          <>
            {/* Dropdown menu */}
            <ul
              onClick={handleDropdownItemClick}
              className={`menu flex-nowrap absolute top-full left-0 h-screen bg-stone-50 shadow-md z-[60] border-t overflow-hidden overflow-y-auto xl:hidden duration-[250ms]  w-[17.5rem] pb-20 transition-all ease-[cubic-bezier(0,0,0.38,0.9)] -translate-x-full ${isHamburgerOpen ? "translate-x-0" : ""}`}
            >
              <div className={`opacity-0 ease-linear duration-[250ms] delay-[250ms] ${isHamburgerOpen ? 'opacity-100' : ''} `}>
                {navbarMobileItem}
              </div>
            </ul>
            {/* Dark background overlay for dropdown */}
            {isHamburgerOpen &&
              <div
                onClick={() => setIsHamburgerOpen(false)}
                className={`w-screen h-screen bg-[rgba(0,0,0,0.5)] fixed top-full left-0 z-50 xl:hidden ${isHamburgerOpen ? 'overlay-fade-in' : ''}`}
              ></div>
            }
          </>
        }
      </div>
    </>
  );
};

export default Navbar;
