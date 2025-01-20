import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useState } from "react";

const SuspendedMessageBar = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const [suspensionDetails, setSuspensionDetails] = useState(null);

    const { data } = useQuery({
        queryKey: ['suspension-details'],
        enabled: Boolean(user),
        queryFn: async () => {
            const res = await axiosSecure.get(`/suspension/details/${user?.uid}`);
            return res.data;
        }
    });
    console.log(suspensionDetails)
    return (
        <>
            <div className="w-full bg-red-500">
                <div className="lg-container px-6 text-center text-white text-sm">
                    Your account has been suspended.
                    <label
                        htmlFor="user-suspension-details-modal"
                        className="font-medium underline ml-1"
                        onClick={() => setSuspensionDetails(data)}
                    >
                        See Details
                    </label>
                </div>
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

const SuspensionDetailsModal = ({ suspensionDetails, setSuspensionDetails }) => {
    const { suspend_id, suspension_reason, suspension_details } = suspensionDetails;

    return (
        <div>
            {/* Modal Toggle Input */}
            <input type="checkbox" id="user-suspension-details-modal" className="modal-toggle" />

            {/* Modal Content */}
            <div className="modal overflow-auto" role="dialog" aria-labelledby="suspension-details-title">
                <div className="modal-box space-y-4 w-11/12 max-w-xl my-auto min-h-fit">
                    {/* Suspension Id */}
                    <div>
                        <h3 id="suspension-details-title" className="text-sm font-medium">Suspend ID</h3>
                        <div className="w-full border border-black mt-2 py-2 px-2 font-medium text-sm capitalize">
                            {suspend_id || 'No id found'}
                        </div>
                    </div>

                    {/* Suspension Reason */}
                    <div>
                        <h3 id="suspension-details-title" className="text-sm font-medium">Suspension Reason</h3>
                        <div className="w-full border border-black mt-2 py-2 px-2 font-medium text-sm capitalize">
                            {suspension_reason || 'No reason provided'}
                        </div>
                    </div>

                    {/* Suspension Details */}
                    <div>
                        <h3 className="text-sm font-medium">Suspension Details</h3>
                        <div className="w-full h-[15rem] overflow-y-auto border border-black mt-2 py-2 px-2 font-medium text-sm">
                            {suspension_details || 'No details provided'}
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="modal-action">
                        <label
                            onClick={() => setSuspensionDetails(null)}
                            htmlFor="user-suspension-details-modal"
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
export default SuspendedMessageBar;