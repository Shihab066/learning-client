import { useEffect, useState } from "react";
import GenerateDynamicStar from "../../../components/GenerateDynamicStar/GenerateDynamicStar";

const CourseReviews = () => {
    const reviews = [
        {
            id: 'ggasdgsad4g6d4gag4a65g46',
            userName: "Jhon Doe jhon ddflsf kfdaslfkas",
            userImage: "https://i.ibb.co.com/kGv0Tm3/8dea41640a5ab81ddcbcee903ed2450e.jpg",
            courseName: 'Beginners Guide to Design ',
            rating: 4,
            review: 'I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.'
        },
        {
            id: 'ggasdgsad4dgfggag4a65g46',
            userName: "Jhon Doe",
            userImage: "https://i.ibb.co.com/kGv0Tm3/8dea41640a5ab81ddcbcee903ed2450e.jpg",
            courseName: 'Beginners Guide to Design',
            rating: 4,
            review: 'I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.'
        },
        {
            id: 'gghghgfdgsad4g6d4gag4a65g46',
            userName: "Jhon Doe",
            userImage: "https://i.ibb.co.com/kGv0Tm3/8dea41640a5ab81ddcbcee903ed2450e.jpg",
            courseName: 'Beginners Guide to Design',
            rating: 4,
            review: 'I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.'
        },
        {
            id: 'hgfdgsad4g6dfsdffa4gag4a65g46',
            userName: "Jhon Doe",
            userImage: "https://i.ibb.co.com/kGv0Tm3/8dea41640a5ab81ddcbcee903ed2450e.jpg",
            courseName: 'Beginners Guide to Design',
            rating: 4,
            review: 'I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding. I was initially apprehensive, having no prior design experience. But the instructor, John Doe, did an amazing job of breaking down complex concepts into easily digestible modules. The video lectures were engaging, and the real-world examples really helped solidify my understanding.'
        }
    ]

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-medium">Reviews</h2>
            <div className="space-y-4">
                {
                    reviews?.map((reviewData, index) =>
                        <CourseReviewCard
                            key={index}
                            reviewData={reviewData}
                        />
                    )
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
    console.log(reviewTextLength);
    

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
    }, [window.innerWidth])

    useEffect(() => {
        setIsReviewOverflow(review.length > reviewTextLength);
        setModifiedReview(review.slice(0, reviewTextLength) + '...')
    }, [reviewTextLength])
    return (
        <div className="w-full space-y-2 border  px-4 py-4 rounded-xl">
            {/* reviewer info */}
            <article className="flex justify-start items-center gap-x-3">
                <figure>
                    <img
                        className="w-12 h-12 rounded-full object-cover"
                        src={userImage}
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
                            <p className="h-40 sm:h-20 overflow-y-auto text-[0.938rem] md:pr-4 thin-scrollbar">
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
                        <p className="h-40 sm:h-20 text-[0.938rem] md:pr-4">
                            {review}
                        </p>
                    )}
                </div>
            </article>
        </div>
    )
}

export default CourseReviews;