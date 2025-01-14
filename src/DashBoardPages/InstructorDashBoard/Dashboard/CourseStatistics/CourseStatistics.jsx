import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import formatNumber from "../../../../utils/FormateNumber";
import CourseStatisticsSekeleton from "./CourseStatisticsSekeleton";
import EmptyPage from "../../../../components/EmptyPage/EmptyPage";

const CourseStatistics = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();

    // Fetch instructor course statistics using react-query
    const { data: courses = [], isLoading } = useQuery({
        queryKey: ['instructor-courses-statistics'],
        enabled: Boolean(user),
        queryFn: async () => {
            const response = await axiosSecure(`/dashboard/instructor/getCoursesStatistics/${user.uid}`);
            return response.data;
        }
    });

    if (isLoading) {
        return (
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <CourseStatisticsSekeleton />
            </div>
        );
    }

    return (
        <div className="mt-10">
            <h2 className="text-lg font-bold">Courses</h2>
            {
                courses.length > 0 ? (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {
                            courses.map((courseData, index) => (
                                <CourseStatisticsCard
                                    key={index}
                                    courseData={courseData}
                                />
                            ))
                        }
                    </div>
                ) : (
                    <EmptyPage text="No Course Found" />
                )
            }
        </div>
    );
};

const CourseStatisticsCard = ({ courseData }) => {
    const { courseName, price, discount, totalModules, students, courseCompleted, totalReviews, onShelf } = courseData;
    const finalPrice = discount ? (price - (price * (discount / 100))).toFixed(2) : price;

    const handleLargeNumber = (number) => {
        return formatNumber({ num: number, showFraction: false });
    }
    return (
        <div className="p-4 lg:p-5 border border-[#E2E8F0] shadow-[0px_0px_8px_0px] shadow-[#3b82f61f] rounded-lg">
            <h3 className="text-lg font-medium border-b pb-2 mb-3 truncate">
                {courseName}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="text-gray-500">
                    <div className="text-lg text-black font-medium">
                        {
                            finalPrice !== 0
                                ?
                                <span>${handleLargeNumber(finalPrice)}</span>
                                :
                                <span>Free</span>
                        }
                    </div>
                    Price
                </div>

                <div className="text-gray-500">
                    <div className="text-lg text-black font-medium">
                        {totalModules}
                    </div>
                    Modules
                </div>

                <div className="text-gray-500">
                    <div className="text-lg text-black font-medium">
                        {handleLargeNumber(students)}
                    </div>
                    Enrolled
                </div>

                <div className="text-gray-500">
                    <div className="text-lg text-black font-medium">
                        {handleLargeNumber(courseCompleted)}
                    </div>
                    Certificates
                </div>

                <div className="text-gray-500">
                    <div className="text-lg text-black font-medium">
                        {handleLargeNumber(totalReviews)}
                    </div>
                    Reviews
                </div>

                <div className="text-gray-500">
                    <div className="text-lg text-black font-medium">
                        {handleLargeNumber(onShelf)}
                    </div>
                    On shelf
                </div>
            </div>
        </div>
    )
};

export default CourseStatistics;