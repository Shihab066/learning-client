import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import shareIcon from '../assets/icon/shareicon.svg';
import rightArrow from '../assets/icon/right-arrow.png';
import leftArrow from '../assets/icon/left-arrow.png';
import closeIcon from '../assets/icon/close.png';


const ProfileLayout = () => {
    // link to navigate different section of this page
    const links = [
        { text: 'Profile', url: 'profile' },
        { text: 'My Courses', url: '#instructor' },
        { text: 'Add Course', url: '#course_outline' },
        { text: 'Reviews', url: '#reviews' }
    ];

    // State to manage active link
    const [activeLink, setActiveLink] = useState(0);

    // state to manage the aside section in mobile device
    const [isAsideOpen, setIsAsideOpen] = useState(false);

    const handleAside = () => {
        setIsAsideOpen(!isAsideOpen);
    }

    return (
        <div className="lg-container h-fit px-4 xl:px-6 xl:flex gap-x-6 xl:gap-x-10 pt-24 sm:pt-32 xl:pt-10 relative">
            <div className="w-fit h-full absolute xl:static top-0 left-0">
                <div className="relative w-full h-full">
                    {/* aside open icon */}
                    <button onClick={handleAside} className="w-10 h-10 sticky top-16 sm:top-[4.4rem] lg:top-[4.7rem] ml-3.5 xl:hidden animate text-white z-10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M15.5 11.3L9.9 5.6c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4l4.9 4.9l-4.9 4.9c-.2.2-.3.4-.3.7c0 .6.4 1 1 1c.3 0 .5-.1.7-.3l5.7-5.7c.3-.2.3-.8-.1-1.2"></path>
                        </svg>
                    </button>
                </div>
                <aside className={`fixed duration-300 top-14 sm:top-16 lg:top-[4.5rem] left-0 ${isAsideOpen ? 'w-[280px]' : 'w-0'} h-screen xl:static xl:w-[20rem] xl:h-fit text-gray-700 bg-[#F8FAFC] pt-6 overflow-hidden xl:rounded-xl z-10`}>
                    <article className="flex flex-col justify-center items-center gap-y-2 pb-6 relative min-w-[280px] xl:min-w-full">
                        <img
                            className="w-40 h-40 rounded-full object-cover"
                            src="https://i.ibb.co.com/JmPSDz7/instructor-Profile1.jpg"
                            alt="profile image" />
                        <h2 className="text-gray-900 text-xl font-medium">
                            John Doe
                        </h2>
                        <button className="btn btn-md bg-white hover:bg-white capitalize px-6">
                            Share Profile
                            <img
                                className="w-4"
                                src={shareIcon}
                                alt="share icon" />
                        </button>

                        {/* icon for close */}
                        <button onClick={handleAside} className="absolute -top-5 right-1 w-10 h-10 flex justify-center items-center xl:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </article>

                    {/* nav */}
                    <ul className="min-w-[280px]">
                        {
                            links.map((link, index) =>
                                <li key={index}>
                                    <Link
                                        to={link.url}
                                        onClick={() => setActiveLink(index)}
                                        className={`block w-full py-3 px-3 border-t duration-300 ${activeLink === index ? 'bg-gray-900 text-white' : 'hover:bg-[#0000001a]'}`}>
                                        {link.text}
                                    </Link>
                                </li>
                            )
                        }

                    </ul>
                </aside>
            </div>

            <main className="w-full h-fit ">
                <Outlet />
            </main>
        </div>
    );
};

export default ProfileLayout;