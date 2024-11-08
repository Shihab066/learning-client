import { useQuery } from "@tanstack/react-query";
import { fetchCartCourses, fetchCartItems, removeCourseFromCart, updateCartItemStatus } from "../../services/cartService";
import useAuth from "../../hooks/useAuth";
import GenerateDynamicStar from "../../components/GenerateDynamicStar/GenerateDynamicStar";
import generateImageLink from "../../utils/generateImageLink";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import EmptyPage from "../../components/EmptyPage/EmptyPage";
import { checkout } from "../../services/paymentService";

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
    };

    const handleRemoveFromCart = (courseId) => {
        removeCourseFromCart(user.uid, courseId, refetchCartItems);
    };

    // calculate course price 
    const coursePrice = activeCartItems?.reduce(
        (acc, { price, discount }) => acc + (price - (price * (discount / 100)).toFixed(2)),
        0
    );

    const mainPrice = activeCartItems?.reduce(
        (acc, { price }) => acc + price,
        0
    );

    const discountPercentage = parseInt(((mainPrice - coursePrice) / mainPrice) * 100);

    // handle checkout 
    const handleCheckout = () => {
        const cartItemForCheckout = activeCartItems?.map(({ _id, courseName, courseThumbnail, price, discount }) => {
            const image = generateImageLink({ imageId: courseThumbnail, height: 256, aspectRatio: '1.0', cropMode: 'fill' });
            const coursePrice = Number((price - (price * (discount / 100))).toFixed(2));
            const courseData = {
                courseId: _id,
                name: courseName,
                image: image,
                price: coursePrice
            };
            return courseData;
        });        

        checkout(cartItemForCheckout, user.uid);

    }

    return (
        <section className="lg-container min-h-[25rem] px-3 sm:px-4 xl:px-6">
            <h1 className="text-2xl font-medium mt-4 md:mt-6 lg:mt-8 xl:mt-10 mb-4 lg:mb-6">Cart</h1>
            {
                isCartCourseLoading
                    ?
                    <Loading className="h-fit md:h-[32rem]" />
                    :
                    <>
                        {
                            cartCourses.length > 0
                                ?
                                // cart section
                                <div className="flex flex-col-reverse md:flex-row gap-10 xl:gap-x-20">
                                    <div className="flex-grow">
                                        {/* cart item count */}
                                        <div className="mb-4 lg:mb-6 capitalize font-medium">
                                            <p>
                                                {activeCartItems.length} {activeCartItems.length > 1 ? 'Courses' : 'Course'}  in cart
                                            </p>
                                            <hr className="mt-2 border-black opacity-30" />
                                        </div>

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
                                                                navigate={navigate}
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
                                    {
                                        activeCartItems.length > 0 &&
                                        <div className={`sm:min-w-[19rem]`}>
                                            <div className="flex items-center md:flex-col md:items-start gap-x-2">
                                                <div className="text-lg font-bold text-gray-500">Total:</div>
                                                <div className="text-2xl md:text-3xl font-bold">${coursePrice}</div>
                                                {
                                                    discountPercentage > 0 &&
                                                    <>
                                                        <del className="text-stone-400">${mainPrice}</del>
                                                        <div>{discountPercentage}% off</div>
                                                    </>
                                                }
                                            </div>
                                            <div className="fixed bottom-0 left-0 md:static w-full p-4 md:p-0 bg-base-300 md:bg-transparent z-10">
                                                <button onClick={handleCheckout} className="w-full text-white font-medium bg-black py-3 md:mt-4">
                                                    Checkout
                                                </button>
                                            </div>
                                        </div>
                                    }
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
        <div onClick={() => navigate(`/course/${_id}`)} className="border-t lg:border border-[#E2E8F0] lg:rounded-md grid grid-cols-2  sm:flex xl:items-center gap-2 lg:gap-x-4 py-3 lg:pl-3 lg:pr-5">
            {/* course thumbnail */}
            <img
                className="w-24 h-16 md:w-12 md:h-12 lg:w-48 lg:h-28 object-cover object-top rounded lg:rounded-md"
                src={generateImageLink({ imageId: courseThumbnail, width: 300 })}
                alt="course thumbnail"
            />

            {/* course info */}
            <div className="w-full self-start overflow-hidden flex flex-col gap-y-1 order-last sm:order-none col-span-2">
                <h2 className="lg:text-lg font-medium xl:truncate">
                    {courseName}
                </h2>

                <p className="text-base hidden lg:block">
                    by {instructorName}
                </p>

                <div className="flex flex-col xl:flex-row xl:items-center gap-x-2 gap-y-1">
                    <div className="flex items-center gap-x-2">
                        {rating > 0 && <span className='font-medium'>{rating}</span>}
                        <GenerateDynamicStar rating={rating} />
                        <span>
                            ({totalReviews})
                        </span>
                    </div>
                    <div className="text-xs lg:text-sm text-gray-500 flex items-center gap-x-1">
                        <span className="hidden xl:block">|</span>
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
                    <button onClick={() => handleRemoveFromCart(_id)} className="text-red-600">
                        Remove
                    </button>
                </div>
            </div>

            {/* course price */}
            {discount > 0
                ? (
                    <div className="min-w-[5rem] lg:min-w-[6rem]  flex flex-col items-end gap-y-1">
                        <p className="text-gray-900 text-lg lg:text-2xl lg:leading-[1.625rem] font-medium">${(price - (price * (discount / 100))).toFixed(2)}</p>
                        <p className="text-[#94A3B8] text-sm lg:text-lg"><del>${price}</del></p>
                        <p className="text-green-600 text-sm lg:text-xl font-medium">{discount}% Off</p>
                    </div>
                ) : (
                    <p className="min-w-[5rem] lg:min-w-[6rem] text-gray-900 text-lg lg:text-2xl font-medium text-end mb-auto">${price}</p>
                )
            }
        </div>
    )
}

export default Cart;