import { useRef, useState } from "react";
import { addReview } from "../../../services/reviewsService";
import useAuth from "../../../hooks/useAuth";
import { NavLink, Outlet } from "react-router-dom";
import { toastSuccess } from "../../../utils/toastUtils";

const MyReviews = () => {    
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
                    <NavLink to='pending-reviews' className='group text-gray-500 font-medium'>
                        {({ isActive }) => (
                            <>
                                To Be Reviewed
                                <div className={`${isActive ? 'w-full' : 'w-0'} group-hover:w-full h-[2px] duration-300 bg-black`}></div>
                            </>
                        )}
                    </NavLink>

                    <NavLink to='reviews-history' className='group text-gray-500 font-medium'>
                        {({ isActive }) => (
                            <>
                                History
                                <div className={`${isActive ? 'w-full' : 'w-0'} group-hover:w-full h-[2px] duration-300 bg-black`}></div>
                            </>
                        )}
                    </NavLink>
                </div>

                <Outlet />
            </section>
            <AddReviewModal
                key={courseIdForReview}
                courseIdForReview={courseIdForReview}
                setCourseIdForReview={setCourseIdForReview}
            />
        </>
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

                    <div ref={closeRef} onClick={() => setCourseIdForReview('')} className="modal-action">
                        <label htmlFor="add-review-modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MyReviews;