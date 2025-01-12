import { useState } from 'react';
import searchIcon from '../../../assets/icon/search_icon.svg'
import GenerateDynamicStar from '../../../components/GenerateDynamicStar/GenerateDynamicStar';
import UpdateCourse from './UpdateCourse';
import { Link } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../../components/Loading/Loading';
import Swal from 'sweetalert2';
import generateImageLink from '../../../utils/generateImageLink';
import dummyCourseThumbnail from '../../../assets/images/dummyCourseThumbnail2.jpg';
import { toastSuccess } from '../../../utils/toastUtils';


const MyCourses = () => {
    const [axiosSecure] = useAxiosSecure();
    const { user, loading } = useAuth();
    const [courseId, setCourseId] = useState('');
    const [isUpdateCourseOpen, setIsUpdateCourseOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [currentFeedback, setCurrentFeedback] = useState(null);

    // fetch all courses
    const { data: courses = [], refetch: refetchCourses, isLoading } = useQuery({
        queryKey: ['courses', user?.uid, searchValue],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/course/instructorCourses/${user?.uid}?search=${searchValue}`);
            return res.data;
        }
    });

    // handleSearch
    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchValue(e.target.search.value);
    };

    // change publish status
    const handlePublishStatus = ({ insturctorId, courseId, publishStatus }) => {
        const confirmBtnText = publishStatus ? 'Publish' : 'Unpublish';
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: confirmBtnText
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.patch(`/course/updatePublishStatus?id=${insturctorId}&courseId=${courseId}`, { publish: publishStatus }).then(res => {
                    if (res.data.result.modifiedCount) {
                        toastSuccess('Publish Status Updated');
                        refetchCourses();
                    }
                })
            }
        });
    };

    const changeFeedbackReadStatus = async (courseId, isFeedbackRead) => {
        if (isFeedbackRead) return;
        const res = await axiosSecure.patch(`/course/updateFeedbackReadStatus/${courseId}`, { readStatus: true });
        if (res.data.modifiedCount) {
            refetchCourses();
        }
    }

    const handleFeedbackView = async (courseId, isFeedbackRead, feedback) => {
        setCurrentFeedback(feedback);
        changeFeedbackReadStatus(courseId, isFeedbackRead);
    }
    const deleteCourse = ({ insturctorId, courseId }) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/course/delete?id=${insturctorId}&courseId=${courseId}`).then(res => {
                    if (res.data.result.deletedCount) {
                        toastSuccess('Course Deleted');
                        refetchCourses();
                    }
                })
            }
        });
    };

    return (
        <>
            <div className='relative pt-14 xl:pt-0'>
                <div className="space-y-3">
                    <h2 className="text-lg font-medium">Courses</h2>
                    <form onSubmit={handleSubmit} className="sm:w-[18rem] h-fit relative">
                        <input
                            autoComplete='off'
                            name='search'
                            type="text"
                            placeholder="Search Course"
                            className="w-full border py-1.5 rounded-md pl-2 pr-10 focus:outline-none"
                        />
                        {/* search icon */}
                        <button type='submit'>
                            <img
                                className='w-6 absolute right-2 top-1/2 -translate-y-1/2'
                                src={searchIcon}
                                alt="search icon" />
                        </button>
                    </form>
                </div>

                <div className='mt-8'>
                    {isLoading
                        ?
                        <Loading />
                        :
                        isUpdateCourseOpen
                            ?
                            <UpdateCourse
                                setIsUpdateCourseOpen={setIsUpdateCourseOpen}
                                courseId={courseId}
                                setCourseId={setCourseId}
                                refetchCourses={refetchCourses}
                            />
                            :
                            <>
                                {courses.length > 0 ?
                                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 xl:px-2'>
                                        {courses.map((course, index) =>
                                            <MyCourseCard
                                                key={index}
                                                course={course}
                                                setCourseId={setCourseId}
                                                setIsUpdateCourseOpen={setIsUpdateCourseOpen}
                                                handlePublishStatus={handlePublishStatus}
                                                deleteCourse={deleteCourse}
                                                handleFeedbackView={handleFeedbackView}
                                            />
                                        )}
                                    </div>
                                    :
                                    <div className="h-[500px] flex items-center justify-center">
                                        <p className="text-gray-400 text-lg font-medium">No Courses Found</p>
                                    </div>
                                }
                            </>
                    }
                </div>
            </div>

            {
                currentFeedback !== null &&
                <FeedbackModal feedback={currentFeedback} />
            }
        </>
    );
};

const MyCourseCard = ({ course, setIsUpdateCourseOpen, setCourseId, handlePublishStatus, deleteCourse, handleFeedbackView }) => {
    const { _id, _instructorId, courseName, courseThumbnail, price, discount, feedback, level, status, publish, rating, totalReviews, isFeedbackRead } = course;
    const [isLoaded, setIsLoaded] = useState(false);
    const handleImageLoad = () => {
        setIsLoaded(true); // Mark the image as loaded
    };

    return (
        <>
            <div className="w-full xl:w-[18rem] 2xl:w-[20rem] bg-white border border-[#E2E8F0] shadow-[0px_0px_8px_0px] shadow-[#3b82f61f] rounded-2xl justify-self-center">
                <div className="p-3 lg:p-4 space-y-2">
                    {/* Thumbnail */}
                    <figure className="basis-1/2">
                        <img
                            src={dummyCourseThumbnail}
                            alt="Placeholder"
                            id="dummy"
                            className={`${isLoaded ? 'hidden' : 'block rounded-md'}`}
                        />
                        <img
                            className={`w-full object-cover ${isLoaded ? 'block rounded-md' : 'hidden'}`}
                            src={generateImageLink({ imageId: courseThumbnail, width: '400', height: '225', cropMode: 'fill', aspactRatio: '16:9' })}
                            alt="course thumbnail"
                            onLoad={handleImageLoad}
                        />
                    </figure>

                    {/* Course Name */}
                    <h2 className='text-lg font-medium truncate' title={courseName}>
                        {courseName}
                    </h2>

                    {/* level */}
                    <p className='badge badge-neutral capitalize'>
                        {level}
                    </p>

                    {/* status */}
                    <p>
                        Status:
                        <span className={`ml-2 font-medium capitalize ${status === 'pending' ? 'text-blue-600' : status === 'approved' ? 'text-green-600' : status === 'denied' ? 'text-red-600' : ''}`}>
                            {status}
                        </span>
                    </p>

                    {/* rating */}
                    <div className="flex flex-col lg:flex-row lg:items-center gap-x-4">
                        <div className='flex items-center gap-x-1'>
                            {
                                rating
                                    ?
                                    <span className='font-medium text-gray-700'>
                                        {rating}
                                    </span>
                                    :
                                    ''
                            }
                            <GenerateDynamicStar rating={rating} />
                        </div>
                        <span>
                            ({totalReviews} Ratings)
                        </span>
                    </div>

                    {/* Price and Discount */}
                    <div className="basis-1/2">
                        {discount
                            ? (
                                <div className="flex justify-start items-start gap-x-3">
                                    {
                                        discount < 100
                                            ?
                                            <p className="text-gray-900 text-2xl leading-[1.625rem] font-medium">${(price - (price * (discount / 100))).toFixed(2)}</p>
                                            :
                                            <p className="text-gray-900 text-2xl leading-[1.625rem] font-medium">Free</p>
                                    }
                                    <p className="text-[#94A3B8] text-lg"><del>${price}</del></p>
                                    <p className="text-green-600 text-xl font-medium">{discount}% Off</p>
                                </div>
                            ) : (
                                <p className="text-gray-900 text-2xl font-medium">${price}</p>
                            )
                        }
                    </div>

                    {/* class modificatoin button */}
                    <div className="text-white flex justify-start items-center gap-x-2 mt-[20px!important]">
                        {/* feedbaack */}
                        <label onClick={() => { handleFeedbackView(_id, isFeedbackRead, feedback) }} htmlFor="feedback-view-modal" className='relative w-fit border rounded-md px-2 py-1.5 bg-black hover:shadow-lg hover:scale-95 duration-300 cursor-pointer' title='feedback'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6'>
                                <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-7 12h-2v-2h2zm0-4h-2V6h2z"></path>
                            </svg>
                            {feedback && !isFeedbackRead &&
                                <>
                                    <div className={`w-3 h-3 rounded-full bg-sky-400 opacity-75 absolute -right-1 -top-1 animate-ping`}></div>
                                    <div className={`w-3 h-3 rounded-full bg-sky-500 absolute -right-1 -top-1`}></div>
                                </>
                            }
                        </label>

                        {/* edit */}
                        <button
                            onClick={() => {
                                setIsUpdateCourseOpen(true)
                                setCourseId(`id=${_instructorId}&courseId=${_id}`)
                            }}
                            className='w-fit border rounded-md px-2 py-1.5 bg-yellow-600 hover:shadow-lg hover:scale-95 duration-300 cursor-pointer' title='edit'>
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
                        <label
                            onClick={() => {
                                deleteCourse(
                                    {
                                        insturctorId: _instructorId,
                                        courseId: _id,
                                    }
                                )
                            }}
                            className='w-fit border rounded-md px-2 py-1.5 bg-red-600 hover:shadow-lg hover:scale-95 duration-300 cursor-pointer' title='delete'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6'>
                                <path fill="currentColor" d="M6.187 8h11.625l-.695 11.125A2 2 0 0 1 15.121 21H8.879a2 2 0 0 1-1.996-1.875zM19 5v2H5V5h3V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1zm-9 0h4V4h-4z"></path>
                            </svg>
                        </label>
                    </div>

                    {/* course publish control */}
                    <button
                        onClick={() => {
                            handlePublishStatus(
                                {
                                    insturctorId: _instructorId,
                                    courseId: _id,
                                    publishStatus: !publish,
                                }
                            )
                        }
                        }
                        className='btn text-white bg-black hover:bg-black hover:shadow-lg duration-300 capitalize'>
                        {publish ? 'Unpublish' : 'Publish'}
                    </button>
                </div>
            </div>
        </>
    )
}

const FeedbackModal = ({ feedback }) => {
    return (
        <>
            <input type="checkbox" id={`feedback-view-modal`} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative w-11/12 max-w-2xl text-gray-900">
                    <label htmlFor={`feedback-view-modal`} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="text-lg font-bold">Feedback</h3>
                    <textarea
                        className='w-full resize-none border border-black focus:outline-none p-4 mt-2'
                        rows="10"
                        value={feedback}
                        placeholder='No feedback found'
                        disabled
                    />
                </div>
            </div>
        </>
    )
}
export default MyCourses;