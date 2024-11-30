import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { addReview, getPendingReviews } from "../../../services/reviewsService";
import Loading from "../../../components/Loading/Loading";
import EmptyPage from "../../../components/EmptyPage/EmptyPage";
import { Link } from "react-router-dom";
import generateImageLink from "../../../utils/generateImageLink";
import { useRef, useState } from "react";
import { toastSuccess } from "../../../utils/toastUtils";

const PendingReviews = () => {
    const { user } = useAuth();
    const [courseIdForReview, setCourseIdForReview] = useState(''); // this state is used in addCourseModal to add review for specific course    

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
            <AddReviewModal
                key={courseIdForReview}
                courseIdForReview={courseIdForReview}
                setCourseIdForReview={setCourseIdForReview}
            />
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
    const closeRef = useRef();
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
            toastSuccess('Your review has been submitted.')
            e.target.reset();
            closeRef.current.click();
        }
    }
    return (
        <div>
            < input type="checkbox" id="add-review-modal" className="modal-toggle" />
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

                    <div ref={closeRef} onClick={() => setCourseIdForReview('')} className="modal-action">
                        <label htmlFor="add-review-modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PendingReviews;