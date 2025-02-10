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
    const adminLinks = [
        { text: 'Dashboard', url: 'dashboard' },
        { text: 'Manage Course', url: 'manage-course' },
        { text: 'Manage User', url: 'manage-user' },
        { text: 'Banner Management', url: 'banner-management' },
        { text: 'Suspension Control', url: 'manage-suspension' },
        { text: 'Setting', url: 'profile' }
    ];

    const instructorLinks = [
        { text: 'Dashboard', url: 'instructor_dashboard' },
        { text: 'My Courses', url: 'myCourses' },
        { text: 'Add Course', url: 'addCourse' },
        { text: 'Reviews', url: 'courseReviews' },
        { text: 'Profile', url: 'profile' },
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
                // navigate('/user/profile');
                break
            case 'instructor':
                setLinks(instructorLinks);
                // navigate('/user/profile');
                break;
            case 'admin':
                setLinks(adminLinks);
                // navigate('/user/dashboard')
                break;
        }
    }, [userRole]);

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
            {/* aside menu */}
            <div className={`hidden xl:block w-fit h-full absolute xl:sticky xl:${stickyNav ? 'top-0 xl:top-24' : 'top-0 xl:top-4'} left-0 duration-300`}>
                <aside className={`w-[18rem] h-fit text-gray-700 bg-[#F8FAFC] overflow-x-hidden overflow-y-auto pb-[4.1rem] lg:pb-0 pt-6 xl:rounded-xl z-10`}>
                    <article className="flex flex-col justify-center items-center gap-y-2 pb-6 relative min-w-[280px] xl:min-w-full">
                        <img
                            className="w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover bg-white"
                            src={user?.photoURL ? generateImageLink({ imageId: user.photoURL, height: 160, aspectRatio: 1.0, cropMode: 'fill' }) : dummyProfile}
                            alt="profile image" />
                        <h2 className="text-gray-900 text-xl font-medium">
                            {user?.displayName}
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

            <main className="w-full h-fit overflow-hidden pt-6 xl:pt-0">
                <Outlet />
            </main>
        </div>
    );
};

export default ProfileLayout;