import PopularCoursesSkeleton from "./PopularCoursesSkeleton/PopularCoursesSkeleton";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import GenerateDynamicStar from "../../../components/GenerateDynamicStar/GenerateDynamicStar";
import formatNumberWithCommas from "../../../utils/formateNumberWithCommas";
import genarateImageLink from "../../../utils/genarateImageLink";

const PopularCourses = ({isMobileView}) => {
    // Fetch popular courses
    const { data: courses = [], isLoading } = useQuery({
        queryKey: ['popularCourses'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/api/v1/course/top');
            return res.data;
        },
    });

    return (
        <div className="lg-container">
            {/* Heading */}
            <h2 className="mb-10 text-center font-semibold xs:mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-32 xs:text-xl md:text-2xl lg:text-3xl">
                Popular Courses
            </h2>

            {/* Grid layout for class cards or skeleton loader */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center gap-y-6 sm:gap-y-6 xl:gap-y-10 px-3 xl:px-4 2xl:px-0 gap-x-4 md:gap-x-6">
                {isLoading
                    ?
                    <PopularCoursesSkeleton isMobileView={isMobileView} />
                    :
                    courses?.length > 0
                        ?
                        courses?.map(item => (
                            <PopularCourseCard
                                key={item._id}
                                item={item}
                            />
                        ))
                        :
                        <div className=" h-fit flex items-center justify-center col-span-full">
                            <p className="text-gray-400 text-lg font-medium">No Course Found</p>
                        </div>
                }
            </div>
        </div>
    );
};

// Courses Card Component
const PopularCourseCard = ({ item }) => {
    const { _id, instructorName, courseName, courseThumbnail, rating, totalReviews } = item;
    const modifiedCourseName = courseName?.length > 50 ? courseName.slice(0, 50) + '...' : courseName;
    const formatedTotalReviews = formatNumberWithCommas(totalReviews);
    return (
        <div className="w-full h-fit bg-white rounded-2xl border border-[#E2E8F0] text-gray-700 mx-1 sm:mx-0 xl:hover:shadow-md duration-300">
            <Link to={`/course/${_id}`}>
                <img
                    className="w-full h-48 object-cover object-top rounded-t-lg"
                    src={genarateImageLink({imageId: courseThumbnail})}
                    alt="course thumbnail"
                />
                <div className='p-3 lg:p-4 space-y-2'>
                    <h3 className="h-12 lg:h-14 lg:text-lg font-medium" title={courseName}>
                        {modifiedCourseName}
                    </h3>
                    <p className="truncate">
                        By {instructorName}
                    </p>
                    <div className="flex items-center gap-x-2">
                        {rating > 0 && <p className="text-gray-700 font-medium">{rating}</p>}
                        <GenerateDynamicStar rating={rating} />
                        <span>
                            ({formatedTotalReviews} Ratings)
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default PopularCourses;
