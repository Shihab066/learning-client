import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toastSuccess } from "../../../utils/toastUtils";
import { getStudentReviews, updateReview } from "../../../services/reviewsService";
import generateImageLink from "../../../utils/generateImageLink";
import GenerateDynamicStar from "../../../components/GenerateDynamicStar/GenerateDynamicStar";
import Loading from "../../../components/Loading/Loading";
import EmptyPage from "../../../components/EmptyPage/EmptyPage";

const MyReviewsHistory = () => {
    // Extract user data from the authentication context
    const { user } = useAuth();

    // State to track the selected review data for the update modal
    const [selectedReview, setSelectedReview] = useState(null);

    // Fetch the user's reviews using React Query
    const {
        data: reviews = [],
        refetch,
        isLoading,
    } = useQuery({
        queryKey: ['my-reviews'],
        enabled: !!user,          // Only enable the query if the user is authenticated
        queryFn: async () => await getStudentReviews(user.uid),
    });

    // Render a loading indicator if the data is still being fetched
    if (isLoading) {
        return <Loading className="h-[20rem] sm:h-[32rem]" />;
    }

    // Render an empty page if there are no reviews
    if (reviews.length === 0) {
        return (
            <EmptyPage
                text="It looks like you haven’t reviewed any courses yet."
                height="h-[20rem] sm:h-[30rem]"
            />
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Render each review card */}
            {reviews.map((review, index) => (
                <MyReviewsHistoryCard
                    key={index}
                    data={review}
                    setSelectedReview={setSelectedReview} // Pass down function to update modal data
                />
            ))}

            {/* Display the update review modal if a review is selected */}
            {selectedReview && (
                <UpdateReviewModal
                    selectedReview={selectedReview}
                    setSelectedReview={setSelectedReview} // Clear modal data on close
                    refetch={refetch}                // Refresh reviews after an update
                />
            )}
        </div>
    );
};

const MyReviewsHistoryCard = ({ data, setSelectedReview }) => {    
    const { _courseId, courseName, courseThumbnail, rating, review } = data;

    return (
        <div className="relative flex items-start gap-4 border-b pb-3 group">
            {/* Course Thumbnail */}
            <div className="w-14 h-14 min-w-[3.5rem] bg-base-200 rounded overflow-hidden">
                <img
                    className="w-full h-full object-cover"
                    src={generateImageLink({ imageId: courseThumbnail, width: '256' })}
                    alt={`${courseName} Thumbnail`}
                />
            </div>

            {/* Course Details */}
            <div className="flex flex-col gap-2 w-full">
                {/* Course Name (Clickable Link) */}
                <Link
                    to={`/course/${_courseId}`}
                    className="max-w-[85%] font-medium text-gray-700 leading-5 truncate"
                >
                    {courseName}
                </Link>

                {/* Rating and Edit Button */}
                <div className="flex items-center gap-4">
                    {/* Dynamic Star Rating */}
                    <GenerateDynamicStar rating={rating} />

                    {/* Small Edit Button (Visible on small screens) */}
                    <label
                        onClick={() => setSelectedReview(data)}
                        htmlFor="update-review-modal"
                        className="sm:hidden text-black"
                        title="Edit"
                    >
                        <EditIcon />
                    </label>
                </div>

                {/* Review Text */}
                <p className="text-sm text-gray-600">{review}</p>
            </div>

            {/* Large Edit Button (Visible on hover for large screens) */}
            <label
                onClick={() => setSelectedReview(data)}
                htmlFor="update-review-modal"
                className="absolute top-0 right-2 hidden sm:flex xl:opacity-0 xl:invisible xl:group-hover:opacity-100 xl:group-hover:visible duration-300"
                title="Edit"
            >
                <EditIcon />
            </label>
        </div>
    );
};

// Separate SVG for the Edit Icon
const EditIcon = () => (
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
            <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
            <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3" />
        </g>
    </svg>
);

const UpdateReviewModal = ({ selectedReview, setSelectedReview, refetch }) => {
    // State to manage updated review data
    const [newReviewData, setNewReviewData] = useState(selectedReview);
    const { _courseId, rating, review } = newReviewData;

    const closeRef = useRef(); // Ref to close the modal
    const { user } = useAuth(); // Access authenticated user data

    const [isUpdateBtnDisabled, setIsUpdateBtnDisabled] = useState(true); // State to toggle the update button

    // Rating messages for user feedback
    const ratingMessages = [
        "Select Rating",
        "Awful, not what I expected at all",
        "Poor, pretty disappointed",
        "Average, could be better",
        "Good, what I expected",
        "Amazing, above expectations!",
    ];

    // Handle changes to rating
    const handleRatingChange = (newRating) => {
        setNewReviewData((prev) => ({ ...prev, rating: newRating }));
    };

    // Handle changes to review text
    const handleReviewChange = (e) => {
        setNewReviewData((prev) => ({ ...prev, review: e.target.value }));
    };

    // Handle form submission to update the review
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const reviewData = {
            _courseId,
            _studentId: user.uid,
            rating,
            review,
        };

        const res = await updateReview(reviewData);

        if (res.modifiedCount) {
            toastSuccess("Your review has been updated.");
            closeRef.current.click(); // Close modal
            setIsUpdateBtnDisabled(true);
            refetch(); // Refresh data
        }
    };

    // Track changes in newReviewData to toggle the update button
    useEffect(() => {
        const hasChanges = JSON.stringify(newReviewData) !== JSON.stringify(selectedReview);
        setIsUpdateBtnDisabled(!hasChanges);
    }, [newReviewData, selectedReview]);

    return (
        <div>
            {/* Modal Toggle Checkbox */}
            <input type="checkbox" id="update-review-modal" className="modal-toggle" />
            
            {/* Modal */}
            <div className="modal h-screen overflow-y-auto" role="dialog">
                <div className="modal-box w-11/12 max-w-xl py-10 my-52 min-h-fit">
                    {/* Modal Header */}
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-bold text-center">
                            How would you rate this course?
                        </h3>
                        <p className="py-4 font-medium">{ratingMessages[rating]}</p>
                        
                        {/* Star Rating */}
                        <div className="rating rating-lg">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <input
                                    key={value}
                                    type="radio"
                                    name="rating"
                                    className="mask mask-star bg-orange-400"
                                    checked={rating === value}
                                    onChange={() => handleRatingChange(value)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Review Input Form */}
                    <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                        <textarea
                            name="review"
                            rows="5"
                            placeholder="Tell us about your experience taking this course. Was it a good match for you?"
                            className="w-full px-4 py-3.5 mt-4 border border-black placeholder-gray-600 focus:outline-none resize-none"
                            value={review}
                            onChange={handleReviewChange}
                        />
                        <input
                            type="submit"
                            value="Save Changes"
                            className={`self-end w-fit px-3 py-3 font-bold text-white bg-black hover:bg-opacity-80 cursor-pointer ${
                                isUpdateBtnDisabled ? "pointer-events-none opacity-50" : ""
                            }`}
                        />
                    </form>

                    {/* Modal Close Button */}
                    <div className="modal-action">
                        <label
                            ref={closeRef}
                            htmlFor="update-review-modal"
                            className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
                            onClick={() => setSelectedReview(null)}
                        >
                            ✕
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyReviewsHistory;