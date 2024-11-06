import { useQuery } from "@tanstack/react-query";
import { fetchCartCourses, fetchCartItems, removeCourseFromCart, updateCartItemStatus } from "../../services/cartService";
import useAuth from "../../hooks/useAuth";
import GenerateDynamicStar from "../../components/GenerateDynamicStar/GenerateDynamicStar";
import genarateImageLink from "../../utils/genarateImageLink";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import EmptyPage from "../../components/EmptyPage/EmptyPage";

const Cart = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchCourse = async () => {
        const cartItems = await fetchCartItems(user?.uid);
        const cartCourses = await fetchCartCourses(cartItems);
        return cartCourses;
    };

    // Fetch courses of cartItems
    const { data: cartCourses = [], refetch: refetchCartItems, isLoading: isCartCourseLoading } = useQuery({
        queryKey: ['cartCourses', user],
        enabled: user !== null,
        queryFn: () => fetchCourse()
    });

    const activeCartItems = cartCourses?.filter(course => course.savedForLater === false);
    const inActiveCartItems = cartCourses?.filter(course => course.savedForLater === true);

    const handleCartItemStatus = (courseId, savedForLater) => {
        updateCartItemStatus(user.uid, courseId, savedForLater, refetchCartItems);
    }

    const handleRemoveFromCart = (courseId) => {
        removeCourseFromCart(user.uid, courseId, refetchCartItems);
    }
    return (
        <section className="lg-container min-h-[25rem] px-2 sm:px-4 xl:px-6">
            <h1 className="text-2xl font-medium mt-4 md:mt-6 lg:mt-8 xl:mt-10">Cart</h1>
            {
                isCartCourseLoading
                    ?
                    <Loading />
                    :
                    <>
                        <div className="my-4 lg:my-6 capitalize font-medium">
                            <p>
                                {activeCartItems.length} {activeCartItems.length > 1 ? 'Courses' : 'Course'}  in cart
                            </p>
                            <hr className="mt-2 border-black opacity-30" />
                        </div>
                        {
                            cartCourses.length > 0
                                ?
                                // cart section
                                <div className="flex gap-x-10">
                                    <div className="flex-grow">
                                        {/* active item list */}
                                        {
                                            activeCartItems.length > 0
                                                ?
                                                <ul className="flex flex-col gap-y-4">
                                                    {
                                                        activeCartItems.map((courseData, index) =>
                                                            <CartItem
                                                                key={index}
                                                                courseData={courseData}
                                                                navigate={navigate}
                                                                handleRemoveFromCart={handleRemoveFromCart}
                                                                handleCartItemStatus={handleCartItemStatus}
                                                            />
                                                        )
                                                    }
                                                </ul>
                                                :
                                                <EmptyPage text={'Your cart is empty. Keep shopping to find a course!'} height="h-[20rem]" />
                                        }

                                        {/* inactive item list */}
                                        {
                                            inActiveCartItems.length > 0 &&
                                            <div className="mt-10">
                                                <h3 className="text-lg font-semibold">Saved for later</h3>
                                                <ul className="flex flex-col gap-y-4 mt-4">
                                                    {
                                                        inActiveCartItems?.map((courseData, index) =>
                                                            <CartItem
                                                                key={index}
                                                                courseData={courseData}
                                                                handleRemoveFromCart={handleRemoveFromCart}
                                                                handleCartItemStatus={handleCartItemStatus}
                                                            />
                                                        )
                                                    }
                                                </ul>
                                            </div>
                                        }
                                    </div>

                                    {/* checkout panel */}
                                    <div className={`w-80 ${!activeCartItems.length ? 'hidden' : ''}`}>

                                    </div>
                                </div>
                                :
                                <EmptyPage text={'Your cart is empty. Keep shopping to find a course!'} />

                        }

                    </>

            }
        </section>
    );
};

const CartItem = ({ courseData, navigate, handleRemoveFromCart, handleCartItemStatus }) => {
    const { _id, instructorName, courseName, courseThumbnail, level, rating, totalReviews, totalModules, price, discount, savedForLater } = courseData;
    return (
        <div onClick={() => navigate(`/course/${_id}`)} className="border border-[#E2E8F0] rounded-md flex items-center gap-x-4 py-3 pl-3 pr-5">
            {/* course thumbnail */}
            <img
                className="w-48 h-28 object-cover object-top rounded-md"
                src={genarateImageLink({ imageId: courseThumbnail, width: 300 })}
                alt="course thumbnail"
            />

            {/* course info */}
            <div className="flex-grow self-start overflow-hidden flex flex-col gap-y-1">
                <h2 className="text-lg font-medium truncate">
                    {courseName}
                </h2>

                <p>
                    by {instructorName}
                </p>

                <div className="flex flex-wrap items-center gap-x-2">
                    {rating > 0 && <span className='font-medium'>{rating}</span>}
                    <GenerateDynamicStar rating={rating} />
                    <span>
                        ({totalReviews})
                    </span>
                    <div className="text-sm text-gray-500 flex items-center gap-x-1">
                        <span>|</span>
                        <span>{22} total hours</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4" viewBox="0 0 15 15"><path fill="currentColor" d="M9.875 7.5a2.375 2.375 0 1 1-4.75 0a2.375 2.375 0 0 1 4.75 0"></path></svg>
                        <span>{totalModules} modules</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4" viewBox="0 0 15 15"><path fill="currentColor" d="M9.875 7.5a2.375 2.375 0 1 1-4.75 0a2.375 2.375 0 0 1 4.75 0"></path></svg>
                        <span>{level}</span>
                    </div>
                </div>

                {/* buttons */}
                <div onClick={(e) => e.stopPropagation()} className="flex gap-x-2 text-sm">
                    {
                        savedForLater
                            ?
                            <button onClick={() => handleCartItemStatus(_id, !savedForLater)} className="text-blue-600">
                                Move to cart
                            </button>
                            :
                            <button onClick={() => handleCartItemStatus(_id, !savedForLater)} className="text-blue-600">
                                Save for later
                            </button>
                    }
                    <span className="text-gray-500">|</span>
                    <button onClick={() => handleRemoveFromCart(_id)} className="text-red-500">
                        Remove
                    </button>
                </div>
            </div>

            {/* course price */}
            {discount > 0
                ? (
                    <div className="min-w-[8rem]  flex flex-col items-end gap-y-1">
                        <p className="text-gray-900 text-2xl leading-[1.625rem] font-medium">${(price - (price * (discount / 100))).toFixed(1)}</p>
                        <p className="text-[#94A3B8] text-lg"><del>${price}</del></p>
                        <p className="text-green-600 text-xl font-medium">{discount}% Off</p>
                    </div>
                ) : (
                    <p className="min-w-[8rem] text-gray-900 text-2xl font-medium text-end mb-auto">${price}</p>
                )
            }
        </div>
    )
}

export default Cart;