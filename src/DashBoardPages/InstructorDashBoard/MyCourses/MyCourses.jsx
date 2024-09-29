import { useEffect, useState } from 'react';
import searchIcon from '../../../assets/icon/search_icon.svg'
import axios from 'axios';
import GenerateDynamicStar from '../../../components/GenerateDynamicStar/GenerateDynamicStar';
import UpdateCourse from './UpdateCourse';
import { Link } from 'react-router-dom';


const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [isUpdateCourseOpen, setIsUpdateCourseOpen] = useState(false);
    // const { courseThumbnail, courseName, shortDescription, fullDescription, rating, totalReviews, courseDuration, totalLectures, price, discount } = courses;
    console.log(courses);

    useEffect(() => {
        axios.get('/src/DashBoardPages/InstructorDashBoard/MyCourses/mycourses.json')
            .then(res => setCourses(res.data));
    }, [])
    return (
        <div className='relative'>
            <div className="space-y-3">
                <h2 className="text-lg font-medium">Courses</h2>
                <div className="w-[18rem] h-fit relative">
                    <input
                        type="text"
                        placeholder="Search Course"
                        className="w-full border py-1.5 rounded-md pl-2 pr-10 focus:outline-none"
                    />
                    {/* search icon */}
                    <button>
                        <img
                            className='w-6 absolute right-2 top-1/2 -translate-y-1/2'
                            src={searchIcon}
                            alt="search icon" />
                    </button>
                </div>
            </div>

            <div className='mt-8'>
                {
                    isUpdateCourseOpen
                        ?
                        <UpdateCourse setIsUpdateCourseOpen={setIsUpdateCourseOpen}/>
                        :
                        <MyCourseCard setIsUpdateCourseOpen={setIsUpdateCourseOpen} />
                }
            </div>

        </div>
    );
};

const MyCourseCard = ({setIsUpdateCourseOpen}) => {
    const price = 105;
    const discount = 0.5;
    const rating = 4.6;
    const totalReviews = 1456;
    return (
        <>
            <div className="lg:w-[30%] xl:w-[20rem] bg-white border border-[#E2E8F0] shadow-[0px_0px_8px_0px] shadow-[#3b82f61f] rounded-2xl">
                <div className="px-4 sm:px-5 pt-4 sm:pt-6 pb-6 sm:pb-4 lg:pb-7 flex justify-between gap-x-4 flex-col sm:flex-row lg:flex-col gap-y-2">
                    {/* Thumbnail */}
                    <figure className="basis-1/2">
                        <img
                            className="w-full h-[10.5rem] md:h-[12.5rem] object-top object-cover rounded-lg"
                            src={'https://i.ibb.co.com/hXCZhdt/thumbnail.jpg'}
                            alt="Course Thumbnail"
                        />
                    </figure>

                    {/* Course Name */}
                    <h2 className='text-lg font-medium'>
                        Introduction to User Experience Design
                    </h2>

                    {/* rating */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-x-4">
                        <GenerateDynamicStar rating={rating} />
                        <span>
                            ({totalReviews} Ratings)
                        </span>
                    </div>

                    {/* Price and Discount */}
                    <div className="basis-1/2">
                        {discount
                            ? (
                                <div className="flex justify-start items-start gap-x-3">
                                    <p className="text-gray-900 text-2xl leading-[1.625rem] font-medium">${(price - (price * discount)).toFixed(1)}</p>
                                    <p className="text-[#94A3B8] text-lg"><del>${price}</del></p>
                                    <p className="text-green-600 text-xl font-medium">{discount * 100}% Off</p>
                                </div>
                            ) : (
                                <p className="text-gray-900 text-2xl font-medium">${price}</p>
                            )
                        }
                    </div>

                    {/* class modificatoin button */}
                    <div className="text-white flex justify-start items-center gap-x-2 mt-3">
                        {/* feedbaack */}
                        <label htmlFor="my-modal-1" className='w-fit border rounded-md px-2 py-1.5 bg-green-600 hover:shadow-lg hover:scale-95 duration-300 cursor-pointer' title='feedback'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6'>
                                <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-7 12h-2v-2h2zm0-4h-2V6h2z"></path>
                            </svg>
                        </label>
                        <FeedbackModal />

                        {/* edit */}
                        <button onClick={() => setIsUpdateCourseOpen(true)} className='w-fit border rounded-md px-2 py-1.5 bg-yellow-600 hover:shadow-lg hover:scale-95 duration-300 cursor-pointer' title='edit'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6'><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
                                <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1"></path><path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3"></path></g>
                            </svg>
                        </button>


                        {/* watch */}
                        <Link to={'/courseDetails'} className='w-fit border rounded-md px-2 py-1.5 bg-blue-600 hover:shadow-lg hover:scale-95 duration-300 cursor-pointer' title='watch'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6'>
                                <path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"></path>
                            </svg>
                        </Link>
                        {/* delete */}
                        <label className='w-fit border rounded-md px-2 py-1.5 bg-red-600 hover:shadow-lg hover:scale-95 duration-300 cursor-pointer' title='delete'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6'>
                                <path fill="currentColor" d="M6.187 8h11.625l-.695 11.125A2 2 0 0 1 15.121 21H8.879a2 2 0 0 1-1.996-1.875zM19 5v2H5V5h3V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1zm-9 0h4V4h-4z"></path>
                            </svg>
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}

const FeedbackModal = () => {
    return (
        <>
            <input type="checkbox" id={`my-modal-1`} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative w-11/12 max-w-5xl text-gray-900">
                    <label htmlFor={`my-modal-1`} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="text-lg font-bold">Feedback</h3>
                    <p className="py-4">{'feedback'}</p>
                </div>
            </div>
        </>
    )
}
export default MyCourses;