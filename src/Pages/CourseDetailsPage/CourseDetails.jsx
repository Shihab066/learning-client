import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import facebookLogo from '../../assets/icon/facebook.png';
import googleLogo from '../../assets/icon/google.png';
import xLogo from '../../assets/icon/x_logo.png';
import whatsappLogo from '../../assets/icon/WhatsApp.svg';
import linkLogo from '../../assets/icon/link.svg';
import awardLogo from '../../assets/icon/award.svg';
import grauationLogo from '../../assets/icon/graduation.svg';
import playLogo from '../../assets/icon/play.svg';
import Testimonial from "../../components/Testimonial/Testimonial";
import { useQuery } from "@tanstack/react-query";
import formatNumberWithCommas from "../../utils/formateNumberWithCommas";
import GenerateStar from "../../components/GenerateStar/GenerateStar";
import generateImageLink from "../../utils/generateImageLink";
import dummyCourseThumbnail from '../../assets/images/dummyCourseThumbnail2.jpg';
import formatTimeWithHours from "../../utils/formatTimeWithHours";
import formateCourseDuration from "../../utils/formateCourseDuration";
import api from "../../services/baseAPI";
import CourseDetailsSkeleton from "./CourseDetailsSkeleton";

const CourseDetails = () => {
    const { courseId } = useParams();
    // Fetch popular courses
    const { data = {}, isLoading: isCourseDetailsLoading } = useQuery({
        queryKey: ['courseDetails'],
        queryFn: async () => {
            const res = await api.get(`/course/details/${courseId}`);
            return res.data;
        },
        cacheTime: 0,
        staleTime: 0
    });

    const { courseThumbnail, courseName, summary, description, level, rating, totalReviews, price, discount, courseContents, _instructorId, name: instructorName, image: instructorImage, headline, totalReviewsCount, totalStudents, totalCoursesCount, totalModules, experience, courseDuration } = data;
    const totalInstructorReviewsWithCommas = formatNumberWithCommas(totalReviewsCount);
    const totalStudentsWithCommas = formatNumberWithCommas(totalStudents);
    const totalCourseDuration = formateCourseDuration(courseDuration || 0);

    // Store the star ratings in state
    const [starTypes, setStarTypes] = useState([]);

    // Calculate the star rating array (full stars, half stars, and empty stars)
    useEffect(() => {
        let newRating = rating;
        const ratingsArr = [];
        for (let i = 0; i < 5; i++) {
            if (newRating > 0 && newRating < 1) {
                ratingsArr.push(parseFloat(newRating.toFixed(1))); // For half-star
                newRating -= newRating;
            } else if (newRating > 0) {
                ratingsArr.push(1); // Full star
                newRating -= 1;
            } else {
                ratingsArr.push(0); // Empty star
            }
        }
        setStarTypes(ratingsArr);
    }, [rating]);

    // link to navigate different section of this page
    const links = [
        { text: 'Description', url: '#description' },
        { text: 'Instructor', url: '#instructor' },
        { text: 'Course Outline', url: '#course_outline' },
        { text: 'Reviews', url: '#reviews' }
    ];

    // State to manage active link
    const [activeLink, setActiveLink] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleClick = (index) => {
        setActiveLink(index);
    };

    const handleImageLoad = () => {
        setIsLoaded(true); // Mark the image as loaded
    };

    if (isCourseDetailsLoading) {
        return <CourseDetailsSkeleton />
    }

    return (
        <>
            <div className="bg-[#F8FAFC]">
                <div className="lg-container px-4 xl:px-6 py-10 space-y-5 relative">
                    {/* Breadcrumb */}
                    <p className="text-gray-900 text-base">
                        <Link to='/courses'>Courses</Link>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="inline">
                            <path fill="currentColor" d="M10.25 16.25a.74.74 0 0 1-.53-.25a.75.75 0 0 1 0-1.06l3-3l-3-3A.75.75 0 0 1 10.78 8l3.5 3.5a.75.75 0 0 1 0 1.06L10.78 16a.74.74 0 0 1-.53.25"></path>
                        </svg>
                        <span className="text-blue-600"> {courseName} </span>
                    </p>

                    {/* Course Title */}
                    <h2 className="w-full lg:w-[65%] xl:w-[50rem] text-gray-900 text-2xl md:text-3xl xl:text-4xl font-bold mt-10">
                        {courseName}
                    </h2>

                    {/* Course Short Description */}
                    <p className="w-full lg:w-[65%] xl:w-[50rem] text-gray-700">
                        {summary}
                    </p>

                    {/* Rating, Duration, and Lectures */}
                    <div className="text-gray-700 font-medium flex flex-wrap justify-start items-center gap-x-2">
                        <p className={`text-[#FEC84B] ${rating ? 'block' : ' hidden'}`}>{rating}</p>
                        <div className="flex">
                            {starTypes.map((starType, index) => <Star key={index} starType={starType} />)}
                        </div>
                        <span>({totalReviews} reviews)</span>
                        <p>|</p>
                        <p className="capitalize">{totalCourseDuration}. {totalModules} Modules.</p>
                        <div className="w-fit rounded-full px-3 py-[.2rem] text-xs bg-yellow-400 text-gray-700 font-medium">
                            {level}
                        </div>
                    </div>

                    {/* Instructor Info */}
                    <div className="flex justify-start items-center gap-x-2">
                        <img
                            className="w-14 h-14 rounded-full object-cover"
                            src={generateImageLink({ imageId: instructorImage, width: 128 })}
                            alt="Instructor profile Image"
                        />
                        <p className="text-gray-700">
                            Created by <Link className="text-blue-600 ml-1" to={`/instructor/${_instructorId}`}>{instructorName}</Link>
                        </p>
                    </div>

                    {/* Language Info */}
                    <div className="text-gray-700 flex justify-start items-center gap-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 0 0 8.7-6.7M12 21a9 9 0 0 1-8.7-6.7M12 21c2.5 0 4.5-4 4.5-9S14.5 3 12 3m0 18c-2.5 0-4.5-4-4.5-9S9.5 3 12 3m0 0A9 9 0 0 1 19.8 7.6M12 3A9 9 0 0 0 4.2 7.6m15.6 0A12 12 0 0 1 12 10.5c-3 0-5.7-1.1-7.8-2.9m15.6 0A9 9 0 0 1 21 12c0 .8-.1 1.5-.3 2.3m0 0A18 18 0 0 1 12 16.5c-3.2 0-6.1-.8-8.7-2.2m0 0A9 9 0 0 1 3 12c0-1.6.4-3.1 1.2-4.4" />
                        </svg>
                        <p>English, Spanish, Italian, German</p>
                    </div>

                    {/* Course Purchase Card */}
                    <div className="lg:w-[30%] xl:w-[25rem] bg-white border border-[#E2E8F0] shadow-[0px_0px_8px_0px] shadow-[#3b82f61f] mt-[50px!important] lg:mt-[0px!important] rounded-2xl lg:absolute right-4 top-0 lg:top-4">
                        <div className="px-4 sm:px-5 pt-4 sm:pt-6 pb-6 sm:pb-4 lg:pb-7 flex justify-between gap-x-4 flex-col sm:flex-row lg:flex-col">
                            {/* Thumbnail */}
                            <figure className="basis-1/2">
                                <img
                                    src={dummyCourseThumbnail}
                                    alt="Placeholder"
                                    id="dummy"
                                    className={`${isLoaded ? 'hidden' : 'block'} rounded-xl`}
                                />
                                <img
                                    className="w-full object-top lg:object-center object-cover rounded-xl"
                                    src={generateImageLink({ imageId: courseThumbnail, width: 500 })}
                                    alt="Course Thumbnail"
                                    onLoad={handleImageLoad}
                                />
                                <div className="hidden sm:flex justify-start items-center gap-x-1 md:gap-x-3 pt-4 lg:hidden">
                                    {/* Social Share */}
                                    <p className="md:font-medium text-gray-900">Share:</p>
                                    <ShareLinks />
                                </div>
                            </figure>

                            {/* Price and Discount */}
                            <div className="basis-1/2 mt-4 sm:mt-0 md:mt-4 xl:mt-8">
                                {discount
                                    ? (
                                        <div className="flex justify-start items-start gap-x-3">
                                            <p className="text-gray-900 text-2xl leading-[1.625rem] font-medium">${(price - (price * (discount / 100))).toFixed(2)}</p>
                                            <p className="text-[#94A3B8] text-lg"><del>${price}</del></p>
                                            <p className="text-green-600 text-xl font-medium">{discount}% Off</p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-900 text-2xl font-medium">${price}</p>
                                    )
                                }

                                <div className="mt-6 space-y-4">
                                    <button className="btn bg-black hover:bg-black text-white w-full capitalize rounded-lg hover:shadow-lg duration-300">
                                        Add To Cart
                                    </button>
                                    <button className="btn bg-white hover:bg-white text-black outline outline-1 w-full capitalize rounded-lg hover:shadow-lg duration-300">
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>

                        <hr className="sm:hidden lg:block" />

                        {/* Share Section */}
                        <div className="px-5 pt-4 pb-6 space-y-2  sm:hidden lg:block">
                            <p className="font-medium text-gray-900">Share</p>
                            <ShareLinks />
                        </div>
                    </div>
                </div>
            </div>

            {/* navigation for different seciton on this page */}
            <div className="lg-container px-4 md:px-6">
                <div className="xl:w-[65%] mr-auto">
                    {/* Navigation Section */}
                    <nav className="mt-6 lg:mt-10">
                        <ul className="flex flex-wrap justify-start items-center gap-2 sm:gap-x-6">
                            {links.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.url}
                                        onClick={() => handleClick(index)}
                                        className={`block py-4 sm:py-[1.125rem] px-2 sm:px-5 text-sm sm:text-base text-gray-900 rounded-lg shadow hover:shadow-md duration-300 ${activeLink === index ? 'bg-[#EFF6FF]' : ''
                                            }`}
                                    >
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Description Section */}
                    <section id="description" className="space-y-6 pt-6">
                        <hr />
                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold text-gray-900">Course Description</h2>
                            <p className="text-gray-700">{description}</p>
                        </div>

                        <div className="space-y-1">
                            <h2 className="text-xl font-semibold text-gray-900">Certification</h2>
                            <p className="text-gray-700">
                                At Learning point, we understand the significance of formal recognition for your hard work and dedication to continuous learning.
                                Upon successful completion of our courses, you will earn a prestigious certification that not only validates your expertise
                                but also opens doors to new opportunities in your chosen field.
                            </p>
                        </div>
                    </section>

                    {/* Instructor Section */}
                    <section id="instructor" className="space-y-6 pt-6 text-gray-700">
                        <hr />
                        <h2 className="text-xl font-semibold text-gray-900">Instructor</h2>
                        <div>
                            <Link to={`/instructor/${_instructorId}`} className="text-lg font-medium text-blue-600">{instructorName}</Link>
                            <p>{headline}</p>
                        </div>
                        <div className="flex items-center gap-5">
                            <img
                                className="w-[5.5rem] h-[5.5rem] sm:w-[6.5rem] sm:h-[6.5rem] md:w-fit md:h-fit rounded-full"
                                src={generateImageLink({ imageId: instructorImage, width: 128, aspectRatio: '1.0', cropMode: 'fill' })}
                                alt="Instructor profile Image"
                            />
                            <ul className="space-y-1">
                                <li className="flex items-center gap-1">
                                    <img className="w-5 h-5" src={awardLogo} alt="Award logo" />
                                    <p>{totalInstructorReviewsWithCommas} Reviews</p>
                                </li>
                                <li className="flex items-center gap-1">
                                    <img className="w-5 h-5" src={grauationLogo} alt="Graduation logo" />
                                    <p>{totalStudentsWithCommas} Students</p>
                                </li>
                                <li className="flex items-center gap-1">
                                    <img className="w-5 h-5" src={playLogo} alt="Play logo" />
                                    <p>{totalCoursesCount} Courses</p>
                                </li>
                            </ul>
                        </div>

                        {/* Instructor Bio */}
                        <p>
                            {experience}
                        </p>
                    </section>

                    {/* Course Outline Section */}
                    <section id="course_outline" className="space-y-6 pt-6">
                        <hr />
                        <h2 className="text-xl font-semibold text-gray-900">Course Outline</h2>
                        <div>
                            <CourseOutline courseInfo={courseContents} />
                        </div>
                        <hr />
                    </section>
                </div>

                {/* Reviews Section */}
                <section id="reviews" className="space-y-6 pt-6">
                    <h2 className="text-xl font-semibold text-gray-900">Learner Reviews</h2>
                    <Reviews courseId={courseId} rating={rating} totalReviews={totalReviews} />
                </section>
            </div>

            <Testimonial />
        </>
    );
};

// Star Component: Displays full, half, or empty stars
const Star = ({ starType }) => {
    return (
        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            {starType === 1 && (
                <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    fill="#FEC84B"
                />

            )}
            {starType > 0 && starType < 1 && (
                <defs>
                    <linearGradient id={`grad-${starType}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset={`${starType * 100}%`} stopColor="#FEC84B" />
                        <stop offset={`${starType * 100}%`} stopColor="#CBD5E1" />
                    </linearGradient>
                </defs>
            )}
            {starType > 0 && starType < 1 && (
                <path fill={`url(#grad-${starType})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            )}
            {starType === 0 && (
                <path
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    fill="#CBD5E1"
                />
            )}
        </svg>
    );
};

// ShareLinks Component: Renders social media share links
const ShareLinks = () => {
    const links = [
        { src: facebookLogo, url: 'https://facebook.com/sharer/sharer.php?u=YOUR_URL_HERE' },
        { src: googleLogo, url: 'https://plus.google.com/share?url=YOUR_URL_HERE' },
        { src: xLogo, url: 'https://twitter.com/intent/tweet?url=YOUR_URL_HERE' },
        { src: whatsappLogo, url: 'https://api.whatsapp.com/send?text=YOUR_URL_HERE' },
        { src: linkLogo, url: 'https://example.com' } // Replace with actual link
    ];

    return (
        <div className="flex justify-start items-center gap-x-2">
            {links.map((link, index) => (
                <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg border border-[#E2E8F0] p-1 md:p-2 hover:shadow-lg duration-300 active:scale-95 cursor-pointer">
                    <img src={link.src} alt={`Social icon ${index}`} className="w-full h-full object-cover" />
                </a>
            ))}
        </div>
    );
};

// CourseOutline Components: Renders Course Outline section
const CourseOutline = ({ courseInfo }) => {
    return (
        <>
            {
                courseInfo?.map((milestone, index) =>
                    <CourseOutlineItem
                        key={index}
                        className={`collapse collapse-arrow duration-300 border rounded-none ${courseInfo?.length === 1 ? 'border rounded-t-md rounded-b-md' : index === 0 ? 'rounded-t-md border-b-0' : index === courseInfo.length - 1 ? 'rounded-b-md border-b' : 'border-b-0'} `}
                        milestoneData={milestone}
                    />
                )
            }
        </>
    )
};

const CourseOutlineItem = ({ className, milestoneData }) => {
    const { milestoneName, milestoneDetails, totalModules, duration } = milestoneData;
    const milestoneDuration = formatTimeWithHours(duration);
    return (
        <div className={className}>
            <input type="checkbox" name="courseOutline" />
            <div className="collapse-title flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-x-4">
                <span className="sm:text-xl text-gray-700 font-medium">
                    {milestoneName}
                </span>
                <span className="text-sm text-gray-900 font-normal">
                    {totalModules} Modules {milestoneDuration}
                </span>
            </div>
            <div className="collapse-content">
                <p>{milestoneDetails}</p>
            </div>
        </div>
    )
};

// Reviews Comoponent: Renders review section 
const Reviews = ({ courseId, rating = 'not rated yet', totalReviews = 0 }) => {
    const [limit, setLimit] = useState(3);
    const totalReviewsWithCommas = formatNumberWithCommas(totalReviews);

    const { data, isLoading } = useQuery({
        queryKey: ['courseReviews', limit],
        queryFn: async () => {
            const res = await api.get(`/review/get/${courseId}?limit=${limit}`);
            return res.data;
        }
    })

    return (
        <div className="flex flex-col md:flex-row justify-between items-start gap-y-6">
            <div className="space-y-4">
                <p className="flex items-center gap-x-3">
                    <span className="flex">
                        <GenerateStar fill={fullStarFill} />
                        <span className="text-lg leading-5 text-gray-900 font-medium">
                            {rating}
                        </span>
                    </span>
                    <span className="text-gray-700 text-sm ">
                        {totalReviewsWithCommas} reviews
                    </span>
                </p>
                <StarRating courseId={courseId} />
            </div>

            <div className="w-full md:basis-[75%] space-y-4">
                {isLoading
                    ?
                    <ReviewsSkeleton />
                    : data?.reviews?.length > 0
                        ?
                        <>
                            {
                                data?.reviews?.map((review, index) =>
                                    <ReviewCard
                                        key={index}
                                        review={review}
                                    />
                                )
                            }
                            {
                                data?.totalReviews > 4 && data?.totalReviews !== data?.reviews.length &&
                                <button onClick={() => setLimit(limit + 4)} className={`btn btn-md capitalize outline outline-1 outline-gray-900  text-sm sm:text-base text-gray-900 font-medium bg-white hover:bg-white hover:shadow-lg duration-300`}>
                                    View more Reviews
                                </button>
                            }
                        </>
                        :
                        <div className="h-[400px] flex items-center justify-center">
                            <p className="text-gray-400 text-lg font-medium">No Reviews Found</p>
                        </div>
                }
            </div>
        </div>
    )
};

const fullStarFill = "#FEC84B";
const emptyStarFill = "#CBD5E1";

const StarRating = ({ courseId }) => {
    const { data: ratingPercentages = {} } = useQuery({
        queryKey: ['ratingPercentages'],
        queryFn: async () => {
            const res = await api.get(`/review/ratings/${courseId}`);
            return res.data;
        }
    })
    return (
        <div className="text-gray-700">
            {/* Full 5 stars */}
            <div className='flex items-center'>
                {[...Array(5)].map((_, i) => (
                    <GenerateStar key={i} fill={fullStarFill} />
                ))}
                <p className="pl-2">{ratingPercentages['5'] || 0}%</p>
            </div>

            {/* 4 full stars and 1 empty star */}
            <div className='flex items-center'>
                {[...Array(4)].map((_, i) => (
                    <GenerateStar key={i} fill={fullStarFill} />
                ))}
                <GenerateStar fill={emptyStarFill} />
                <p className="pl-2">{ratingPercentages['4'] || 0}%</p>
            </div>

            {/* 3 full stars and 2 empty stars */}
            <div className='flex items-center'>
                {[...Array(3)].map((_, i) => (
                    <GenerateStar key={i} fill={fullStarFill} />
                ))}
                {[...Array(2)].map((_, i) => (
                    <GenerateStar key={i} fill={emptyStarFill} />
                ))}
                <p className="pl-2">{ratingPercentages['3'] || 0}%</p>
            </div>

            {/* 2 full stars and 3 empty stars */}
            <div className='flex items-center'>
                {[...Array(2)].map((_, i) => (
                    <GenerateStar key={i} fill={fullStarFill} />
                ))}
                {[...Array(3)].map((_, i) => (
                    <GenerateStar key={i} fill={emptyStarFill} />
                ))}
                <p className="pl-2">{ratingPercentages['2'] || 0}%</p>
            </div>

            {/* 1 full star and 4 empty stars */}
            <div className='flex items-center'>
                <GenerateStar fill={fullStarFill} />
                {[...Array(4)].map((_, i) => (
                    <GenerateStar key={i} fill={emptyStarFill} />
                ))}
                <p className="pl-2">{ratingPercentages['1'] || 0}%</p>
            </div>
        </div>
    );
};

const ReviewCard = ({ review: reviewData }) => {
    const { userName, userImage, rating, date, review } = reviewData;
    const [reviewTextLength, setReviewTextLength] = useState(null);
    const [isReviewOverflow, setIsReviewOverflow] = useState(false);
    const [modifiedReview, setModifiedReview] = useState('');
    const [seeMoreEnabled, setSeeMoreEnabled] = useState(false);


    const handleReviewTextLength = () => {
        const screenSize = window.innerWidth;
        if (screenSize >= 1280) {
            setReviewTextLength(300);
        }
        else if (screenSize >= 1024 && screenSize < 1280) {
            setReviewTextLength(200)
        }
        else if (screenSize >= 768 && screenSize < 1024) {
            setReviewTextLength(230)
        }
        else if (screenSize >= 576 && screenSize < 768) {
            setReviewTextLength(230)
        }
        else if (screenSize >= 0 && screenSize < 576) {
            setReviewTextLength(120)
        }
    };

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
        <div className="p-3 sm:p-4 lg:p-6 rounded-2xl border border-[#E2E8F0] grid grid-cols-1 lg:grid-cols-3 gap-y-3 lg:gap-x-4">
            <div className="flex items-center gap-x-2 h-fit truncate">
                <img
                    className="w-[2.5rem] h-[2.5rem] lg:w-[3.75rem] lg:h-[3.75rem] object-cover rounded-full"
                    src={generateImageLink({ imageId: userImage, width: 128 })}
                    alt="user profile image" />
                <p className="w-[calc(100%-2.5rem-.5rem)] lg:w-[calc(100%-3.75rem-.5rem)] text-gray-900 lg:text-lg font-semibold truncate">{userName}</p>
            </div>

            <div className="space-y-3 text-gray-700 sm:col-span-2">
                <div className="flex justify-start items-center gap-x-2 sm:gap-x-6">
                    <span className="flex items-center gap-x-1 text-gray-900 text-lg font-semibold">
                        <GenerateStar fill={fullStarFill} />
                        {rating}
                    </span>
                    <span className="text-sm">
                        Reviewed on {date}
                    </span>
                </div>
                <div className="h-24 lg:h-28 overflow-y-auto thin-scrollbar pr-1 lg:pr-4 text-sm sm:text-[0.938rem] lg:leading-6">
                    {isReviewOverflow ? (
                        <div className="h-fit relative">
                            {seeMoreEnabled && <div style={gradientToBottom} className="w-full h-4 absolute top-0"></div>}
                            <p className="">
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
                        <p className="">
                            {review}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
};

const ReviewsSkeleton = () => {
    const SkeletonCount = new Array(3).fill(0);
    return (
        <>
            {
                SkeletonCount.map((item, index) => <ReviewsSkeletonCard key={index} />)
            }
        </>
    );
};

const ReviewsSkeletonCard = () => {
    return (
        <div className="w-full h-48 md:h-40 py-6 px-4 lg:p-6 rounded-lg bg-gray-50">
            <div className={`animate-pulse flex flex-col md:flex-row items-start gap-4 lg:gap-x-10`}>
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-gray-300" />
                    <div className="w-20 lg:w-28 h-3 rounded-full bg-gray-300" />
                </div>
                <div className="space-y-2 w-full">
                    <div className="w-[90%] h-3 rounded-full bg-gray-300" />
                    <div className="w-[80%] h-3 rounded-full bg-gray-300" />
                    <div className="w-[75%] h-3 rounded-full bg-gray-300" />
                    <div className="w-[70%] h-3 rounded-full bg-gray-300" />
                </div>
            </div>
        </div>
    );
};


export default CourseDetails;
