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

const ManageSuspention = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const [suspensionDetails, setSuspensionDetails] = useState(null);
    const [limit, setLimit] = useState(10);
    const [searchValue, setSearchValue] = useState('');

    const { data, isloading, refetch: refetchSuspendedUsers } = useQuery({
        queryKey: ['fetch-suspended-users', limit, searchValue],
        enabled: !!user,
        queryFn: async () => {
            const res = await axiosSecure.get(`http://localhost:5000/api/v1/suspention/getUsers?limit=${limit}&search=${searchValue}`);
            return res.data;
        }
    });


    const handleSubmit = (e) => {
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
            confirmButtonText: "Restore Access"
        })
            .then(async (result) => {
                if (result.isConfirmed) {
                    const res = await axiosSecure.delete(`http://localhost:5000/api/v1/suspention/remove/${user_id}/${suspend_id}`,);
                    if (res.data.deletedCount) {
                        toastSuccess('Operation successful');
                        refetchSuspendedUsers();
                    }
                }
            });

    }
    return (
        <>
            <div>
                <div className="border-b pb-2 flex justify-between">
                    <h2 className="text-lg font-bold">Manage Suspended Users</h2>
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
                        data?.suspendedUsers?.length > 0 ?
                            <>
                                <table className="table">
                                    {/* Table Head */}
                                    <thead className='hidden md:table-header-group'>
                                        <tr>
                                            <th className='w-[30%]'>User</th>
                                            <th className=''>Suspend ID</th>
                                            <th className='min-w-[100px]'>Details</th>
                                            <th className='min-w-[120px]'>Date</th>
                                            <th className=''>Suspended by</th>
                                            <th className='min-w-[170px]'></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            data?.suspendedUsers.map((userData, index) =>
                                                <UserRow
                                                    key={index}
                                                    userData={userData}
                                                    setSuspensionDetails={setSuspensionDetails}
                                                    handleRemoveSuspension={handleRemoveSuspension}
                                                />
                                            )
                                        }
                                    </tbody>
                                </table>

                                {
                                    data?.totalSuspendedUsers > 10 && data?.totalSuspendedUsers !== data?.suspendedUsers.length &&
                                    <button onClick={() => setLimit(limit + 10)} className={`text-sm font-medium text-gray-600 border border-gray-500 px-2.5 py-2 rounded m-4 hover:shadow-md duration-300`}>
                                        View more
                                    </button>
                                }
                            </>
                            :
                            <EmptyPage
                                text="No Data Found"
                            />
                }
            </div>

            {
                suspensionDetails &&
                <SuspensionDetailsModal
                    suspensionDetails={suspensionDetails}
                    setSuspensionDetails={setSuspensionDetails}
                />
            }
        </>
    );

};

const UserRow = ({ userData, setSuspensionDetails, handleRemoveSuspension }) => {
    const { user_id, user_name, user_image, user_email, user_role, admin_name, admin_email, suspend_id, suspension_reason, suspension_details, suspension_date } = userData;
    const date = formatDate(suspension_date);
    const suspensionDetailsData = {
        suspension_reason,
        suspension_details
    }
    return (
        <tr>
            <td>
                <div className="flex items-start gap-3">
                    <div className="avatar">
                        <div className="mask mask-squircle h-12 w-12">
                            <img
                                className="object-cover"
                                src={generateImageLink({ imageId: user_image, width: 128 })}
                                alt="user image" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="font-bold">{user_name}</div>
                        <div className="badge badge-ghost">{user_role}</div>
                        <div>{user_email}</div>
                    </div>
                </div>
            </td>

            <td>
                <div className="badge badge-ghost">
                    <span className="text-gray-500">{suspend_id}</span>
                </div>
            </td>

            <td>
                <div>
                    <label onClick={() => setSuspensionDetails(suspensionDetailsData)} htmlFor="suspension-details-modal" className="text-blue-600">
                        See details
                    </label>
                </div>
            </td>

            <td>
                <div>
                    {date}
                </div>
            </td>

            <td>
                <div className="space-y-2">
                    <div className="font-bold">{admin_name}</div>
                    <div>{admin_email}</div>
                </div>
            </td>

            <td>
                <SecondaryButton
                    onClick={() => handleRemoveSuspension({ user_name, user_id, suspend_id })}
                    text="Restore Access"
                />
            </td>
        </tr>
    )
};

const SuspensionDetailsModal = ({ suspensionDetails, setSuspensionDetails }) => {
    const { suspension_reason, suspension_details } = suspensionDetails;
    return (
        <div>
            {/* Put this part before </body> tag */}
            < input type="checkbox" id="suspension-details-modal" className="modal-toggle" />
            <div className="modal overflow-auto" role="dialog">
                <div className="modal-box space-y-4 w-11/12 max-w-xl my-auto min-h-fit">
                    <div>
                        <h3 className="text-sm font-medium">Suspend Reason</h3>
                        <div className="w-full border border-black mt-2 py-2 px-2 font-medium text-sm capitalize">
                            {suspension_reason}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium">Suspend Details</h3>
                        <div className="w-full h-[15rem] overflow-y-auto border border-black mt-2 py-2 px-2 font-medium text-sm">
                            {suspension_details}
                        </div>
                    </div>
                    <div className="modal-action">
                        <label onClick={() => setSuspensionDetails(null)} htmlFor="suspension-details-modal" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageSuspention;