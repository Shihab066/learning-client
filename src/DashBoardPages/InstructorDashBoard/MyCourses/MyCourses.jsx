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


const MyCourses = () => {
    const [axiosSecure] = useAxiosSecure();
    const { user, loading } = useAuth();
    const [courseId, setCourseId] = useState('');
    const [isUpdateCourseOpen, setIsUpdateCourseOpen] = useState(false);
    // const { courseThumbnail, courseName, shortDescription, fullDescription, rating, totalReviews, courseDuration, totalLectures, price, discount } = courses;

    // fetch all courses
    const { data: courses = [], refetch, isLoading } = useQuery({
        queryKey: ['courses', user?.uid],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/courses/${user?.uid}`);
            return res.data;
        }
    })

    // change publish status
    const handlePublishStatus = ({ insturctorId, courseId, publishStatus, refetchCourses }) => {
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
                axiosSecure.patch(`/updatePublishStatus?id=${insturctorId}&courseId=${courseId}`, { publish: publishStatus }).then(res => {
                    if (res.data.modifiedCount) {
                        toast('Publish Status Updated');
                        refetchCourses();
                    }
                })
            }
        });
    }

    const deleteCourse = ({ insturctorId, courseId, refetchCourses }) => {
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
                axiosSecure.delete(`/deleteCourse?id=${insturctorId}&courseId=${courseId}`).then(res => {
                    if (res.data.deletedCount) {
                        toast('Course Deleted');
                        refetchCourses();
                    }
                })
            }
        });
    }

    const toast = (message) => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: message,
            showConfirmButton: false,
            timer: 2000
        });
    };
    return (
        <div className='relative pt-14 xl:pt-0'>
            <div className="space-y-3">
                <h2 className="text-lg font-medium">Courses</h2>
                <div className="sm:w-[18rem] h-fit relative">
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
                            refetchCourses={refetch}
                        />
                        :
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {courses.map((course, index) =>
                                <MyCourseCard
                                    key={index}
                                    course={course}
                                    setCourseId={setCourseId}
                                    setIsUpdateCourseOpen={setIsUpdateCourseOpen}
                                    handlePublishStatus={handlePublishStatus}
                                    deleteCourse={deleteCourse}
                                    refetchCourses={refetch}
                                />
                            )}
                        </div>
                }
            </div>

        </div>
    );
};

const MyCourseCard = ({ course, setIsUpdateCourseOpen, setCourseId, handlePublishStatus, deleteCourse, refetchCourses }) => {
    const rating = 4.6;
    const totalReviews = 1456;
    const { _id, _instructorId, courseName, courseThumbnail, price, discount, feedback, level, status, publish } = course;
    return (
        <>
            <div className="w-full xl:w-[18rem] 2xl:w-[20rem] bg-white border border-[#E2E8F0] shadow-[0px_0px_8px_0px] shadow-[#3b82f61f] rounded-2xl justify-self-center">
                <div className="p-4 space-y-2">
                    {/* Thumbnail */}
                    <figure className="basis-1/2">
                        <img
                            className="w-full h-[10.5rem] md:h-[12.5rem] object-top object-cover rounded-lg"
                            src={courseThumbnail}
                            alt="Course Thumbnail"
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
                        <span className={`ml-2 font-medium capitalize ${status === 'pending' ? 'text-blue-600' : status === 'active' ? 'text-green-600' : status === 'reject' ? 'text-red-600' : ''}`}>
                            {status}
                        </span>
                    </p>

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
                        <label htmlFor="my-modal-1" className='w-fit border rounded-md px-2 py-1.5 bg-green-600 hover:shadow-lg hover:scale-95 duration-300 cursor-pointer' title='feedback'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='w-6'>
                                <path fill="currentColor" d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-7 12h-2v-2h2zm0-4h-2V6h2z"></path>
                            </svg>
                        </label>
                        <FeedbackModal feedback={feedback} />

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
                                        refetchCourses
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
                                    refetchCourses
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
            <input type="checkbox" id={`my-modal-1`} className="modal-toggle" />
            <div className="modal">
                <div className="modal-box relative w-11/12 max-w-5xl text-gray-900">
                    <label htmlFor={`my-modal-1`} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    <h3 className="text-lg font-bold">Feedback</h3>
                    <p className="py-4">{feedback}</p>
                </div>
            </div>
        </>
    )
}
export default MyCourses;