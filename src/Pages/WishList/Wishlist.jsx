import { Link } from "react-router-dom";
import GenerateDynamicStar from "../../components/GenerateDynamicStar/GenerateDynamicStar";
import useAuth from "../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { fetchWishlist, fetchWishlistCourses, removeCourseFromWishList } from "../../services/wishlistService";
import generateImageLink from "../../utils/generateImageLink";

const Wishlist = () => {
    const { user } = useAuth();    

    const fetchCourse = async () => {
        const wishlist = await fetchWishlist(user?.uid);
        const wishlistCourses = await fetchWishlistCourses(wishlist)
        return wishlistCourses;
    };

    // Fetch courses of wishlist items
    const { data: wishlistCourses = [], refetch: refetchWishlist } = useQuery({
        queryKey: ['wishlistCourses', user],
        enabled: user !== null,
        queryFn: () => fetchCourse()
    });

    const handleRemoveFromWishlist = (courseId) => {
        removeCourseFromWishList(user.uid, courseId, refetchWishlist);
    };

    return (
        <section className="lg-container min-h-[25rem] px-2 sm:px-4 xl:px-6">
            {/* section heading */}
            <div className="mt-4 md:mt-6 lg:mt-8 xl:mt-10">
                <h1 className="text-2xl font-medium">Wishlist</h1>
                <div className="my-4 lg:my-6 capitalize font-medium">
                    <p>
                        {wishlistCourses.length} {wishlistCourses.length > 1 ? 'Courses' : 'Course'}  in wishlist
                    </p>
                    <hr className="mt-2 border-black opacity-30" />
                </div>
            </div>

            {/* wishlist items */}
            <div >
                {
                    wishlistCourses.length > 0
                    &&
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {
                            wishlistCourses?.map((courseData, index) =>
                                <CourseCard
                                    key={index}
                                    courseData={courseData}
                                    handleRemoveFromWishlist={handleRemoveFromWishlist}
                                />
                            )
                        }
                    </div>
                }
                {
                    wishlistCourses.length === 0 &&
                    <div className="h-[30rem] flex items-center justify-center">
                        <p className="text-gray-400 text-xl font-medium mx-auto">
                            Your wishlist is empty.
                        </p>
                    </div>
                }
            </div>
        </section>
    );
};

// Courses Card Component
const CourseCard = ({ courseData, handleRemoveFromWishlist }) => {
    const { _id, instructorName, courseName, courseThumbnail, level, rating, totalReviews, totalModules, price, discount } = courseData;
    const modifiedCourseName = courseName?.length > 50 ? courseName.slice(0, 50) + '...' : courseName;

    return (
        <div className="relative w-full h-fit bg-white rounded-2xl overflow-hidden border border-[#E2E8F0] text-gray-700 xl:hover:shadow-lg duration-300">
            <Link to={`/course/${_id}`}>
                <img
                    className="w-full h-48 object-cover object-top"
                    src={generateImageLink({imageId: courseThumbnail})}
                    alt="course thumbnail"
                />
                <div className='p-3 lg:p-4 space-y-2'>
                    <h3 className="h-14 md:h-12 lg:h-14 lg:text-lg font-medium" title={courseName}>
                        {modifiedCourseName}
                    </h3>
                    <p className="truncate">
                        By {instructorName}
                    </p>
                    <div className="w-fit rounded-full px-3 py-[.2rem] text-xs bg-yellow-400 text-gray-700 font-medium">
                        {level}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2">
                        {rating > 0 && <span className='font-medium'>{rating}</span>}
                        <GenerateDynamicStar rating={rating} />
                        <span>
                            ({totalReviews})
                        </span>
                    </div>
                    <p>{22} Total Hours. {totalModules} Modules.</p>
                    <div>
                        {
                            discount > 0
                                ? (
                                    <div className="flex justify-start items-start gap-x-3">
                                        <p className="text-gray-900 text-2xl leading-[1.625rem] font-medium">${(price - (price * (discount / 100))).toFixed(1)}</p>
                                        <p className="text-[#94A3B8] text-lg"><del>${price}</del></p>
                                        <p className="text-green-600 text-xl font-medium">{discount}% Off</p>
                                    </div>
                                ) : (
                                    <p className="text-gray-900 text-2xl font-medium">${price}</p>
                                )
                        }
                    </div>
                </div>
            </Link>
            <button onClick={() => handleRemoveFromWishlist(_id)} className="absolute top-[19rem] right-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 text-red-500" viewBox="0 0 24 24"><path fill="#ef4444" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.75 3.5C5.127 3.5 3 5.76 3 8.547C3 14.125 12 20.5 12 20.5s9-6.375 9-11.953C21 5.094 18.873 3.5 16.25 3.5c-1.86 0-3.47 1.136-4.25 2.79c-.78-1.654-2.39-2.79-4.25-2.79"></path></svg>
            </button>
        </div>
    );
};

export default Wishlist;