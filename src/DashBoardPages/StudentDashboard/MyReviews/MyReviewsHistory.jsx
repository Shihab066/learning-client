import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { getStudentReviews } from "../../../services/reviewsService";
import generateImageLink from "../../../utils/generateImageLink";
import { Link } from "react-router-dom";
import GenerateDynamicStar from "../../../components/GenerateDynamicStar/GenerateDynamicStar";

const MyReviewsHistory = () => {
    // Extract user data from authentication context
    const { user } = useAuth();

    // Fetch the user's reviews using React Query
    const { data: myReviews = [] } = useQuery({
        queryKey: ['my-reviews'],
        enabled: !!user, // Only enable the query if the user is authenticated
        queryFn: async () => await getStudentReviews(user.uid),
    });

    return (
        <div className="flex flex-col gap-6">
            {/* Render each review card */}
            {myReviews.map((review, index) => (
                <MyReviewsHistoryCard key={index} data={review} />
            ))}
        </div>
    );
};

const MyReviewsHistoryCard = ({ data }) => {
    const { _courseId, courseName, courseThumbnail, rating, review } = data;

    return (
        <div className="relative flex items-start gap-4 border-b pb-3 group">
            {/* Course Thumbnail */}
            <div className="min-w-[3.5rem] w-14 h-14 bg-base-200 rounded overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src={generateImageLink({ imageId: courseThumbnail, width: '256' })}
                    alt={`${courseName} Thumbnail`}
                />
            </div>

            {/* Course Details */}
            <div className="flex flex-col gap-2 w-full">
                {/* Course Name (with link) */}
                <Link
                    to={`/course/${_courseId}`}
                    className="truncate font-medium leading-5 text-gray-700 max-w-[85%]"
                >
                    {courseName}
                </Link>

                {/* Rating and Small Edit Button */}
                <div className="flex items-center gap-4">
                    <GenerateDynamicStar rating={rating} />
                    {/* Small Edit Button (Visible on small screens) */}
                    <button
                        className="sm:hidden text-black"
                        title="Edit"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-5"
                        >
                            <g
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                            >
                                <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"></path>
                                <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"></path>
                            </g>
                        </svg>
                    </button>
                </div>

                {/* Review Text */}
                <p className="text-gray-600 text-sm ">
                    {review}
                </p>
            </div>

            {/* Large Edit Button (Visible on hover for large screens) */}
            <button
                className="hidden sm:flex absolute top-0 right-2 xl:opacity-0 xl:invisible xl:group-hover:opacity-100 xl:group-hover:visible duration-300"
                title="Edit"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5"
                >
                    <g
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                    >
                        <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"></path>
                        <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"></path>
                    </g>
                </svg>
            </button>
        </div>
    );
};

export default MyReviewsHistory;