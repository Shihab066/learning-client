import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { getPendingReviews } from "../../../services/reviewsService";
import Loading from "../../../components/Loading/Loading";
import EmptyPage from "../../../components/EmptyPage/EmptyPage";
import { Link } from "react-router-dom";
import generateImageLink from "../../../utils/generateImageLink";

const PendingReviews = ({ setCourseIdForReview }) => {
    const { user } = useAuth();

    // Fetch pending reviews data using React Query
    const { data: pendingReviewsData = [], isLoading } = useQuery({
        queryKey: ['pending-reviews'],
        enabled: !!user, // Ensure query runs only if the user is logged in
        queryFn: () => getPendingReviews(user.uid),
    });

    return (
        <div className="space-y-4 w-full">
            {
                isLoading ?
                    <Loading className=" h-[20rem] sm:h-[32rem]" />
                    :
                    <>
                        {/* Render a list of pending review cards */}
                        {
                            pendingReviewsData.length > 0 ? (
                                pendingReviewsData.map((reviewData, index) => (
                                    <PendingReviewCard
                                        key={index}
                                        data={reviewData}
                                        setCourseIdForReview={setCourseIdForReview}
                                    />
                                ))
                            ) : (
                                <EmptyPage
                                    text='Your feedback helps others make better choices'
                                    height="h-[20rem] sm:h-[30rem]"
                                />
                            )}
                    </>
            }
        </div>
    );
};

const PendingReviewCard = ({ data, setCourseIdForReview }) => {
    const { courseId, courseName, courseThumbnail, instructorName } = data;

    return (
        <div className="w-full pb-3 border-b flex items-start gap-x-4">
            {/* Course Thumbnail */}
            <Link
                to={`/course/${courseId}`}
                className="min-w-[3.5rem] w-14 h-14 rounded overflow-hidden bg-base-200"
            >
                <img
                    src={generateImageLink({ imageId: courseThumbnail, width: '256' })}
                    alt={`${courseName} Thumbnail`}
                    className="w-full h-full object-cover"
                />
            </Link>

            {/* Course Information */}
            <div className="flex-grow overflow-hidden">
                {/* Course Name */}
                <div className="font-medium text-sm sm:text-base text-gray-700 truncate">
                    {courseName}
                </div>
                {/* Instructor Name */}
                <p className="text-xs sm:text-sm text-gray-500">{instructorName}</p>

                {/* Review Button for Small Screens */}
                <label onClick={() => { setCourseIdForReview(courseId) }} htmlFor="add-review-modal" className="flex sm:hidden text-sm text-blue-500">
                    Review
                </label>
            </div>

            {/* Review Button for Larger Screens */}
            <div className="hidden sm:flex self-center">
                <label onClick={() => { setCourseIdForReview(courseId) }} htmlFor="add-review-modal" className="px-4 py-2 text-sm text-white bg-black rounded">
                    Review
                </label>
            </div>
        </div>
    );
};

export default PendingReviews;