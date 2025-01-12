import { useEffect, useState } from "react";
import GenerateDynamicStar from "../../../components/GenerateDynamicStar/GenerateDynamicStar";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import searchIcon from '../../../assets/icon/search_icon.svg';
import CourseReviewsSkeleton from "./CourseReviewsSkeleton";
import generateImageLink from "../../../utils/generateImageLink";

const CourseReviews = () => {
    const { user, loading } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const [searchValue, setSearchValue] = useState('');
    const [limit, setLimit] = useState(4);

    // fetch all courses
    const { data, isLoading } = useQuery({
        queryKey: ['reviews', user?.uid, searchValue, limit],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`http://localhost:5000/api/v1/review/instructor/${user?.uid}?search=${searchValue}&limit=${limit}`);
            return res.data;
        }
    })

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchValue(e.target.search.value);
    }

    return (
        <div>
            <div className="flex justify-between items-top mb-6">
                <h2 className="text-lg font-medium">Reviews</h2>
                <form onSubmit={handleSubmit} className="sm:w-[18rem] h-fit relative">
                    <input
                        autoComplete="off"
                        name="search"
                        type="text"
                        placeholder="Search Review"
                        className="w-full border py-1.5 rounded-md pl-2 pr-10 focus:outline-none"
                    />
                    {/* search icon */}
                    <button type="submit">
                        <img
                            className='w-6 absolute right-2 top-1/2 -translate-y-1/2'
                            src={searchIcon}
                            alt="search icon" />
                    </button>
                </form>
            </div>
            <div className="space-y-4 pb-5">
                {
                    isLoading
                        ?
                        <CourseReviewsSkeleton />
                        : data?.reviews.length
                            ?
                            <>
                                {
                                    data?.reviews?.map((reviewData, index) =>
                                        <CourseReviewCard
                                            key={index}
                                            reviewData={reviewData}
                                        />
                                    )
                                }
                                {
                                    data?.totalReviews > 4 && data?.totalReviews !== data?.reviews.length &&
                                    <button onClick={() => setLimit(limit + 6)} className={`btn btn-md capitalize outline outline-1 outline-gray-900  text-sm sm:text-base text-gray-900 font-medium bg-white hover:bg-white hover:shadow-lg duration-300 ml-1`}>
                                        View more Reviews
                                    </button>
                                }
                            </>
                            :
                            <div className="h-[500px] flex items-center justify-center">
                                <p className="text-gray-400 text-lg font-medium">No Reviews Found</p>
                            </div>
                }
            </div>
        </div>
    );
};

const CourseReviewCard = ({ reviewData }) => {
    const { userName, userImage, courseName, rating, review } = reviewData;
    const [reviewTextLength, setReviewTextLength] = useState(null);
    const [isReviewOverflow, setIsReviewOverflow] = useState(false);
    const [modifiedReview, setModifiedReview] = useState('');
    const [seeMoreEnabled, setSeeMoreEnabled] = useState(false);


    const handleReviewTextLength = () => {
        const screenSize = window.innerWidth;
        if (screenSize >= 1024) {
            setReviewTextLength(320);
        }
        else if (screenSize >= 768 && screenSize < 1024) {
            setReviewTextLength(220)
        }
        else if (screenSize >= 576 && screenSize < 768) {
            setReviewTextLength(150)
        }
        else if (screenSize >= 0 && screenSize < 576) {
            setReviewTextLength(130)
        }
    }

    const handleSeeMore = () => {
        setModifiedReview(review);
        setSeeMoreEnabled(true);
    };

    const handleSeeLess = () => {
        setModifiedReview(review.slice(0, reviewTextLength) + '...');
        setSeeMoreEnabled(false);
    };

    const gradientToBottom = {
        background: 'linear-gradient(to bottom, rgba(255,255,255, 1), rgba(255,255,255, 0))'
    };

    const gradientToTop = {
        background: 'linear-gradient(to top, rgba(255,255,255, 1), rgba(255,255,255, 0))'
    };

    useEffect(() => {
        handleReviewTextLength()
    }, [])

    useEffect(() => {
        setIsReviewOverflow(review?.length > reviewTextLength);
        setModifiedReview(review?.slice(0, reviewTextLength) + '...')
    }, [review, reviewTextLength])
    return (
        <div className="w-full space-y-2 border  px-4 py-4 rounded-xl">
            {/* reviewer info */}
            <article className="flex justify-start items-center gap-x-3">
                <figure>
                    <img
                        className="w-12 h-12 rounded-full object-cover"
                        src={generateImageLink({ imageId: userImage, width: '128', cropMode: 'fill', aspactRatio: '1.0' })}
                        alt="reviewer image"
                    />
                </figure>
                <p className="sm:text-lg font-medium truncate">
                    {userName}
                </p>
            </article>
            {/* review */}
            <article className="space-y-2">
                <p>Course Name:
                    <span className="sm:text-lg font-medium ml-2">{courseName}</span></p>
                <div className="flex justify-start items-center gap-x-2">
                    <span>Rating: </span>
                    <GenerateDynamicStar rating={rating} />
                </div>
                <div className="flex items-start gap-x-2">
                    <span>Review: </span>
                    {isReviewOverflow ? (
                        <div className="h-fit relative">
                            {seeMoreEnabled && <div style={gradientToBottom} className="w-full h-4 absolute top-0"></div>}
                            <p className="h-40 sm:h-fit sm:max-h-20 overflow-y-auto text-[0.938rem] md:pr-4 thin-scrollbar">
                                {modifiedReview}
                                {seeMoreEnabled ? (
                                    <span onClick={handleSeeLess} className="text-blue-600 cursor-pointer ml-1">
                                        See Less
                                    </span>
                                ) : (
                                    <span onClick={handleSeeMore} className="text-blue-600 cursor-pointer ml-1">
                                        See More
                                    </span>
                                )}
                            </p>
                            {seeMoreEnabled && <div style={gradientToTop} className="w-full h-[0.375rem] absolute bottom-0"></div>}
                        </div>
                    ) : (
                        <p className="h-40 sm:h-fit sm:max-h-20 text-[0.938rem] md:pr-4">
                            {review}
                        </p>
                    )}
                </div>
            </article>
        </div>
    )
}

export default CourseReviews;