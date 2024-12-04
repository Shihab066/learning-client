import { useEffect, useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import shareIcon from '../assets/icon/shareicon.svg';
import useAuth from "../hooks/useAuth";
import dummyProfile from '../assets/icon/user_icon.png';
import useUserRole from "../hooks/useUserRole";
import generateImageLink from "../utils/generateImageLink";

const ProfileLayout = () => {
    const { user } = useAuth();
    const [userRole] = useUserRole();
    const [links, setLinks] = useState([]);

    // link to navigate different section
    const instructorLinks = [
        { text: 'Profile', url: 'profile' },
        { text: 'My Courses', url: 'myCourses' },
        { text: 'Add Course', url: 'addCourse' },
        { text: 'Reviews', url: 'courseReviews' }
    ];

    const studentLinks = [
        { text: 'Profile', url: 'profile' },        
        { text: 'My Reviews', url: 'my-reviews' },
        { text: 'Purchase History', url: 'purchase-history' },
        { text: 'Feedback', url: 'feedback' }
    ];

    // run effect to update Links by userRole
    useEffect(() => {
        switch (userRole) {
            case 'student':
                setLinks(studentLinks);
                break
            case 'instructor':
                setLinks(instructorLinks);
                break;
        }
    }, [userRole]);

    // state to manage the aside section in mobile device
    const [isAsideOpen, setIsAsideOpen] = useState(false);

    const handleAside = () => {
        setIsAsideOpen(!isAsideOpen);
    }

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

    return (
        <div className="lg-container h-fit px-4 xl:px-6 xl:flex gap-x-6 xl:gap-x-10 xl:pt-10 relative">
            <div className={`w-fit h-full absolute xl:sticky xl:${stickyNav ? 'top-0 xl:top-24' : 'top-0 xl:top-4'} left-0 duration-300`}>
                <div className="relative w-full h-full">
                    {/* aside open icon */}
                    <button onClick={handleAside} className="w-10 h-10 sticky top-16 sm:top-[4.4rem] lg:top-[4.7rem] ml-3.5 xl:hidden animate text-white z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M15.5 11.3L9.9 5.6c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l4.9 4.9l-4.9 4.9c-.2.2-.3.4-.3.7c0 .6.4 1 1 1c.3 0 .5-.1.7-.3l5.7-5.7c.3-.2.3-.8-.1-1.2"></path>
                        </svg>
                    </button>
                </div>
                <aside className={`fixed duration-300 top-14 sm:top-16 lg:top-[4.5rem] left-0 ${isAsideOpen ? 'w-[17.5rem]' : 'w-0'} h-screen xl:static xl:w-[18rem] xl:h-fit text-gray-700 bg-[#F8FAFC] overflow-x-hidden overflow-y-auto pb-[4.1rem] lg:pb-0 pt-6 xl:rounded-xl z-10`}>
                    <article className="flex flex-col justify-center items-center gap-y-2 pb-6 relative min-w-[280px] xl:min-w-full">
                        <img
                            className="w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover"
                            src={user?.photoURL ? generateImageLink({ imageId: user.photoURL, height: 160, aspectRatio: 1.0, cropMode: 'fill' }) : dummyProfile}
                            alt="profile image" />
                        <h2 className="text-gray-900 text-xl font-medium">
                            John Doe
                        </h2>
                        {
                            userRole === 'instructor' &&
                            <Link to={'/instructorProfile'} className="btn btn-md bg-white hover:bg-white capitalize px-6">
                                Share Profile
                                <img
                                    className="w-4"
                                    src={shareIcon}
                                    alt="share icon" />
                            </Link>
                        }

                        {/* icon for close */}
                        <button onClick={handleAside} className="absolute -top-5 right-1 w-10 h-10 flex justify-center items-center xl:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </article>

                    {/* nav */}
                    <ul className="min-w-[17.5rem] profile">
                        {
                            links.map((link, index) =>
                                <li key={index}>
                                    <NavLink
                                        to={link.url}
                                        className={`block w-full py-3 px-3 border-t duration-300 hover:bg-[#0000001a]`}
                                    >
                                        {link.text}
                                    </NavLink>
                                </li>
                            )
                        }

                    </ul>
                </aside>
            </div>

            <main className="w-full h-fit overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
};

export default ProfileLayout;