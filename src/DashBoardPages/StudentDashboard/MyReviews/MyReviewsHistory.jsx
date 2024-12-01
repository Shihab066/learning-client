import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { getStudentReviews } from "../../../services/reviewsService";
import generateImageLink from "../../../utils/generateImageLink";
import { Link } from "react-router-dom";
import GenerateDynamicStar from "../../../components/GenerateDynamicStar/GenerateDynamicStar";
import { useEffect, useRef, useState } from "react";

const MyReviewsHistory = () => {
    // Extract user data from authentication context
    const { user } = useAuth();
    const [reviewData, setReviewData] = useState(null);

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
                <MyReviewsHistoryCard key={index} data={review} setReviewData={setReviewData} />
            ))}
            {
                reviewData &&
                <UpdateReviewModal
                    // key={reviewData}
                    reviewData={reviewData}
                    setReviewData={setReviewData}
                />
            }
        </div>
    );
};

const MyReviewsHistoryCard = ({ data, setReviewData }) => {
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
            <label
                onClick={() => setReviewData(data)}
                htmlFor="update-review-modal"
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
            </label>
        </div>
    );
};

const UpdateReviewModal = ({ courseIdForReview, setCourseIdForReview, reviewData, setReviewData }) => {
    const [newReviewData, setNewReviewData] = useState(reviewData);
    const { _courseId, rating, review } = newReviewData;

    const closeRef = useRef();
    const { user } = useAuth();
    const [isUpdateBtnDisable, setIsUpdateBtnDisable] = useState(true);

    const ratingMessage = ['Select Rating', 'Awful, not what I expected at all', 'Poor, pretty disappointed', 'Average, could be better', 'Good, what I expected', 'Amazing, above expectations!'];

    const handleRatingChange = (rating) => {
        setNewReviewData(prevData => ({ ...prevData, rating }))
    };

    const handleReviewChange = (e) => {
        setNewReviewData(prevData => ({ ...prevData, review: e.target.value }))
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const reviewData = {
            _courseId,
            _studentId: user.uid,        
            rating,
            review
        };

        console.log(reviewData);
        
        // const res = await addReview(reviewData);

        // if (res.insertedId) {
        //     toastSuccess('Your review has been submitted.')
        //     e.target.reset();
        //     closeRef.current.click();
        // }
    }

    useEffect(() => {
        const hasChanges = JSON.stringify(newReviewData) !== JSON.stringify(reviewData);
        setIsUpdateBtnDisable(!hasChanges)
    }, [newReviewData]);
    return (
        <div>
            < input type="checkbox" id="update-review-modal" className="modal-toggle" />
            <div className="modal overflow-y-auto h-screen" role="dialog">
                <div className="modal-box min-h-fit w-11/12 max-w-xl py-10 my-52">
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-bold text-center">How would you rate this course?</h3>
                        <p className="py-4 font-medium">{ratingMessage[rating]}</p>
                        <div className="rating rating-lg">
                            <input
                                type="radio"
                                name="rating"
                                className="hidden"
                                defaultChecked
                            />
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

                    {/* review input */}

                    <form onSubmit={handleReviewSubmit} className="flex flex-col gap-y-4">
                        <textarea
                            name="review"
                            rows="5"
                            placeholder="Tell us about your own personal experience taking this course. Was it a good match for you?"
                            className="w-full border border-black focus:outline-none mt-4 px-4 py-3.5 resize-none placeholder-gray-600"
                            value={review}
                            onChange={(e) => handleReviewChange(e)}
                        />

                        <input
                            type="submit"
                            value='Save Change'
                            className={`self-end w-fit font-bold text-white bg-black hover:bg-opacity-80 px-3 py-3 cursor-pointer ${isUpdateBtnDisable ? 'pointer-events-none opacity-50' : ''}`}
                        />
                    </form>

                    <div ref={closeRef} onClick={() => setReviewData(null)} className="modal-action">
                        <label htmlFor="update-review-modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyReviewsHistory;