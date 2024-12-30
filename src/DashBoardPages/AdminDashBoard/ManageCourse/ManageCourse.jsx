
import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import searchIcon from '../../../assets/icon/search_icon.svg';
import Loading from "../../../components/Loading/Loading";
import generateImageLink from "../../../utils/generateImageLink";
import formatDate from "../../../utils/formatDate";
import SecondaryButton from "../../../components/Buttons/SecondaryButton";
import Swal from "sweetalert2";
import { toastSuccess } from "../../../utils/toastUtils";
import EmptyPage from "../../../components/EmptyPage/EmptyPage";
import EditIcon from "../../../components/Icons/EditIcon";
import TickCircle from "../../../components/Icons/TickCircle";
import CloseIcon from "../../../components/Icons/CloseIcon";
import CloseCircle from "../../../components/Icons/CloseCircle";
import { useNavigate } from "react-router-dom";

const ManageCourse = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const [suspensionDetails, setSuspensionDetails] = useState(null);
    const [limit, setLimit] = useState(10);
    const [searchValue, setSearchValue] = useState("");

    const { data, isLoading, refetch: refetchAllCourses } = useQuery({
        queryKey: ["fetch-all-courses", limit, searchValue],
        enabled: !!user,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `http://localhost:5000/api/v1/course/all/admin?limit=${limit}&search=${searchValue}`
            );
            return res.data;
        },
    });

    console.log(data);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchValue(e.target.search.value);
    };

    const handleCourseStatus = (courseInfo) => {
        const { _id: courseId, status } = courseInfo;
        Swal.fire({
            title: "Are you sure?",
            text: `${status === 'approved' ? 'Approve' : 'Deny'} this course?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#000",
            cancelButtonColor: "#d33",
            confirmButtonText: `${status === 'approved' ? 'Approve' : 'Deny'}`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.patch(
                    `/course/status/${courseId}`, { status }
                );
                if (res.data.modifiedCount) {
                    toastSuccess("Course status update successfully");
                    refetchAllCourses();
                }
            }
        });
    }

    return (
        <>
            <div className="mt-6 xl:mt-0">
                {/* Header Section */}
                <div className="border-b pb-2 flex flex-col sm:flex-row justify-between gap-y-2">
                    <h2 className="text-lg font-bold">Manage Courses</h2>
                    <form
                        onSubmit={handleSearchSubmit}
                        className="sm:w-[18rem] h-fit relative"
                    >
                        <input
                            autoComplete="off"
                            name="search"
                            type="text"
                            placeholder="Search Course"
                            className="w-full py-1.5 pl-2 pr-10 border rounded-md focus:outline-none"
                        />
                        {/* Search Icon */}
                        <button type="submit">
                            <img
                                className="w-6 absolute right-2 top-1/2 -translate-y-1/2"
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
                            <thead className="hidden lg:table-header-group">
                                <tr>
                                    <th className="w-[40%]">Course</th>
                                    <th className="w-">Price</th>
                                    <th className="min-w-[120px]">Details</th>
                                    <th className="min-w-[120px]">Status</th>
                                    <th className="2xl:min-w-[170px]">Actions</th>
                                    <th>Feedback</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.courses.map((courseData, index) => (
                                    <UserRow
                                        key={index}
                                        courseData={courseData}
                                        setSuspensionDetails={setSuspensionDetails}                                        
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
            </div>

            {/* Suspension Details Modal */}
            {suspensionDetails && (
                <SuspensionDetailsModal
                    suspensionDetails={suspensionDetails}
                    setSuspensionDetails={setSuspensionDetails}
                />
            )}
        </>
    );
};

const UserRow = ({ courseData, setSuspensionDetails, handleRemoveSuspension, handleCourseStatus}) => {

    const navigate = useNavigate();

    // Destructure user data for cleaner code
    const {
        _id,
        courseName,
        courseThumbnail,
        price,
        status,
        instructorName,
        feedback

    } = courseData;   

    // Format the date
    // const date = formatDate(suspension_date);

    // Prepare suspension details data
    // const suspensionDetailsData = {
    //     suspension_reason,
    //     suspension_details,
    // };

    return (
        <tr className="flex flex-col lg:table-row">
            {/* Course Name */}
            <td className="px-0 sm:px-4">
                <div className="flex items-start gap-3">
                    <div className="avatar">
                        <div className="mask h-12 w-12">
                            <img
                                className="object-cover"
                                src={generateImageLink({ imageId: courseThumbnail, width: 128 })}
                                alt={`course thumbnail`}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">{courseName}</div>
                        <div className="hidden lg:block text-gray-500">by {instructorName}</div>
                    </div>
                </div>
            </td>

            {/* Price */}
            <td className="px-0 sm:px-4">
                <div className="flex items-center">
                    <div className="w-[35%] sm:w-[25%] font-medium text-gray-500 lg:hidden">User Email</div>
                    <div className="font-medium text-gray-500">${price}</div>
                </div>
            </td>

            {/* Details page */}
            <td className="px-0 sm:px-4">
                <div onClick={() => navigate(`/course/${_id}`)} className="text-blue-500 cursor-pointer">
                    Details page
                </div>
            </td>

            {/* Status */}
            <td className="px-0 sm:px-4">
                <div className={`font-medium capitalize ${status === 'approved' ? 'text-green-600' : status === 'pending' ? 'text-blue-500' : status === 'denied' ? 'text-red-500' : ''}`}>
                    {status}
                </div>
            </td>

            {/* Suspended By Information */}
            <td className="px-0 sm:px-4 select-none">
                <div className="flex items-start gap-x-3">
                    <div onClick={() => handleCourseStatus({_id, status: 'approved'})} className={`flex items-center gap-x-1 bg-green-600 text-white px-1.5 py-1.5 rounded cursor-pointer ${status === 'approved' ? 'pointer-events-none opacity-50' : ''}`}>
                        <TickCircle />
                        Approve
                    </div>
                    <div onClick={() => handleCourseStatus({_id, status: 'denied'})} className={`flex items-center gap-x-1 bg-red-600 text-white px-1.5 py-1.5 rounded cursor-pointer ${status === 'denied' ? 'pointer-events-none opacity-50' : ''}`}>
                        <CloseCircle />
                        Deny
                    </div>
                </div>
            </td>

            <td className="px-0 sm:px-4">
                <div className="w-fit text-white bg-black p-1 rounded cursor-pointer mx-auto">
                    <EditIcon />
                </div>
            </td>
        </tr >
    );
};

const SuspensionDetailsModal = ({ suspensionDetails, setSuspensionDetails }) => {
    const { suspension_reason, suspension_details } = suspensionDetails;

    return (
        <div>
            {/* Modal Toggle Input */}
            <input type="checkbox" id="suspension-details-modal" className="modal-toggle" />

            {/* Modal Content */}
            <div className="modal overflow-auto" role="dialog" aria-labelledby="suspension-details-title">
                <div className="modal-box space-y-4 w-11/12 max-w-xl my-auto min-h-fit">
                    {/* Suspension Reason */}
                    <div>
                        <h3 id="suspension-details-title" className="text-sm font-medium">Suspend Reason</h3>
                        <div className="w-full border border-black mt-2 py-2 px-2 font-medium text-sm capitalize">
                            {suspension_reason || 'No reason provided'}
                        </div>
                    </div>

                    {/* Suspension Details */}
                    <div>
                        <h3 className="text-sm font-medium">Suspend Details</h3>
                        <div className="w-full h-[15rem] overflow-y-auto border border-black mt-2 py-2 px-2 font-medium text-sm">
                            {suspension_details || 'No details provided'}
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="modal-action">
                        <label
                            onClick={() => setSuspensionDetails(null)}
                            htmlFor="suspension-details-modal"
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            aria-label="Close Suspension Details Modal"
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