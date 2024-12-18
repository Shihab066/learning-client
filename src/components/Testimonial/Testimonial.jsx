import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllFeedback } from "../../services/feedbackService";
import generateImageLink from "../../utils/generateImageLink";

const Testimonial = () => {

    // Slider settings
    const settings = {
        infinite: true,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '10px',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 575,
                settings: {
                    autoplay: false,
                    slidesToShow: 1,
                    centerMode: false,
                    dots: true
                }
            }
        ]
    };

    const { data: testimonials = [] } = useQuery({
        queryKey: ['testimonials'],
        queryFn: () => getAllFeedback()
    });

    const handlePrevBtn = () => {
        const prevButton = document.querySelector('.slick-prev');
        if (prevButton) prevButton.click();
    };

    const handleNextBtn = () => {
        const nextButton = document.querySelector('.slick-next');
        if (nextButton) nextButton.click();
    };

    return (
        <div className="w-full bg-gray-50 py-20 lg::py-32 2xl:px-4 mt-20">
            <div className="lg-container">
                {/* Header Section */}
                <div className="flex justify-between px-4 md:px-8 2xl:px-4">
                    <h3 className="text-xl sm:text-2xl font-semibold">
                        What Our Customers Say<br />About Us
                    </h3>
                    {/* Prev and Next Buttons */}
                    <div className="hidden sm:flex gap-3">
                        <PrevButton handlePrevBtn={handlePrevBtn} />
                        <NextButton handleNextBtn={handleNextBtn} />
                    </div>
                </div>

                {/* Slider Section */}
                <div className="slider-container mt-10 px-2 sm:px-0 md:px-2 xl:px-0">
                    <Slider {...settings}>
                        {testimonials?.map((item, index) => (
                            <TestimonialCard key={index} item={item} />
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

const PrevButton = ({ handlePrevBtn }) => (
    <div onClick={handlePrevBtn} className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-10 rounded-lg flex justify-center items-center cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
    </div>
);

const NextButton = ({ handleNextBtn }) => (
    <div onClick={handleNextBtn} className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-10 rounded-lg flex justify-center items-center cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
    </div>
);

// TestimonialCard Component
const TestimonialCard = ({ item }) => {
    const { name, headline, profileImage, feedback } = item;

    const isFeedbackOverflow = feedback.length > 200;
    const [modifiedFeedback, setModifiedFeedback] = useState(feedback.slice(0, 190) + '...');
    const [seeMoreEnabled, setSeeMoreEnabled] = useState(true);

    const handleSeeMore = () => {
        setModifiedFeedback(feedback);
        setSeeMoreEnabled(false);
    };

    const handleSeeLess = () => {
        setModifiedFeedback(feedback.slice(0, 190) + '...');
        setSeeMoreEnabled(true);
    };

    const gradientToBottom = {
        background: 'linear-gradient(to bottom, rgba(255,255,255, 1), rgba(255,255,255, 0))'
    };

    const gradientToTop = {
        background: 'linear-gradient(to top, rgba(255,255,255, 1), rgba(255,255,255, 0))'
    };

    return (
        <div className="sm:w-[95%] 2xl:w-[26rem] sm:h-[18.5rem] lg:h-[20rem] xl:h-[17rem] bg-white rounded-2xl py-4 md:py-6 space-y-2 border border-[#E2E8F0]">
            {/* Quote Icon */}
            <div className="text-blue-500 px-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621c.537-.278 1.24-.375 1.929-.311c1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5a3.87 3.87 0 0 1-2.748-1.179m10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621c.537-.278 1.24-.375 1.929-.311c1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5a3.87 3.87 0 0 1-2.748-1.179"></path>
                </svg>
            </div>

            {/* Feedback Text */}
            {isFeedbackOverflow ? (
                <div className="w-full h-fit relative">
                    {!seeMoreEnabled && <div style={gradientToBottom} className="w-full h-4 absolute top-0"></div>}
                    <p className="h-36 sm:h-36 md:h-32 lg:h-36 xl:h-[6.5rem] overflow-y-auto text-[0.938rem] sm:text-sm md:text-[0.938rem] px-4 md:px-6 thin-scrollbar">
                        {modifiedFeedback}
                        {seeMoreEnabled ? (
                            <span onClick={handleSeeMore} className="text-blue-600 cursor-pointer ml-1">
                                See more
                            </span>
                        ) : (
                            <span onClick={handleSeeLess} className="text-blue-600 cursor-pointer ml-1">
                                See less
                            </span>
                        )}
                    </p>
                    {!seeMoreEnabled && <div style={gradientToTop} className="w-full h-[0.375rem] absolute bottom-0"></div>}
                </div>
            ) : (
                <p className="h-36 sm:h-36 md:h-32 lg:h-36 xl:h-[6.5rem] text-[0.938rem] sm:text-sm md:text-[0.938rem] px-4 md:px-6">
                    {feedback}
                </p>
            )}

            {/* Profile Information */}
            <div className="w-full flex justify-start items-center gap-3 px-4 md:px-6">
                <img
                    src={generateImageLink({imageId: profileImage, width: 60, aspectRatio: 1.0, cropMode: 'fill'})}
                    alt="user profile"
                    className="w-[3.75rem] h-[3.75rem] sm:w-12 sm:h-12 md:w-[3.75rem] md:h-[3.75rem] object-cover rounded-full"
                />
                <div className="w-[calc(100%-6rem)]">
                    <h4 className="sm:text-sm md:text-lg font-semibold truncate" title={name?.length > 30 ? name : ''}>
                        {name}
                    </h4>
                    <p className="text-sm sm:text-[.75rem] md:text-sm text-gray-700 truncate" title={headline?.length > 30 ? headline : ''}>
                        {headline}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Testimonial;
