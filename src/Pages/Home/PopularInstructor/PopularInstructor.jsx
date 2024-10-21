import axios from "axios";
import PopularInstructorSkeleton from "./PopularInstructorsSkeleton.jsx/PopularInstructorSkeleton";
import { useQuery } from "@tanstack/react-query";
import GenerateStar from "../../../components/GenerateStar/GenerateStar";
import { useState } from "react";
import { Link } from "react-router-dom";
import PopularInstructorMobileSkeleton from "./PopularInstructorsSkeleton.jsx/PopularInstructorMobileSkeleton";

const PopularInstructor = ({ isMobileView }) => {

    // Fetch popular instructor data
    const { data: instructors = [], isLoading } = useQuery({
        queryKey: ['popularInstructor'],
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/api/v1/instructor/popular`);
            return res.data;
        },
    });

    return (
        <div className="lg-container">
            <h2 className="text-center font-semibold mt-16 lg:mt-20 xl:mt-32 mb-12 xs:text-xl md:text-2xl lg:text-3xl">
                Popular Instructors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 xl:gap-y-4 gap-x-6 px-3 xl:px-4 2xl:px-0">
                {isLoading
                    ?
                    isMobileView
                        ?
                        <PopularInstructorMobileSkeleton />
                        :
                        <PopularInstructorSkeleton />
                    :
                    instructors.length > 0
                        ?
                        instructors?.map((instructor) => (
                            isMobileView
                                ?
                                <PopularInstructorMobileCard
                                    key={instructor._id}
                                    instructorInfo={instructor}
                                />
                                :
                                <PopularInstructorCard
                                    key={instructor._id}
                                    instructorInfo={instructor}
                                />
                        ))
                        :
                        <div className=" h-fit flex items-center justify-center col-span-full">
                            <p className="text-gray-400 text-lg font-medium">No Instructor Found</p>
                        </div>
                }
            </div>
        </div>
    );
};

const PopularInstructorCard = ({ instructorInfo }) => {
    const { _id, name, image, headline, rating } = instructorInfo;
    const [isCardHover, setIsCardHover] = useState(false);

    // Handle hover state for card
    const handleMouseEnter = () => setIsCardHover(true);
    const handleMouseLeave = () => setIsCardHover(false);

    return (
        <Link to={`/instructor/${_id}`} className={`${isCardHover ? 'mb-0' : 'mb-32'}`}>
            <div
                className={`w-full rounded-lg overflow-hidden duration-300 ease-linear ${isCardHover ? 'h-80 border shadow-md' : 'h-fit border-none'}`}
                onMouseLeave={handleMouseLeave}
            >
                {/* Instructor Image */}
                <figure className="w-full">
                    <img
                        src={image}
                        alt="instructor"
                        className={`object-cover object-top mx-auto h-48 duration-100 ease-in ${isCardHover ? 'w-full rounded-none' : 'w-48 rounded-full'}`}
                        onMouseOver={handleMouseEnter}
                    />
                </figure>

                {/* Instructor Details - Visible on Hover */}
                <article className={`p-4 space-y-1 duration-300 ease-linear ${isCardHover ? 'block' : 'hidden'}`}>
                    {/* Instructor Name */}
                    <h2 className="text-gray-700 font-medium truncate">
                        {name}
                    </h2>

                    {/* Instructor Headline */}
                    <p className="truncate">{headline}</p>

                    {/* Instructor Rating */}
                    <p className="flex items-center gap-2 font-medium">
                        {rating}
                        <GenerateStar fill={'#FEC84B'} />
                    </p>
                </article>
            </div>
        </Link>
    );
};

const PopularInstructorMobileCard = ({ instructorInfo }) => {
    const { _id, name, image, headline, rating } = instructorInfo;

    return (
        <Link to={`/instructor/${_id}`}>
            <div
                className={`w-full h-[19rem] rounded-lg overflow-hidden duration-300 ease-linear border hover:shadow-md`}
            >
                {/* Instructor Image */}
                <figure className="w-full">
                    <img
                        src={image}
                        alt="instructor"
                        className={`w-full h-48 object-cover object-top mx-auto`}
                    />
                </figure>

                {/* Instructor Details - Visible on Hover */}
                <article className={`p-4 space-y-1 duration-300 ease-linear`}>
                    {/* Instructor Name */}
                    <h2 className="text-gray-700 font-medium truncate">
                        {name}
                    </h2>

                    {/* Instructor Headline */}
                    <p className="truncate">{headline}</p>

                    {/* Instructor Rating */}
                    <p className="flex items-center gap-2 font-medium">
                        {rating}
                        <GenerateStar fill={'#FEC84B'} />
                    </p>
                </article>
            </div>
        </Link>
    );
};


export default PopularInstructor;
