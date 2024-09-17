import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import {Turn as Hamburger} from "hamburger-react";

import logo from "/logo.png";
import searchIcon from "../../assets/icon/search_icon.svg";
import dummyImg from "../../assets/icon/user_icon.png";

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
  const [userRole] = useUserRole();
  const isAdmin = userRole === "admin";
  const isStudent = userRole === "student";
  const isInstructor = userRole === "instructor";

  // Handle logout and redirect to home
  const signOut = () => {
    logOut();
    navigate("/");
  };

  // Dynamic navigation links based on user role
  const navbarItem = (
    <>
      <li><NavLink to="/">Home</NavLink></li>
      <li><NavLink to="/courses">Courses</NavLink></li>
      <li><NavLink to="/instructors">Instructors</NavLink></li>
      {user && (
        <li>
          <NavLink
            to={`/dashboard/${isStudent ? "selectedClass" : isInstructor ? "myClass" : isAdmin ? "manageClass" : ""}`}
          >
            Dashboard
          </NavLink>
        </li>
      )}
      {user ? (
        <li className="xl:hidden">
          <div onClick={logOut} className="btn btn-sm bg-blue-600 hover:bg-blue-700 text-white normal-case w-fit ml-2">
            Logout
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
  );

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
    document.body.style.overflowY = isHamburgerOpen ? "hidden" : "auto";
  }, [isHamburgerOpen]);

  // Close hamburger menu on dropdown item click
  const handleDropdownItemClick = (event) => {
    if (event.target.closest("li")) {
      setIsHamburgerOpen(false);
    }
  };

  return (
    <>
      <Helmet>
        {/* Add theme change logic here if needed */}
      </Helmet>
      <nav className={`bg-white z-50 sticky drop-shadow ${stickyNav ? "fade-in" : "fade-out"}`}>
        <div className="lg-container flex justify-between pr-2 sm:pl-1 xl:pl-4 sm:pr-3 md:pr-4 py-1 sm:py-2 lg:py-3">
          <div className="flex items-center z-20">
            {/* Hamburger icon */}
            <div className="md:pr-1 xl:hidden">
              <Hamburger
                rounded
                size={window.innerWidth >= 576 ? 25 : 20}
                direction="right"
                toggled={isHamburgerOpen}
                toggle={setIsHamburgerOpen}
              />
            </div>

            {/* Dropdown menu */}
            <ul
              onClick={handleDropdownItemClick}
              className={`menu absolute top-[3.5rem] sm:top-[4rem] lg:top-[4.5rem] left-0 h-screen bg-stone-50 shadow-md z-50 border-t transition-all overflow-hidden xl:hidden ${
                isHamburgerOpen ? "w-[17.5rem] duration-[400ms]" : "w-0 px-0 duration-300"
              }`}
            >
              {navbarItem}
            </ul>

            {/* Dark background overlay for dropdown */}
            <div
              onClick={() => setIsHamburgerOpen(false)}
              className={`w-screen h-screen bg-[rgba(0,0,0,0.5)] absolute top-[3.5rem] sm:top-[4rem] lg:top-[4.5rem] left-0 z-40 xl:hidden ${
                !isHamburgerOpen && "hidden"
              }`}
            ></div>

            {/* Site Logo */}
            <div onClick={() => navigate('/')} className="flex gap-x-1 items-center cursor-pointer">
              <img src={logo} className="w-8 sm:w-10" alt="Learning Point Logo" />
              <a className="text-gray-900 tracking-wide normal-case text-lg sm:text-2xl font-bold">
                Learning Point
              </a>
            </div>

            {/* Search input */}
            <div className="absolute xl:static top-[3.5rem] sm:top-[4rem] lg:top-[4.5rem] left-0">
              <form onSubmit={handleSearch} className="xl:ml-8 w-fit h-fit relative">
                <input
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="text"
                  name="search"
                  className={`w-screen xl:w-[450px] shadow-lg xl:shadow-none xl:border-2 xl:rounded-md xl:border-blue-400 focus:outline-none pl-3 pr-10 xl:py-2 overflow-hidden ${
                    isSearchOpen ? "py-2 border-t transition-all" : "h-0 xl:h-fit py-0"
                  }`}
                  placeholder="Search"
                  autoComplete="off"
                  value={searchValue}
                />
                {/* Search icon */}
                <button type="submit" className={`cursor-pointer absolute right-[10px] top-1/2 -translate-y-1/2 xl:block ${!isSearchOpen && "hidden"}`}>
                  <img className="text-gray-600" src={searchIcon} alt="Search Icon" />
                </button>
              </form>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center">
            <div className="hidden xl:flex">
              <ul className="menu menu-horizontal px-1 font-medium">{navbarItem}</ul>
            </div>

            {/* Profile / Login Buttons */}
            <div className="flex justify-center items-center gap-1 sm:gap-2">
              {/* Search icon for mobile */}
              <div
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`cursor-pointer xl:hidden ${isSearchOpen ? "text-blue-500" : "text-[#434343]"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="currentColor">
                  <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
              </div>

              {/* Profile or Login */}
              {loading ? (
                <span className="loading loading-ring loading-lg"></span>
              ) : user ? (
                <div className="flex items-center gap-2">
                  <Link to="/profile">
                    <img
                      src={user.photoURL || dummyImg}
                      className="w-9 sm:w-10 h-9 sm:h-10 rounded-full object-cover cursor-pointer shadow-lg shadow-gray-500"
                      referrerPolicy="no-referrer"
                      title={user.displayName || ""}
                      alt="User Profile"
                    />
                  </Link>
                  <div onClick={signOut} className="btn bg-blue-600 hover:bg-blue-700 text-white normal-case hidden xl:flex">
                    Logout
                  </div>
                </div>
              ) : (
                <Link to="/login">
                  <div className="btn btn-md bg-blue-600 hover:bg-blue-700 text-white normal-case hidden sm:flex">Login</div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
