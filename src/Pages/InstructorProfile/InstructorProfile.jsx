import { useParams } from "react-router-dom";
import MoreCoursesByInstructor from "./MoreCoursesByInstructor";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";


const InstructorProfile = () => {
    const { instructorId } = useParams();
    const [axiosSecure] = useAxiosSecure();

    // Fetch instructor data
    const { data: instructorDetails = {}, isLoading, isError } = useQuery({
        queryKey: ['instructorDetails'],
        queryFn: async () => {
            const res = await axiosSecure.get(`http://localhost:5000/api/v1/instructor/details/${instructorId}`);
            return res.data;
        }
    });

    const { name, image, headline, bioData, expertise, experience, socialLinks, totalCoursesCount, totalReviewsCount, totalStudents } = instructorDetails;

    return (
        <>
            <section className="lg-container px-4 lg:px-6 md:flex justify-between items-start gap-x-20 lg:gap-x-44 xl:gap-x-60 pt-10">
                <section className="text-gray-700 space-y-6">
                    <article className="space-y-6">
                        <section className="space-y-2">
                            <p>Instructor</p>
                            <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                            <p>{headline}</p>
                            <div className="flex items-end gap-x-4 sm:gap-x-20">
                                <article>
                                    <p>Total Students</p>
                                    <p className="text-xl text-gray-900 font-bold ">{totalStudents}</p>
                                </article>

                                <article>
                                    <p>Total Courses</p>
                                    <p className="text-xl text-gray-900 font-bold ">{totalCoursesCount}</p>
                                </article>

                                <article>
                                    <p>Reviews</p>
                                    <p className="text-xl text-gray-900 font-bold ">{totalReviewsCount}</p>
                                </article>
                            </div>
                        </section>
                        <InstructorProfileAside
                            visibilityInfo={'block md:hidden'}
                            profileImage={image}
                            socialLinks={socialLinks}
                        />
                    </article>

                    <article className="space-y-2">
                        <header className="text-lg text-gray-900 font-bold">About {name}</header>
                        <p>
                            {bioData}
                        </p>
                    </article>

                    <article className="space-y-2">
                        <header className="text-lg text-gray-900 font-bold">Areas of Expertise</header>
                        <ul className="list-disc pl-6 ">
                            {
                                expertise?.map((txt, index) =>
                                    <li key={index}>
                                        {txt}
                                    </li>
                                )
                            }
                        </ul>
                    </article>

                    <article className="space-y-2">
                        <header className="text-lg text-gray-900 font-bold">Professional Experience</header>
                        <p>
                            {experience}
                        </p>
                    </article>
                </section>

                <InstructorProfileAside
                    visibilityInfo={'hidden md:block'}
                    profileImage={image}
                    socialLinks={socialLinks}
                />
            </section>

            <MoreCoursesByInstructor />
        </>
    );
};

const InstructorProfileAside = ({ visibilityInfo, profileImage, socialLinks }) => {
    return (
        <aside className={`flex flex-col justify-start items-center gap-x-14 space-y-4 md:space-y-6 ${visibilityInfo} `}>
            <figure className="w-40 h-40 md:w-[12.5rem] md:h-[12.5rem]">
                <img
                    className="w-full h-full rounded-full object-cover"
                    src={profileImage}
                    alt="instructor profile image" />
            </figure>
            <ul className="flex md:block md:space-y-2 flex-wrap justify-center items-center gap-4">
                {socialLinks &&
                    Object.entries(socialLinks).map(([key, value]) => (
                        <li key={key}>
                            <a
                                href={value}
                                className="block w-[12.5rem] py-2 bg-white border border-gray-900 rounded-md capitalize hover:shadow-lg active:scale-95 duration-300"
                            >
                                <span className="block capitalize w-fit mx-auto font-medium">
                                    {key}
                                </span>
                            </a>
                        </li>
                    ))
                }
            </ul>
        </aside>
    )
}

export default InstructorProfile;