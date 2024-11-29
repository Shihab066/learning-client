import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { addReview, getPendingReviews, getStudentReviews } from "../../../services/reviewsService";
import useAuth from "../../../hooks/useAuth";
import generateImageLink from "../../../utils/generateImageLink";
import GenerateDynamicStar from "../../../components/GenerateDynamicStar/GenerateDynamicStar";
import { Link } from "react-router-dom";
import { toastSuccess } from "../../../utils/toastUtils";

const MyReviews = () => {
    const [activeLink, setActiveLink] = useState('1');
    const [courseIdForReview, setCourseIdForReview] = useState(''); // this state is used in addCourseModal to add review for specific course

    return (
        <>
            <section className="w-full overflow-hidden">
                <div>
                    <h2 className="text-xl font-medium">
                        My Reviews
                    </h2>
                </div>

                <div className="my-6 pb-3 border-b flex justify-start gap-x-6">
                    <button onClick={() => setActiveLink('1')} className="group text-gray-500 font-medium">
                        To Be Reviewed
                        <div className={`${activeLink === '1' ? 'w-full' : 'w-0'} group-hover:w-full h-[2px] duration-300 bg-black`}></div>
                    </button>

                    <button onClick={() => setActiveLink('2')} className="group text-gray-500 font-medium">
                        History
                        <div className={`${activeLink === '2' ? 'w-full' : 'w-0'} group-hover:w-full h-[2px] duration-300 bg-black`}></div>
                    </button>
                </div>
                {
                    activeLink === '1' &&
                    <PendingReviews
                        setCourseIdForReview={setCourseIdForReview}
                    />
                }

                {
                    activeLink === '2' &&
                    <MyReviewHistory />
                }
            </section>
            <AddReviewModal
                key={courseIdForReview}
                courseIdForReview={courseIdForReview}
                setCourseIdForReview={setCourseIdForReview}
            />
        </>
    );
};

const MyReviewHistory = () => {
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
                <ReviewCard key={index} data={review} />
            ))}
        </div>
    );
};

const ReviewCard = ({ data }) => {
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

const PendingReviews = ({ setCourseIdForReview }) => {
    const { user } = useAuth();

    // Fetch pending reviews data using React Query
    const { data: pendingReviewsData = [] } = useQuery({
        queryKey: ['pending-reviews'],
        enabled: !!user, // Ensure query runs only if the user is logged in
        queryFn: () => getPendingReviews(user.uid),
    });

    return (
        <div className="space-y-4 w-full">
            {/* Render a list of pending review cards */}
            {pendingReviewsData.length > 0 ? (
                pendingReviewsData.map((reviewData, index) => (
                    <PendingReviewCard
                        key={index}
                        data={reviewData}
                        setCourseIdForReview={setCourseIdForReview}
                    />
                ))
            ) : (
                <p className="text-gray-500 text-sm">No pending reviews available.</p>
            )}
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


const AddReviewModal = ({ courseIdForReview, setCourseIdForReview }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState(0);
    const ratingMessage = ['Select Rating', 'Awful, not what I expected at all', 'Poor, pretty disappointed', 'Average, could be better', 'Good, what I expected', 'Amazing, above expectations!'];

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const reviewData = {
            _courseId: courseIdForReview,
            _studentId: user.uid,
            userName: user.displayName,
            userImage: user.photoURL,
            rating,
            review: e.target.review.value,            
        };

        const res = await addReview(reviewData);

        if (res.insertedId) {
            toastSuccess('Thank you! Your review has been submitted.')
        }

        

    }
    return (
        <div>
            < input type="checkbox" id="add-review-modal" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box w-11/12 max-w-xl py-10">
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
                                    onChange={() => setRating(value)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* review input */}
                    {
                        rating > 0 &&
                        <form onSubmit={handleReviewSubmit} className="flex flex-col gap-y-4">
                            <textarea
                                name="review"
                                rows="5"
                                placeholder="Tell us about your own personal experience taking this course. Was it a good match for you?"
                                className="w-full border border-black focus:outline-none mt-4 px-4 py-3.5 resize-none placeholder-gray-600"
                            />

                            <input
                                type="submit"
                                value='Save and Continue'
                                className="self-end w-fit font-bold text-white bg-black hover:bg-opacity-80 px-3 py-3 cursor-pointer"
                            />
                        </form>
                    }

                    <div onClick={() => setCourseIdForReview('')} className="modal-action">
                        <label htmlFor="add-review-modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MyReviews;