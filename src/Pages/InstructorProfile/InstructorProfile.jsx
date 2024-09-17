import MoreCoursesByInstructor from "./MoreCoursesByInstructor";


const InstructorProfile = () => {
    return (
        <>
            <section className="lg-container px-4 lg:px-6 md:flex justify-between items-start gap-x-20 lg:gap-x-44 xl:gap-x-60 pt-10">
                <section className="text-gray-700 space-y-6">
                    <article className="space-y-6">
                        <section className="space-y-2">
                            <p>Instructor</p>
                            <h2 className="text-2xl font-bold text-gray-900">Ronald Richards</h2>
                            <p>Web developer, UX/UI Designer, and Teacher</p>
                            <div className="flex items-center gap-x-20">
                                <article>
                                    <p>Total Students</p>
                                    <p className="text-xl text-gray-900 font-bold ">1000</p>
                                </article>

                                <article>
                                    <p>Reviews</p>
                                    <p className="text-xl text-gray-900 font-bold ">154</p>
                                </article>
                            </div>
                        </section>
                        <InstructorProfileAside visibilityInfo={'block md:hidden'} />
                    </article>

                    <article className="space-y-2">
                        <header className="text-lg text-gray-900 font-bold">About Ronald Richard</header>
                        <p>
                            Ronald Richard is a highly skilled UX/UI Designer with over a decade of experience in crafting user-centric digital solutions. With a background in graphic design and a keen eye for detail, Ronald specializes in creating intuitive interfaces that delight users and drive business results.
                        </p>
                    </article>

                    <article className="space-y-2">
                        <header className="text-lg text-gray-900 font-bold">Areas of Expertise</header>
                        <ul className="list-disc pl-6 ">
                            <li>User Experience (UX) Design</li>
                            <li>User Interface (UI) Design</li>
                            <li>Information Architecture</li>
                            <li>Interaction Design</li>
                            <li>Visual Design</li>
                            <li>Usability Testing</li>
                            <li>Wireframing and Prototyping </li>
                            <li>Design Thinking</li>
                        </ul>
                    </article>

                    <article className="space-y-2">
                        <header className="text-lg text-gray-900 font-bold">Professional Experience</header>
                        <p>
                            Ronald Richard has an extensive professional background in UX/UI design, having worked with renowned companies such as [Company Name] and [Company Name]. His portfolio includes a diverse range of projects spanning web applications, mobile apps, and e-commerce platforms.
                        </p>
                    </article>
                </section>

                <InstructorProfileAside visibilityInfo={'hidden md:block'} />
            </section>

            <MoreCoursesByInstructor />
        </>
    );
};

const InstructorProfileAside = ({ visibilityInfo }) => {
    return (
        <aside className={`flex flex-col sm:flex-row md:flex-col justify-start items-center gap-x-14 space-y-4 sm:space-y-0 md:space-y-6 ${visibilityInfo} `}>
            <img
                className="w-40 h-40 md:w-[12.5rem] md:h-[12.5rem] rounded-full object-cover"
                src="https://i.ibb.co.com/JmPSDz7/instructor-Profile1.jpg"
                alt="instructor profile image" />
            <ul className="space-y-2">
                <li>
                    <a
                        href="#"
                        className="block w-[12.5rem] py-2 bg-white border border-gray-900 rounded-md capitalize hover:shadow-lg active:scale-95 duration-300 "
                    >
                        <span className="block w-fit mx-auto font-medium">
                            Website
                        </span>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="block w-[12.5rem] py-2 bg-white border border-gray-900 rounded-md capitalize hover:shadow-lg active:scale-95 duration-300 "
                    >
                        <span className="block w-fit mx-auto font-medium">
                            Twitter
                        </span>
                    </a>
                </li>
                <li>
                    <a
                        href="#"
                        className="block w-[12.5rem] py-2 bg-white border border-gray-900 rounded-md capitalize hover:shadow-lg active:scale-95 duration-300 "
                    >
                        <span className="block w-fit mx-auto font-medium">
                            Youtube
                        </span>
                    </a>
                </li>
            </ul>
        </aside>
    )
}

export default InstructorProfile;