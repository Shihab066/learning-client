import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminIcon from "../../../components/Icons/AdminIcon";
import InstructorIcon from "../../../components/Icons/InstructorIcon";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import BlockIcon from "../../../components/Icons/BlockIcon";
import generateImageLink from "../../../utils/generateImageLink";
import { useRef, useState } from "react";
import StudentIcon from "../../../components/Icons/StudentIcon";
import { toastError, toastSuccess } from "../../../utils/toastUtils";
import Swal from "sweetalert2";
import searchIcon from '../../../assets/icon/search_icon.svg';
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import { useForm } from "react-hook-form";
import generateUniqueId from "../../../utils/generateUniqueId";
import Loading from "../../../components/Loading/Loading";

const ManageUser = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const [userInfo, setUserInfo] = useState(null);
    const [limit, setLimit] = useState(10);
    const [searchValue, setSearchValue] = useState('');

    // Fetch users based on search and pagination
    const { data, isLoading } = useQuery({
        queryKey: ['fetch-users', limit, searchValue],
        enabled: !!user,
        queryFn: async () => {
            const res = await axiosSecure.get(`/user/all/${user.uid}?limit=${limit}&search=${searchValue}`);
            return res.data;
        },
    });

    // Handle search form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchValue(e.target.search.value);
    };

    return (
        <div>
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between gap-y-2 border-b pb-2">
                <h2 className="text-lg font-bold">Manage User</h2>
                <form onSubmit={handleSubmit} className="relative sm:w-[18rem] h-fit">
                    <input
                        autoComplete="off"
                        name="search"
                        type="text"
                        placeholder="Search User"
                        className="w-full py-1.5 pl-2 pr-10 border rounded-md focus:outline-none"
                    />
                    <button type="submit">
                        <img
                            src={searchIcon}
                            alt="search icon"
                            className="absolute w-6 right-2 top-1/2 -translate-y-1/2"
                        />
                    </button>
                </form>
            </div>

            {/* Loading State */}
            {isLoading ? (
                <Loading />
            ) : (
                data?.users?.length > 0 && (
                    <>
                        {/* User Table */}
                        <table className="table">
                            <thead className="hidden md:table-header-group">
                                <tr>
                                    <th className="w-[35%]">User</th>
                                    <th className="w-[25%]">Email</th>
                                    <th className="w-[15%]">Role</th>
                                    <th className="md:min-w-[160px] lg:min-w-[260px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.users.map((userData, index) =>
                                    userData._id !== user.uid ? (
                                        <UserRow
                                            key={index}
                                            data={userData}
                                            setUserInfo={setUserInfo}
                                        />
                                    ) : null
                                )}
                            </tbody>
                        </table>

                        {/* Load More Button */}
                        {data.totalUsers > 10 && data.totalUsers !== data.users.length && (
                            <button
                                onClick={() => setLimit(limit + 10)}
                                className="mt-4 text-sm font-medium text-gray-600 border border-gray-500 px-2.5 py-2 rounded sm:m-4 hover:shadow-md duration-300"
                            >
                                View more
                            </button>
                        )}
                    </>
                )
            )}

            {/* Modals */}
            {userInfo && (
                <>
                    <ChangeRoleModal userInfo={userInfo} />
                    <SuspendModal userInfo={userInfo} setUserInfo={setUserInfo} />
                </>
            )}
        </div>
    );
};

const UserRow = ({ data, setUserInfo }) => {
    const { name, image, email, role, suspended } = data;

    return (
        <tr className="flex flex-col md:table-row">
            {/* User Details */}
            <td className="px-0 sm:px-4">
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            <img
                                className="object-cover"
                                src={generateImageLink({ imageId: image, width: 128 })}
                                alt="user image"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">{name}</div>
                    </div>
                </div>
            </td>

            {/* User Email */}
            <td className="px-0 sm:px-4">
                <div className="flex items-center">
                    <div className="font-medium text-gray-500 md:hidden w-[25%]">Email</div>
                    {email}
                </div>
            </td>

            {/* User Role */}
            <td className="px-0 sm:px-4">
                <div className="flex items-center">
                    <div className="font-medium text-gray-500 md:hidden w-[25%]">Role</div>
                    <div className="badge badge-ghost">{role}</div>
                </div>
            </td>

            {/* Actions */}
            <th className="px-0 sm:px-4">
                <div className="flex flex-col gap-3 md:flex-col lg:flex-row lg:items-center select-none">
                    {/* Change Role */}
                    <label
                        onClick={() => setUserInfo(data)}
                        htmlFor="change-role"
                        className="w-full md:w-fit flex items-center justify-center gap-x-1 px-2 py-2 text-sm font-medium text-white bg-black rounded-md cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5" viewBox="0 0 48 48">
                            <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}>
                                <path d="M18 31h20V5"></path>
                                <path d="M30 21H10v22m34-32l-6-6l-6 6"></path>
                                <path d="m16 37l-6 6l-6-6"></path>
                            </g>
                        </svg>
                        Change Role
                    </label>

                    {/* Suspend User */}
                    <label
                        onClick={() => setUserInfo(data)}
                        htmlFor="suspend-user"
                        className={`w-full md:w-fit flex items-center justify-center gap-x-1 px-2 py-2 text-sm font-medium text-white bg-red-500 rounded-md cursor-pointer ${
                            suspended ? 'pointer-events-none opacity-50' : ''
                        }`}
                    >
                        <BlockIcon width={5} />
                        Suspend
                    </label>
                </div>
            </th>
        </tr>
    );
};

const ChangeRoleModal = ({ userInfo }) => {
    const { _id: userId, role } = userInfo;
    const [axiosSecure] = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const closeModalRef = useRef();

    const handleRoleUpdate = async (newRole) => {
        const confirmAction = await Swal.fire({
            title: "Are you sure?",
            text: `Change role to ${newRole}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm",
        });

        if (confirmAction.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/user/role/${user.uid}`, { //the 'user.uid is the current admin id not the user id'
                    role: newRole,
                    userId,
                });

                if (res.data.modifiedCount) {
                    toastSuccess("User role updated");
                    queryClient.refetchQueries(["fetch-users"]);
                    closeModalRef.current.click();
                }
            } catch (error) {
                toastError("Failed to update user role");
            }
        }
    };

    const roles = [
        { label: "Admin", value: "admin", bgColor: "bg-red-500", icon: <AdminIcon /> },
        { label: "Instructor", value: "instructor", bgColor: "bg-blue-500", icon: <InstructorIcon /> },
        { label: "Student", value: "student", bgColor: "bg-black", icon: <StudentIcon /> },
    ];

    return (
        <div>
            <input type="checkbox" id="change-role" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Change Role</h3>
                    <div className="mt-4 flex justify-center gap-x-4 py-4 select-none">
                        {roles.map(({ label, value, bgColor, icon }) => (
                            <button
                                key={value}
                                onClick={() => handleRoleUpdate(value)}
                                className={`text-sm font-medium ${bgColor} text-white px-2 py-2 rounded-md flex items-center gap-x-1 ${
                                    role === value ? "opacity-50 pointer-events-none" : ""
                                }`}
                                disabled={role === value}
                            >
                                {icon}
                                {`Make ${label}`}
                            </button>
                        ))}
                    </div>
                    <div className="modal-action">
                        <label
                            ref={closeModalRef}
                            htmlFor="change-role"
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SuspendModal = ({ userInfo, setUserInfo }) => {
    const closeModalRef = useRef();
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const queryClient = useQueryClient();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const { suspendReason, suspentionDetails } = data;
            const suspendData = {
                suspend_id: generateUniqueId(),
                user_id: userInfo._id,
                suspension_reason: suspendReason,
                suspension_details: suspentionDetails,
                suspension_date: new Date(),
                admin_id: user.uid,
            };

            const confirmAction = await Swal.fire({
                title: "Are you sure?",
                text: `Suspend ${userInfo.name}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#000",
                cancelButtonColor: "#d33",
                confirmButtonText: "Suspend",
            });

            if (confirmAction.isConfirmed) {
                const res = await axiosSecure.post(
                    `/suspension/addUser`,
                    suspendData
                );

                if (res.data.insertedId) {
                    toastSuccess("User added to suspended list");
                    queryClient.refetchQueries(["fetch-users"]);
                    closeModalRef.current.click();
                }
            }
        } catch (error) {
            toastError("Error adding user to suspension list");
        }
    };

    return (
        <div>
            <input type="checkbox" id="suspend-user" className="modal-toggle" />

            <div className="modal overflow-auto" role="dialog">
                <div className="modal-box w-11/12 max-w-xl my-auto min-h-fit">
                    <h3 className="text-lg font-bold mb-4">Suspend User</h3>

                    {/* Suspension Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Suspension Reason Selection */}
                        <div className="flex flex-col gap-y-2">
                            <label htmlFor="suspensionReason" className="text-sm font-medium">
                                Suspend Reason
                            </label>
                            <select
                                id="suspensionReason"
                                className="select select-bordered w-full border-black focus:outline-none rounded-none"
                                defaultValue=""
                                {...register("suspendReason", { required: true })}
                            >
                                <option value="" disabled>
                                    Select Suspension Reason
                                </option>
                                <optgroup label="Learners">
                                    <option value="plagiarized_assignments">Plagiarized Assignments</option>
                                    <option value="abusive_language">Abusive Language in Discussions</option>
                                    <option value="repeated_policy_violations">Repeated Policy Violations</option>
                                    <option value="account_sharing">Account Sharing</option>
                                    <option value="fraudulent_payment">Fraudulent Payment</option>
                                    <option value="spamming_forums">Spamming Forums</option>
                                    <option value="harassment_of_instructors">Harassment of Instructors</option>
                                </optgroup>
                                <optgroup label="Instructors">
                                    <option value="copyright_infringement">Copyright Infringement</option>
                                    <option value="low_quality_content">Low-Quality Content</option>
                                    <option value="misleading_information">Misleading Information</option>
                                    <option value="violation_of_platform_policies">Violation of Platform Policies</option>
                                    <option value="inappropriate_content">Inappropriate Content</option>
                                    <option value="manipulating_reviews">Manipulating Reviews</option>
                                    <option value="non_compliance_with_refund_policy">Non-compliance with Refund Policy</option>
                                </optgroup>
                                <optgroup label="General">
                                    <option value="multiple_complaints">Multiple Complaints</option>
                                    <option value="impersonation">Impersonation</option>
                                    <option value="unauthorized_access_attempts">Unauthorized Access Attempts</option>
                                    <option value="selling_courses_outside_platform">Selling Courses Outside the Platform</option>
                                </optgroup>
                            </select>
                            {errors.suspendReason && (
                                <span className="text-red-600">Field is required</span>
                            )}
                        </div>

                        {/* Suspension Details */}
                        <div className="flex flex-col gap-y-2 mt-6">
                            <label htmlFor="suspend-note" className="text-sm font-medium">
                                Note
                            </label>
                            <textarea
                                id="suspend-note"
                                rows={8}
                                className="resize-none border border-black p-4 focus:outline-none"
                                placeholder="Enter details about the suspension reason..."
                                {...register("suspentionDetails", { required: true })}
                            />
                            {errors.suspentionDetails && (
                                <span className="text-red-600">Field is required</span>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end mt-4">
                            <PrimaryButton type="submit" text="Suspend" />
                        </div>
                    </form>

                    {/* Close Modal Button */}
                    <div className="modal-action">
                        <label
                            ref={closeModalRef}
                            htmlFor="suspend-user"
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => setUserInfo(null)}
                        >
                            ✕
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUser;