import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useState, useEffect } from "react";
import axios from "axios";
import GenerateDynamicStar from "../../components/GenerateDynamicStar/GenerateDynamicStar";

const MoreCoursesByInstructor = () => {
    const [coursesData, setCoursesData] = useState([]);

    // Slider settings
    const settings = {
        infinite: true,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '10px',
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                    centerMode: false,
                    dots: true
                }
            }

        ]
    };

    useEffect(() => {
        axios.get('/src/Pages/InstructorProfile/MoreCourses.json')
            .then(res => setCoursesData(res.data));
    }, []);

    const handlePrevBtn = () => {
        const prevButton = document.querySelector('.slick-prev');
        if (prevButton) prevButton.click();
    };

    const handleNextBtn = () => {
        const nextButton = document.querySelector('.slick-next');
        if (nextButton) nextButton.click();
    };

    return (
        <div className="w-full bg-gray-50 py-20 2xl:px-4 mt-20">
            <div className="lg-container">
                {/* Header Section */}
                <div className="flex justify-between px-4 md:px-6 2xl:px-4">
                    <h3 className="text-xl sm:text-2xl font-semibold">
                        More Courses By&nbsp;
                        <span className="text-blue-600">
                            Ronald <br /> Richards
                        </span>
                    </h3>
                    {/* Prev and Next Buttons */}
                    <div className="hidden sm:flex gap-3">
                        <PrevButton handlePrevBtn={handlePrevBtn} />
                        <NextButton handleNextBtn={handleNextBtn} />
                    </div>
                </div>

                {/* Slider Section */}
                <div className="slider-container mt-10 px-2 sm:px-0 md:px-2 xl:px-2">
                    <Slider {...settings}>
                        {coursesData.map(item => (
                            <CourseCard key={item._id} item={item} />
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

// Courses Card Component
const CourseCard = ({ item }) => {
    const { courseName, courseThumbnail, instructorName, rating, totalReviews, courseDuration, totalLectures, price, discount } = item;
    const modifiedCourseName = courseName?.length > 50 ? courseName.slice(0, 45) + '...' : courseName;
    console.log(modifiedCourseName);


    return (
        <div className="sm:w-[95%] h-[25.5rem] lg:h-[25rem] bg-white rounded-2xl p-3 lg:p-4 space-y-2 border border-[#E2E8F0] text-gray-700 mx-1 sm:mx-0">
            <img
                className="w-full h-40 object-cover object-top rounded-lg"
                src={courseThumbnail}
                alt="course thumbnail"
            />
            <h3 className="h-14 lg:text-lg font-medium" title={courseName}>
                {modifiedCourseName}
            </h3>
            <div className="flex flex-col lg:flex-row lg:items-center gap-x-4">
                <GenerateDynamicStar rating={rating} />
                <span>
                    ({totalReviews} Ratings)
                </span>
            </div>
            <p className="truncate">
                By {instructorName}
            </p>
            <p>{courseDuration} Total Hours. {totalLectures} Lectures.</p>
            <div>
                {discount > 0
                    ? (
                        <div className="flex justify-start items-start gap-x-3">
                            <p className="text-gray-900 text-2xl leading-[1.625rem] font-medium">${(price - (price * discount)).toFixed(1)}</p>
                            <p className="text-[#94A3B8] text-lg"><del>${price}</del></p>
                            <p className="badge badge-accent my-auto">{discount * 100}% Off</p>
                        </div>
                    ) : (
                        <p className="text-gray-900 text-2xl font-medium">${price}</p>
                    )
                }
            </div>
        </div>
    );
};

export default MoreCoursesByInstructor;
