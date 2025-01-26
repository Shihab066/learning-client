import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { Turn as Hamburger } from "hamburger-react";
import logo from "/logo.png";
import searchIcon from "../../assets/icon/search_icon.svg";
import dummyImg from "../../assets/icon/user_icon.png";
import { useQuery } from "@tanstack/react-query";
import { fetchCartItems } from "../../services/cartService";
import useUserRole from "../../hooks/useUserRole";
import generateImageLink from "../../utils/generateImageLink";
import SuspendedMessageBar from "../../components/SuspendedMessageBar/SuspendedMessageBar";
import useUserSuspensionStatus from "../../hooks/useUserSuspensionStatus";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import HeartIcon from "../../components/Icons/HeartIcon";
import CartIcon from "../../components/Icons/CartIcon";
import BellIcon from "../../components/Icons/BellIcon";
// import Hamburger from "./Hamburger/Hamburger";

// Custom hook to extract query parameters from URL
function usePathQuery() {
  return new URLSearchParams(useLocation().search);
}

const Navbar = () => {
  const { user, logOut, loading } = useAuth();
  const [axiosSecure] = useAxiosSecure();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Retrieve user role
  const [userRole] = useUserRole();
  const isAdmin = userRole === "admin";
  const isStudent = userRole === "student";
  const isInstructor = userRole === "instructor";

  // Retrieve user suspension status
  const { isUserSuspended } = useUserSuspensionStatus();

  // Handle logout and redirect to home
  const signOut = () => {
    logOut();
    navigate("/");
  };

  const navbarMobileItem = (
    <>
      <li><NavLink to="/courses">Courses</NavLink></li>
      <li><NavLink to="/instructors">Instructors</NavLink></li>
      {
        user &&
        <>
          <hr className="mb-2" />
          <li><NavLink to="/wishlist">Wishlist</NavLink></li>
          <li><NavLink to="/notification">Notifications</NavLink></li>
          <li><NavLink to="/user/profile">Manage Account</NavLink></li>
        </>
      }
      <hr className="mb-3" />
      {user
        ?
        <li>
          <div onClick={signOut} className="flex items-center gap-x-1 bg-black text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M12.232 3.25H9.768c-.813 0-1.469 0-2 .043c-.546.045-1.026.14-1.47.366a3.75 3.75 0 0 0-1.64 1.639c-.226.444-.32.924-.365 1.47c-.043.531-.043 1.187-.043 2v6.464c0 .813 0 1.469.043 2c.045.546.14 1.026.366 1.47a3.75 3.75 0 0 0 1.639 1.64c.444.226.924.32 1.47.365c.531.043 1.187.043 2 .043h2.464c.813 0 1.469 0 2-.043c.546-.045 1.026-.14 1.47-.366a3.75 3.75 0 0 0 1.64-1.639c.226-.444.32-.924.365-1.47c.043-.531.043-1.187.043-2V15a.75.75 0 0 0-1.5 0v.2c0 .852 0 1.447-.038 1.91c-.038.453-.107.714-.207.912c-.216.423-.56.767-.983.983c-.198.1-.459.17-.913.207c-.462.037-1.056.038-1.909.038H9.8c-.852 0-1.447 0-1.91-.038c-.453-.038-.714-.107-.911-.207a2.25 2.25 0 0 1-.984-.983c-.1-.198-.17-.459-.207-.913c-.037-.462-.038-1.057-.038-1.909V8.8c0-.852 0-1.447.038-1.91c.037-.453.107-.714.207-.911a2.25 2.25 0 0 1 .984-.984c.197-.1.458-.17.912-.207c.462-.037 1.057-.038 1.909-.038h2.4c.853 0 1.447 0 1.91.038c.453.037.714.107.912.207c.423.216.767.56.983.984c.1.197.17.458.207.912c.037.462.038 1.057.038 1.909V9a.75.75 0 0 0 1.5 0v-.232c0-.813 0-1.469-.043-2c-.045-.546-.14-1.026-.366-1.47a3.75 3.75 0 0 0-1.639-1.64c-.444-.226-.924-.32-1.47-.365c-.531-.043-1.187-.043-2-.043"></path><path fill="currentColor" d="M12.47 8.47a.75.75 0 1 1 1.06 1.06l-1.72 1.72H20a.75.75 0 0 1 0 1.5h-8.19l1.72 1.72a.75.75 0 1 1-1.06 1.06l-3-3a.75.75 0 0 1 0-1.06z"></path></svg>
            <span>
              Logout
            </span>
          </div>
        </li>
        :
        <>
          <li className="bg-black text-white">
            <Link to="/login">
              Login
            </Link>
          </li>

          <li className="bg-black text-white mt-2">
            <Link to="/signup">
              Sign up
            </Link>
          </li>
        </>
      }
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
    queryKey: ['cartCount', user, userRole],
    enabled: user !== null && isStudent,
    queryFn: async () => {
      const cartItems = await fetchCartItems(axiosSecure, user?.uid);
      return cartItems.filter(item => item.savedForLater === false).length;
    }
  });

  return (
    <>
      <Helmet>
        {/* Add theme change logic here if needed */}
      </Helmet>
      <>
        {
          isUserSuspended &&
          <SuspendedMessageBar />
        }
        <div className={`bg-white z-50 sticky top-0 w-full drop-shadow ${stickyNav ? "fade-in" : "fade-out"} relative h-fit`}>
          <div className="lg-container flex items-center justify-between gap-x-4 pr-3  lg:pl-4 sm:pr-3 md:pr-4 py-1 sm:py-1 lg:py-2.5">
            <div className="flex items-center z-20">
              {/* Hamburger icon */}
              <div onClick={() => setIsHamburgerOpen(!isHamburgerOpen)} className="lg:hidden h-12 flex items-center">
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
                <img src={logo} className="w-8 lg:w-10" alt="Learning Point Logo" />
                <a className="text-gray-900 tracking-wide normal-case text-lg lg:text-xl xl:text-2xl font-bold">
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
              <div className="hidden lg:flex">
                <ul className="menu menu-horizontal px-1 font-medium">
                  <li><NavLink to="/courses">Courses</NavLink></li>
                  <li><NavLink to="/instructors">Instructors</NavLink></li>
                  {
                    isStudent &&
                    <li><NavLink to="/my-classes">My Classes</NavLink></li>
                  }
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

                {
                  user &&
                  <div className="flex items-center gap-x-6">
                    {
                      isStudent &&
                      <>
                        {/* wishlist */}
                        <Link to='/wishlist' className="hidden lg:block hover:text-blue-700">
                          <HeartIcon />
                        </Link>

                        {/* cart */}
                        <Link to='/cart'>
                          <div className="w-fit h-fit relative mr-1 lg:mr-0 hover:text-blue-700">
                            <CartIcon />
                            {
                              cartItemCount > 0 &&
                              <div className={`w-[1.4rem] h-5 flex justify-center items-center rounded-full bg-pink-500 text-white ${cartItemCount > 99 ? 'text-xs' : 'text-xs'} font-medium absolute -top-2.5 -right-2.5`}>
                                {cartItemCount > 99 ? '99+' : cartItemCount}
                              </div>
                            }
                          </div>
                        </Link>
                      </>
                    }

                    {/* notification */}
                    <Link to='notification' className="hidden lg:block hover:text-blue-700">
                      <BellIcon />
                    </Link>
                  </div>
                }

                {/* Profile or Login */}
                <div className="hidden lg:block">
                  {loading
                    ?
                    <span className="loading loading-ring loading-lg"></span>
                    :
                    user
                      ?
                      <ul className="group relative">
                        <li className="hidden lg:block">
                          <img
                            src={user.photoURL ? generateImageLink({ imageId: user.photoURL, height: 40, aspectRatio: 1.0, cropMode: 'fill' }) : dummyImg}
                            className="w-9 sm:w-10 h-9 sm:h-10 rounded-full object-cover cursor-pointer shadow-lg shadow-gray-500"
                            referrerPolicy="no-referrer"
                            alt="User Profile"
                          />
                        </li>

                        {/* Child div that shows on hover and is interactive */}
                        <ul className="border-t absolute mt-4 top-full -right-4 w-52 h-fit space-y-1 p-2 bg-white opacity-0 invisible group-hover:opacity-100 group-hover:visible duration-300 z-[9999] pointer-events-auto">
                          <li className="p-1 rounded text-center hover:bg-black hover:text-white duration-300">
                            <button onClick={() => navigate(`/user/${isAdmin ? 'dashboard' : isInstructor ? 'instructor_dashboard' : isStudent ? 'profile' : ''}`)}>
                              Manage account
                            </button>
                          </li>
                          <hr />
                          <li className="p-1 rounded text-center hover:bg-black hover:text-white duration-300">
                            <button onClick={signOut}>
                              Logout
                            </button>
                          </li>
                        </ul>
                      </ul>
                      :
                      <div className="items-center gap-x-4 text-sm hidden sm:flex">
                        <Link to="/login" className="bg-white hover:bg-base-300 text-black border border-black rounded-none px-4 py-2 font-bold">
                          Log in
                        </Link>
                        <Link to="/signup" className="bg-black hover:bg-opacity-80 text-white border border-black rounded-none px-4 py-2 font-bold">
                          Sign up
                        </Link>
                      </div>
                  }
                </div>
              </div>
            </nav>
          </div>
          {
            window.innerWidth < 1024 &&
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
              {
                isHamburgerOpen &&
                <div
                  onClick={() => setIsHamburgerOpen(false)}
                  className={`w-screen h-screen bg-[rgba(0,0,0,0.5)] fixed top-full left-0 z-50 xl:hidden ${isHamburgerOpen ? 'overlay-fade-in' : ''}`}
                ></div>
              }
            </>
          }
        </div>
      </>
    </>
  );
};

export default Navbar;
