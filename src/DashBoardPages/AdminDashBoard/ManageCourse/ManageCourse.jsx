import { useRef, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import searchIcon from '../../../assets/icon/search_icon.svg';
import Loading from "../../../components/Loading/Loading";
import generateImageLink from "../../../utils/generateImageLink";
import formatDate from "../../../utils/formatDate";
import Swal from "sweetalert2";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import EmptyPage from "../../../components/EmptyPage/EmptyPage";
import EditIcon from "../../../components/Icons/EditIcon";
import TickCircle from "../../../components/Icons/TickCircle";
import CloseCircle from "../../../components/Icons/CloseCircle";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";

const ManageCourse = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const [feedbackData, setFeedbackData] = useState(null);
    const [limit, setLimit] = useState(10);
    const [searchValue, setSearchValue] = useState("");

    // Fetch courses with useQuery
    const { data, isLoading, refetch: refetchAllCourses } = useQuery({
        queryKey: ["fetch-courses-by-admin", limit, searchValue],
        enabled: !!user,
        queryFn: async () => {
            const response = await axiosSecure.get(
                `/course/all/admin?limit=${limit}&search=${searchValue}`
            );
            return response.data;
        },
    });

    // Handle search form submission
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchValue(event.target.search.value);
    };

    // Handle course status update
    const handleCourseStatus = (courseInfo) => {
        const { _id: courseId, status, currentStatus } = courseInfo;

        if (status === currentStatus) return;

        Swal.fire({
            title: "Are you sure?",
            text: `${status === "approved" ? "Approve" : "Deny"} this course?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#000",
            cancelButtonColor: "#d33",
            confirmButtonText: `${status === "approved" ? "Approve" : "Deny"}`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await axiosSecure.patch(
                    `/course/status/${courseId}`,
                    { status }
                );

                if (response.data.modifiedCount) {
                    toastSuccess("Course status updated");
                    refetchAllCourses();
                }
            }
        });
    };

    return (
        <div className="mt-6 xl:mt-0">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between gap-y-2 border-b pb-2">
                <h2 className="text-lg font-bold">Manage Courses</h2>
                <form
                    onSubmit={handleSearchSubmit}
                    className="relative sm:w-[18rem] h-fit"
                >
                    <input
                        name="search"
                        type="text"
                        autoComplete="off"
                        placeholder="Search Course"
                        className="w-full py-1.5 pl-2 pr-10 border rounded-md focus:outline-none"
                    />
                    <button type="submit">
                        <img
                            className="absolute w-6 right-2 top-1/2 -translate-y-1/2"
                            src={searchIcon}
                            alt="search icon"
                        />
                    </button>
                </form>
            </div>

            {/* Data Section */}
            {isLoading ? (
                <Loading />
            ) : data?.courses?.length > 0 ? (
                <>
                    <table className="table">
                        {/* Table Head */}
                        <thead className="hidden md:table-header-group">
                            <tr>
                                <th className="w-[40%]">Course</th>
                                <th className="lg:min-w-[120px]">Created at</th>
                                <th>Price</th>
                                <th>Details</th>
                                <th className="lg:min-w-[120px]">Status</th>
                                <th className="2xl:min-w-[170px]">Actions</th>
                                <th>
                                    <span className="md:hidden lg:block">
                                        Feedback
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.courses.map((courseData, index) => (
                                <CourseRow
                                    key={index}
                                    courseData={courseData}
                                    setFeedbackData={setFeedbackData}
                                    handleCourseStatus={handleCourseStatus}
                                />
                            ))}
                        </tbody>
                    </table>

                    {/* Load More Button */}
                    {data?.totalCoursesCount > 10 &&
                        data?.totalCoursesCount !== data?.courses.length && (
                            <button
                                onClick={() => setLimit(limit + 10)}
                                className="px-2.5 py-2 m-4 text-sm font-medium text-gray-600 border border-gray-500 rounded hover:shadow-md duration-300"
                            >
                                View more
                            </button>
                        )}
                </>
            ) : (
                <EmptyPage text="No Data Found" />
            )}

            {/* Feedback Modal */}
            {feedbackData && (
                <FeedbackModal
                    feedbackData={feedbackData}
                    setFeedbackData={setFeedbackData}
                />
            )}
        </div>
    );
};


const CourseRow = ({ courseData, setFeedbackData, handleCourseStatus }) => {
    const navigate = useNavigate();

    // Destructure course data for cleaner code
    const {
        _id,
        courseName,
        courseThumbnail,
        price,
        status,
        instructorName,
        feedback,
        created_at,
    } = courseData;

    // Format the date
    const date = formatDate(created_at);

    return (
        <tr className="flex flex-col md:table-row">
            {/* Course Details */}
            <td className="px-0 sm:px-4">
                <div className="flex items-start gap-3">
                    <div className="avatar">
                        <div className="mask h-12 w-12">
                            <img
                                className="object-cover"
                                src={generateImageLink({ imageId: courseThumbnail, width: 128 })}
                                alt="Course thumbnail"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">{courseName}</div>
                        <div className="text-gray-500">by {instructorName}</div>
                    </div>
                </div>
            </td>

            {/* Created At */}
            <td className="px-0 sm:px-4">
                <div className="flex items-center">
                    <div className="w-[35%] sm:w-[25%] font-medium text-gray-500 md:hidden">
                        Created at
                    </div>
                    <div className="text-gray-500">{date}</div>
                </div>
            </td>

            {/* Price */}
            <td className="px-0 sm:px-4">
                <div className="flex items-center">
                    <div className="w-[35%] sm:w-[25%] font-medium text-gray-500 md:hidden">Price</div>
                    <div className="font-medium text-gray-500">${price}</div>
                </div>
            </td>

            {/* Details Page Link */}
            <td className="px-0 sm:px-4">
                <div className="flex items-center">
                    <div className="w-[35%] sm:w-[25%] font-medium text-gray-500 md:hidden">
                        Details
                    </div>
                    <div
                        onClick={() => navigate(`/course/${_id}`)}
                        className="text-blue-500 cursor-pointer"
                    >
                        View
                    </div>
                </div>
            </td>

            {/* Course Status */}
            <td className="px-0 sm:px-4">
                <div className="flex items-center">
                    <div className="w-[35%] sm:w-[25%] font-medium text-gray-500 md:hidden">
                        Status
                    </div>
                    <div
                        className={`font-medium capitalize ${status === "approved"
                            ? "text-green-600"
                            : status === "pending"
                                ? "text-blue-500"
                                : status === "denied"
                                    ? "text-red-500"
                                    : ""
                            }`}
                    >
                        {status}
                    </div>
                </div>
            </td>

            {/* Actions (Approve/Deny) */}
            <td className="px-0 sm:px-4 select-none order-6 md:order-5">
                <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row xl:flex-col 2xl:flex-row items-start gap-3">
                    <div
                        onClick={() =>
                            handleCourseStatus({ _id, status: "approved", currentStatus: status })
                        }
                        className={`w-full sm:w-fit xl:w-full 2xl:w-fit flex justify-center items-center gap-x-1 bg-green-600 text-white px-1.5 py-1.5 rounded cursor-pointer ${status === "approved" ? "pointer-events-none opacity-50" : ""
                            }`}
                    >
                        <TickCircle />
                        Approve
                    </div>
                    <div
                        onClick={() =>
                            handleCourseStatus({ _id, status: "denied", currentStatus: status })
                        }
                        className={`w-full sm:w-fit md:w-full lg:w-fit xl:w-full 2xl:w-fit flex justify-center items-center gap-x-1 bg-red-600 text-white px-1.5 py-1.5 rounded cursor-pointer ${status === "denied" ? "pointer-events-none opacity-50" : ""
                            }`}
                    >
                        <CloseCircle />
                        Deny
                    </div>
                </div>
            </td>

            {/* Feedback */}
            <td className="px-0 sm:px-4 order-5 md:order-6">
                <div className="flex items-center">
                    <div className="w-[40%] sm:w-[25%] font-medium text-gray-500 md:hidden">
                        Send Feedback
                    </div>
                    <label
                        onClick={() => setFeedbackData({ _id, feedback })}
                        htmlFor="send-feedback-modal"
                        className="w-fit flex text-white bg-black p-1 rounded cursor-pointer md:mx-auto"
                    >
                        <EditIcon />
                    </label>
                </div>
            </td>
        </tr>
    );
};

const FeedbackModal = ({ feedbackData, setFeedbackData }) => {
    const { _id: courseId, feedback } = feedbackData;
    const [axiosSecure] = useAxiosSecure();
    const [newFeedbackData, setNewFeedbackData] = useState(feedback);
    const isSubmitDisabled = newFeedbackData === feedback;
    const closeModalRef = useRef();
    const queryClient = useQueryClient();

    // Handle sending feedback
    const handleSendFeedback = async () => {
        try {
            const response = await axiosSecure.patch(`/course/updatefeedback/${courseId}`, {
                feedback: newFeedbackData,
            });

            if (response.data.modifiedCount) {
                toastSuccess(`Feedback ${feedback ? 'updated' : 'added'} successfully.`);
                closeModalRef.current.click(); // Close the modal
                queryClient.refetchQueries(['fetch-courses-by-admin']); // Refetch the updated data
            }
        } catch (error) {
            toastError('Failed to send feedback. Please try again later.');
        }
    };

    // Reset state and close modal
    const handleCloseModal = () => {
        setNewFeedbackData(feedback);
        setFeedbackData(null);
    };

    return (
        <div>
            {/* Modal Toggle Input */}
            <input type="checkbox" id="send-feedback-modal" className="modal-toggle" />

            {/* Modal Content */}
            <div className="modal overflow-auto" role="dialog" aria-labelledby="feedback-modal-title">
                <div className="modal-box w-11/12 max-w-xl space-y-4 min-h-fit my-auto">

                    {/* Feedback Input Section */}
                    <div>
                        <label htmlFor="feedback-input" className="text-sm font-medium">Feedback</label>
                        <textarea
                            id="feedback-input"
                            rows="10"
                            className="w-full p-4 mt-4 border border-black resize-none focus:outline-none"
                            placeholder="Provide feedback on why the course is denied, suggest updates, or highlight issues with the course content here."
                            value={newFeedbackData}
                            onChange={(e) => setNewFeedbackData(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <PrimaryButton
                            onClick={handleSendFeedback}
                            text="Send"
                            customClass={`${isSubmitDisabled ? 'opacity-50 pointer-events-none' : ''}`}
                        />
                    </div>

                    {/* Close Button */}
                    <div className="modal-action">
                        <label
                            ref={closeModalRef}
                            onClick={handleCloseModal}
                            htmlFor="send-feedback-modal"
                            className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
                            aria-label="Close Feedback Modal"
                        >
                            ✕
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCourse;