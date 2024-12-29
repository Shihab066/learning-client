import { useQuery, useQueryClient } from "@tanstack/react-query";
import AdminIcon from "../../../components/Icons/AdminIcon";
import InstructorIcon from "../../../components/Icons/InstructorIcon";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import BlockIcon from "../../../components/Icons/BlockIcon";
import generateImageLink from "../../../utils/generateImageLink";
import { useRef, useState } from "react";
import StudentIcon from "../../../components/Icons/StudentIcon";
import { toastSuccess } from "../../../utils/toastUtils";
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

    const { data, isloading } = useQuery({
        queryKey: ['fetch-users', limit, searchValue],
        enabled: !!user,
        queryFn: async () => {
            const res = await axiosSecure.get(`http://localhost:5000/api/v1/user/all/${user.uid}?limit=${limit}&search=${searchValue}`);
            return res.data;
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSearchValue(e.target.search.value);
    }
    return (
        <div>
            <div className="border-b pb-2 flex justify-between">
                <h2 className="text-lg font-bold">Manage User</h2>
                <form onSubmit={handleSubmit} className="sm:w-[18rem] h-fit relative">
                    <input
                        autoComplete="off"
                        name="search"
                        type="text"
                        placeholder="Search User"
                        className="w-full border py-1.5 rounded-md pl-2 pr-10 focus:outline-none"
                    />
                    {/* search icon */}
                    <button type="submit">
                        <img
                            className='w-6 absolute right-2 top-1/2 -translate-y-1/2'
                            src={searchIcon}
                            alt="search icon" />
                    </button>
                </form>
            </div>

            {
                isloading
                    ?
                    <Loading />
                    :
                    data?.users?.length > 0 &&
                    <>
                        <table className="table">
                            {/* Table Head */}
                            <thead className='hidden md:table-header-group'>
                                <tr>
                                    <th className='w-[35%]'>User</th>
                                    <th className='w-[25%]'>Email</th>
                                    <th className='w-[15%]'>Role</th>
                                    <th className='w-[25%] min-w-[260px]'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    data?.users.map((userData, index) => {
                                        if (userData._id !== user.uid) {
                                            return (
                                                <UserRow
                                                    key={index}
                                                    data={userData}
                                                    setUserInfo={setUserInfo}
                                                />
                                            );
                                        }
                                        return null;
                                    })}
                            </tbody>
                        </table>

                        {
                            data?.totalUsers > 10 && data?.totalUsers !== data?.users.length &&
                            <button onClick={() => setLimit(limit + 10)} className={`text-sm font-medium text-gray-600 border border-gray-500 px-2.5 py-2 rounded m-4 hover:shadow-md duration-300`}>
                                View more
                            </button>
                        }
                    </>
            }

            {
                userInfo &&
                <>
                    <ChangeRoleModal
                        userInfo={userInfo}
                    />
                    <SuspendModal
                        userInfo={userInfo}
                        setUserInfo={setUserInfo}
                    />
                </>
            }
        </div>
    );
};

const UserRow = ({ data, setUserInfo }) => {
    const { name, image, email, role, suspended } = data;
    return (
        <tr>
            <td>
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                            <img
                                className="object-cover"
                                src={generateImageLink({ imageId: image, width: 128 })}
                                alt="user image" />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">{name}</div>
                    </div>
                </div>
            </td>
            <td>
                {email}
            </td>
            <td>
                <div className="badge badge-ghost">
                    {role}
                </div>
            </td>
            <th>
                <div className="flex items-center gap-x-3 select-none">
                    <label onClick={() => setUserInfo(data)} htmlFor="change-role" className="text-sm font-medium bg-black text-white px-2 py-2 rounded-md flex items-center gap-x-1 w-fit cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5" viewBox="0 0 48 48"><g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4}><path d="M18 31h20V5"></path><path d="M30 21H10v22m34-32l-6-6l-6 6"></path><path d="m16 37l-6 6l-6-6"></path></g></svg>
                        Change Role
                    </label>
                    <label onClick={() => setUserInfo(data)} htmlFor="suspend-user" className={`text-sm font-medium bg-red-500 text-white px-2 py-2 rounded-md flex items-center gap-x-1 w-fit cursor-pointer ${suspended ? 'pointer-events-none opacity-50' : ''}`}>
                        <BlockIcon width={5} />
                        Suspend
                    </label>
                </div>
            </th>
        </tr>
    )
};

const ChangeRoleModal = ({ userInfo }) => {
    const { _id: userId, role } = userInfo;
    const [axiosSecure] = useAxiosSecure();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const closeModalRef = useRef();

    const handleRoleUpdate = (role) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Change role to ${role}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirm"
        })
            .then(async (resut) => {
                if (resut.isConfirmed) {
                    const res = await axiosSecure.patch(`http://localhost:5000/api/v1/user/role/${user.uid}`, { role, userId });
                    if (res.data.modifiedCount) {
                        toastSuccess('User role updated');
                        queryClient.refetchQueries(['fetch-users']);
                        closeModalRef.current.click();
                    }
                }
            });
    }
    return (
        <div>
            < input type="checkbox" id="change-role" className="modal-toggle" />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <h3 className="text-lg font-bold">Change Role</h3>
                    <div className="mt-4 flex justify-center gap-x-4 py-4 select-none">
                        <button onClick={() => handleRoleUpdate('admin')} className={`text-sm font-medium bg-red-500 text-white px-2 py-2 rounded-md flex items-center gap-x-1 ${role === 'admin' ? 'opacity-50 pointer-events-none' : ''}`}>
                            <AdminIcon />
                            Make Admin
                        </button>
                        <button onClick={() => handleRoleUpdate('instructor')} className={`text-sm font-medium bg-blue-500 text-white px-2 py-2 rounded-md flex items-center gap-x-1 ${role === 'instructor' ? 'opacity-50 pointer-events-none' : ''}`}>
                            <InstructorIcon />
                            Make Instructor
                        </button>
                        <button onClick={() => handleRoleUpdate('student')} className={`text-sm font-medium bg-black text-white px-2 py-2 rounded-md flex items-center gap-x-1 ${role === 'student' ? 'opacity-50 pointer-events-none' : ''}`}>
                            <StudentIcon />
                            Make Student
                        </button>
                    </div>
                    <div className="modal-action">
                        <label ref={closeModalRef} htmlFor="change-role" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    </div>
                </div>
            </div>
        </div >
    )
};

const SuspendModal = ({ userInfo, setUserInfo }) => {
    const closeModalRef = useRef();
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {
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
            Swal.fire({
                title: "Are you sure?",
                text: `Suspend ${userInfo.name}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#000",
                cancelButtonColor: "#d33",
                confirmButtonText: "Suspend"
            })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        const res = await axiosSecure.post(`http://localhost:5000/api/v1/suspention/addUser`, suspendData);
                        if (res.data.insertedId) {
                            toastSuccess('User added to suspended list');
                            queryClient.refetchQueries(['fetch-users']);
                            closeModalRef.current.click();
                        }
                    }
                });
        } catch (error) {
            console.log('error adding user to suspention list')
        }
    }
    return (
        <div>
            < input type="checkbox" id="suspend-user" className="modal-toggle" />
            <div className="modal overflow-auto" role="dialog">
                <div className="modal-box w-11/12 max-w-xl my-auto min-h-fit">
                    <h3 className="text-lg font-bold mb-4">Suspend User</h3>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* suspend reason selection */}
                        <div className="flex flex-col gap-y-2">
                            <label
                                htmlFor="suspensionReason"
                                className="text-sm font-medium"
                            >
                                Suspend Reason
                            </label>
                            <select
                                defaultValue={""}
                                id="suspensionReason"
                                className="select select-bordered w-full focus:outline-none border-black rounded-none"
                                {...register('suspendReason', { required: true })}
                            >
                                <option value="" disabled>Select Suspension Reason</option>

                                {/* Reasons for Learners  */}
                                <optgroup label="Learners">
                                    <option value="plagiarized_assignments">Plagiarized Assignments</option>
                                    <option value="abusive_language">Abusive Language in Discussions</option>
                                    <option value="repeated_policy_violations">Repeated Policy Violations</option>
                                    <option value="account_sharing">Account Sharing</option>
                                    <option value="fraudulent_payment">Fraudulent Payment</option>
                                    <option value="spamming_forums">Spamming Forums</option>
                                    <option value="harassment_of_instructors">Harassment of Instructors</option>
                                </optgroup>

                                {/* Reasons for Instructors  */}
                                <optgroup label="Instructors">
                                    <option value="copyright_infringement">Copyright Infringement</option>
                                    <option value="low_quality_content">Low-Quality Content</option>
                                    <option value="misleading_information">Misleading Information</option>
                                    <option value="violation_of_platform_policies">Violation of Platform Policies</option>
                                    <option value="inappropriate_content">Inappropriate Content</option>
                                    <option value="manipulating_reviews">Manipulating Reviews</option>
                                    <option value="non_compliance_with_refund_policy">Non-compliance with Refund Policy</option>
                                </optgroup>

                                {/* General Reasons */}
                                <optgroup label="General">
                                    <option value="multiple_complaints">Multiple Complaints</option>
                                    <option value="impersonation">Impersonation</option>
                                    <option value="unauthorized_access_attempts">Unauthorized Access Attempts</option>
                                    <option value="selling_courses_outside_platform">Selling Courses Outside the Platform</option>
                                </optgroup>
                            </select>
                            {errors.suspendReason && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* suspend reason in detail */}
                        <div className="flex flex-col gap-y-2 mt-6">
                            <label
                                htmlFor="suspend-note"
                                className="text-sm font-medium"
                            >
                                Note
                            </label>
                            <textarea
                                id="suspend-note"
                                rows={8}
                                className="resize-none border border-black focus:outline-none p-4"
                                placeholder="Enter details about the suspension reason..."
                                {...register('suspentionDetails', { required: true })}
                            />
                            {errors.suspentionDetails && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* submit button */}
                        <div className="flex justify-end mt-4">
                            <PrimaryButton
                                type="submit"
                                text="Suspend"
                            />
                        </div>
                    </form>

                    <div className="modal-action">
                        <label onClick={() => setUserInfo(null)} ref={closeModalRef} htmlFor="suspend-user" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    </div>
                </div>
            </div>
        </div >
    )
};

export default ManageUser;