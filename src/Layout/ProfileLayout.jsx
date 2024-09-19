import { useState } from "react";
import { Link, Outlet } from "react-router-dom";


const ProfileLayout = () => {
    // link to navigate different section of this page
    const links = [
        { text: 'Profile', url: '#description' },
        { text: 'My Courses', url: '#instructor' },
        { text: 'Add Course', url: '#course_outline' },
        { text: 'Reviews', url: '#reviews' }
    ];

    // State to manage active link
    const [activeLink, setActiveLink] = useState(0);

    return (
        <div className="lg-container px-6 flex gap-x-10 pt-10">
            <aside className="w-[18rem] h-fit text-gray-700 bg-[#F8FAFC] pt-6 overflow-hidden rounded-xl basis-[25%]">
                <article className="flex flex-col justify-center items-center gap-y-2 pb-6">
                    <img
                        className="w-40 h-40 rounded-full object-cover"
                        src="https://i.ibb.co.com/JmPSDz7/instructor-Profile1.jpg"
                        alt="profile image" />
                    <h2 className="text-gray-900 text-xl font-medium">
                        John Doe
                    </h2>
                    <button className="btn btn-md bg-white hover:bg-white capitalize px-6">
                        Share Profile
                    </button>
                </article>

                {/* nav */}
                <ul>
                    {/* <li>
                        <Link className={`block w-full py-2 px-2 border-b font-medium`}>
                            Profile
                        </Link>
                    </li> */}
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

            <main className="w-full h-fit">
                <Outlet />
            </main>
        </div>
    );
};

export default ProfileLayout;