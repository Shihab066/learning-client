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
import Title from "../../../components/Title/Title";

const ManageSuspention = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const [suspensionDetails, setSuspensionDetails] = useState(null);
    const [limit, setLimit] = useState(10);
    const [searchValue, setSearchValue] = useState("");

    const { data, isLoading, refetch: refetchSuspendedUsers } = useQuery({
        queryKey: ["fetch-suspended-users", limit, searchValue],
        enabled: !!user,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/suspension/getUsers?limit=${limit}&search=${searchValue}`
            );
            return res.data;
        },
    });

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchValue(e.target.search.value);
    };

    const handleRemoveSuspension = (userData) => {
        const { user_name, user_id, suspend_id } = userData;

        Swal.fire({
            title: "Are you sure?",
            text: `Restore access for ${user_name}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#000",
            cancelButtonColor: "#d33",
            confirmButtonText: "Restore Access",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axiosSecure.delete(
                    `/suspension/remove/${user_id}/${suspend_id}`
                );
                if (res.data.deletedCount) {
                    toastSuccess("Operation successful");
                    refetchSuspendedUsers();
                }
            }
        });
    };

    return (
        <>
            <Title title={'Manage Suspension'}/>
            <div>
                {/* Header Section */}
                <div className="border-b pb-2 flex flex-col sm:flex-row justify-between gap-y-2">
                    <h2 className="text-lg font-bold">Manage Suspended Users</h2>
                    <form
                        onSubmit={handleSearchSubmit}
                        className="sm:w-[18rem] h-fit relative"
                    >
                        <input
                            autoComplete="off"
                            name="search"
                            type="text"
                            placeholder="Search User"
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
                ) : data?.suspendedUsers?.length > 0 ? (
                    <>
                        <table className="table">
                            {/* Table Head */}
                            <thead className="hidden lg:table-header-group">
                                <tr>
                                    <th className="w-[30%]">User</th>
                                    <th>Suspend ID</th>
                                    <th className="min-w-[100px]">Details</th>
                                    <th className="min-w-[120px]">Date</th>
                                    <th>Suspended by</th>
                                    <th className="2xl:min-w-[170px]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.suspendedUsers.map((userData, index) => (
                                    <UserRow
                                        key={index}
                                        userData={userData}
                                        setSuspensionDetails={setSuspensionDetails}
                                        handleRemoveSuspension={handleRemoveSuspension}
                                    />
                                ))}
                            </tbody>
                        </table>

                        {/* Load More Button */}
                        {data?.totalSuspendedUsers > 10 &&
                            data?.totalSuspendedUsers !== data?.suspendedUsers.length && (
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

const UserRow = ({ userData, setSuspensionDetails, handleRemoveSuspension }) => {
    // Destructure user data for cleaner code
    const {
        user_id,
        user_name,
        user_image,
        user_email,
        user_role,
        admin_name,
        admin_email,
        suspend_id,
        suspension_reason,
        suspension_details,
        suspension_date,
    } = userData;

    // Format the suspension date
    const date = formatDate(suspension_date);

    // Prepare suspension details data
    const suspensionDetailsData = {
        suspension_reason,
        suspension_details,
    };

    return (
        <tr className="flex flex-col lg:table-row">
            {/* User Information */}
            <td className="px-0 sm:px-4">
                <div className="flex items-start gap-3">
                    <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                            <img
                                className="object-cover"
                                src={generateImageLink({ imageId: user_image, width: 128 })}
                                alt={`user image`}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="font-bold">{user_name}</div>
                        <div className="hidden lg:block font-medium text-gray-500">{user_email}</div>
                        <div className="badge badge-ghost">{user_role}</div>
                    </div>
                </div>
            </td>

            {/* User Email (Mobile View) */}
            <td className="lg:hidden px-0 sm:px-4">
                <div className="flex items-center">
                    <div className="w-[35%] sm:w-[25%] font-medium text-gray-500 lg:hidden">User Email</div>
                    <div className="block lg:hidden font-medium text-gray-500">{user_email}</div>
                </div>
            </td>

            {/* Suspend ID */}
            <td className="px-0 sm:px-4">
                <div className="flex items-center">
                    <div className="w-[35%] sm:w-[25%] font-medium text-gray-500 lg:hidden">Suspend ID</div>
                    <div className="badge badge-ghost">
                        <span className="text-gray-500">{suspend_id}</span>
                    </div>
                </div>
            </td>

            {/* Suspension Details */}
            <td className="px-0 sm:px-4">
                <div className="flex items-center">
                    <div className="w-[35%] sm:w-[25%] font-medium text-gray-500 lg:hidden">Details</div>
                    <label
                        onClick={() => setSuspensionDetails(suspensionDetailsData)}
                        htmlFor="suspension-details-modal"
                        className="text-blue-600 cursor-pointer"
                    >
                        See details
                    </label>
                </div>
            </td>

            {/* Suspension Date */}
            <td className="px-0 sm:px-4">
                <div className="flex items-center">
                    <div className="w-[35%] sm:w-[25%] font-medium text-gray-500 lg:hidden">Date</div>
                    {date}
                </div>
            </td>

            {/* Suspended By Information */}
            <td className="px-0 sm:px-4">
                <div className="flex items-start">
                    <div className="w-[35%] sm:w-[25%] font-medium text-gray-500 lg:hidden">Suspended by</div>
                    <div className="space-y-2">
                        <div className="font-bold">{admin_name}</div>
                        <div>{admin_email}</div>
                    </div>
                </div>
            </td>

            {/* Restore Access Button */}
            <td className="px-0 sm:px-4">
                <SecondaryButton
                    onClick={() => handleRemoveSuspension({ user_name, user_id, suspend_id })}
                    text="Restore Access"
                    customClass="w-full lg:w-fit"
                />
            </td>
        </tr>
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

export default ManageSuspention;