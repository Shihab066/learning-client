import PopularClassSkeleton from "../../../components/PopularClassSkeleton/PopularClassSkeleton";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import GenerateDynamicStar from "../../../components/GenerateDynamicStar/GenerateDynamicStar";
import formatNumberWithCommas from "../../../utils/formateNumberWithCommas";

const PopularClasses = () => {
    // Fetch popular courses
    const { data: courses = [], isLoading } = useQuery({
        queryKey: ['popularCourses'],
        queryFn: async () => {
            const res = await axios.get('http://localhost:5000/api/v1/course/top');
            return res.data;
        },
    });
    console.log(courses)
    return (
        <div className="lg-container">
            {/* Heading */}
            <h2 className="mb-10 text-center font-semibold xs:mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-32 xs:text-xl md:text-2xl lg:text-3xl">
                Popular Courses
            </h2>

            {/* Grid layout for class cards or skeleton loader */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-y-4 sm:gap-y-6 xl:gap-y-10 sm:px-2 2xl:px-0 gap-x-6">
                {isLoading
                    ?
                    <PopularClassSkeleton />
                    :
                    courses?.length > 0
                        ?
                        courses?.map(item => (
                            <CourseCard
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

// Popular Class Card Component
const PopularClassCard = ({ item }) => {
    const { courseThumbnail, courseName, instructorName, price, students } = item;

    return (
        <div className="flex justify-center">
            <div className="relative w-[95%] xl:w-[90%] card shadow-xl image-full">
                {/* Class Image */}
                <figure className="h-[12.5rem] md:h-[14.375rem] xl:h-[15.938rem] overflow-hidden bg-base-200">
                    <img
                        src={courseThumbnail}
                        alt="classImg"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-linear"
                    />
                </figure>

                {/* Price Tag */}
                <span className="absolute right-2 top-3 z-30 bg-white px-2 lg:px-3 py-1 rounded-lg text-center xs:text-sm sm:text-base">
                    $ {price}
                </span>

                {/* Class Info */}
                <div className="card-body pl-4 pr-14 py-6 lg:p-8 lg:pr-14">
                    {/* Class Name */}
                    <h2 className="card-title text-sm sm:text-base lg:text-xl h-8 sm:h-12 lg:h-14">
                        {courseName}
                    </h2>

                    {/* Instructor Name */}
                    <span className="text-[0.8rem] sm:text-sm lg:text-base">
                        by {instructorName}
                    </span>

                    {/* Student Count */}
                    <span className="text-[0.8rem] sm:text-sm lg:text-base">
                        Students: {students}
                    </span>
                </div>
            </div>
        </div>
    );
};

// Courses Card Component
const CourseCard = ({ item }) => {
    const { _id, instructorName, courseName, courseThumbnail, rating, totalReviews } = item;
    const modifiedCourseName = courseName?.length > 50 ? courseName.slice(0, 50) + '...' : courseName;
    const formatedTotalReviews = formatNumberWithCommas(totalReviews);
    return (
        <div className="w-full h-fit bg-white rounded-2xl border border-[#E2E8F0] text-gray-700 mx-1 sm:mx-0 xl:hover:shadow-md duration-300">
            <Link to={`/course/${_id}`}>
                <img
                    className="w-full h-48 object-cover object-top rounded-t-lg"
                    src={courseThumbnail}
                    alt="course thumbnail"
                />
                <div className='p-3 lg:p-4 space-y-2'>
                    <h3 className="h-14 md:h-fit lg:h-14 lg:text-lg font-medium" title={courseName}>
                        {modifiedCourseName}
                    </h3>
                    <p className="truncate">
                        By {instructorName}
                    </p>
                    <div className="flex flex-col md:flex-row md:items-center gap-x-2">
                        {rating > 0 && <p className="text-gray-700 font-medium">{ rating }</p>}
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

export default PopularClasses;
