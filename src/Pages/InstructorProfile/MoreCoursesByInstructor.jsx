import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import GenerateDynamicStar from "../../components/GenerateDynamicStar/GenerateDynamicStar";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/Loading/Loading";
import { Link } from "react-router-dom";
import generateImageLink from "../../utils/generateImageLink";
import api from "../../services/baseAPI";
import formateCourseDuration from "../../utils/formateCourseDuration";

const MoreCoursesByInstructor = ({ instructorId, instructorName }) => {
    const { data: courses = [], isLoading } = useQuery({
        queryKey: ['moreCourseByInstructor'],
        queryFn: async () => {
            const res = await api.get(`/course/moreCourse/${instructorId}`);
            return res.data;
        }
    })    
    // Slider settings
    const settings = {
        infinite: true,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        slidesToShow: 4,
        // slidesToScroll: 2,
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
                    centerMode: false                    
                }
            }

        ]
    };

    const handlePrevBtn = () => {
        const prevButton = document.querySelector('.slick-prev');
        if (prevButton) prevButton.click();
    };

    const handleNextBtn = () => {
        const nextButton = document.querySelector('.slick-next');
        if (nextButton) nextButton.click();
    };

    return (
        <>
            {
                isLoading
                    ?
                    <Loading />
                    :
                    <div className="w-full bg-gray-50 py-20 2xl:px-4 mt-20">
                        <div className="lg-container">
                            {/* Header Section */}
                            <div className="flex justify-between px-4 md:px-6 2xl:px-4">
                                <h3 className="text-xl sm:text-2xl font-semibold">
                                    More Courses By&nbsp;
                                    <TextWithBr
                                        text={instructorName}
                                    />
                                    {/* <span className="text-blue-600">
                        </span> */}
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
                                    {courses.map(item => (
                                        <CourseCard key={item._id} item={item} instructorName={instructorName} />
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
};

// This function will take a text and return the text with a new line break added after the first word.
const TextWithBr = ({ text }) => {
    const title = text.split(' ');
    if (title.length > 1) {
        title.splice(1, 0, '\n')
    }
    const text1 = title[0];
    const text2 = title.slice(1).join('');

    return (
        <pre className="inline font-sans text-blue-600">
            <span>{text1}</span>
            <span>{text2}</span>
        </pre>

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
const CourseCard = ({ item, instructorName }) => {
    const { _id, courseName, courseThumbnail, level, rating, totalReviews, courseDuration, totalModules, price, discount } = item;
    const modifiedCourseName = courseName?.length > 50 ? courseName.slice(0, 45) + '...' : courseName;
    const totalCourseDuration = formateCourseDuration(courseDuration || 0);
    return (
        <Link to={`/course/${_id}`}>
            <div className="sm:w-[95%] h-fit bg-white rounded-2xl p-3 lg:p-4 space-y-2 border border-[#E2E8F0] text-gray-700 mx-1 sm:mx-0">
                <img
                    className="w-full h-40 object-cover object-top rounded-lg"
                    src={generateImageLink({ imageId: courseThumbnail, width: '400', height: '225', cropMode: 'fill', aspactRatio: '16:9' })}
                    alt="course thumbnail"
                />
                <h3 className="h-14 lg:text-lg font-medium" title={courseName}>
                    {modifiedCourseName}
                </h3>
                <p className="truncate">
                    By {instructorName}
                </p>
                <div className="w-fit rounded-full px-3 py-[.2rem] text-xs bg-yellow-400 text-gray-700 font-medium">
                    {level}
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center gap-x-4">
                    <GenerateDynamicStar rating={rating} />
                    <span>
                        ({totalReviews} Ratings)
                    </span>
                </div>
                <p>{totalCourseDuration}. {totalModules} Modules.</p>
                <div>
                    {discount > 0
                        ? (
                            <div className="flex justify-start items-start gap-x-3">
                                <p className="text-gray-900 text-2xl leading-[1.625rem] font-medium">${(price - (price * (discount / 100))).toFixed(1)}</p>
                                <p className="text-[#94A3B8] text-lg"><del>${price}</del></p>
                                <p className="badge badge-accent my-auto">{discount}% Off</p>
                            </div>
                        ) : (
                            <p className="text-gray-900 text-2xl font-medium">${price}</p>
                        )
                    }
                </div>
            </div>
        </Link>
    );
};

export default MoreCoursesByInstructor;
