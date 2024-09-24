const MilestoneDetailsModal = ({ id, milestoneName, milestoneDetails }) => {
    return (
        <>
            {/* Modal trigger checkbox */}
            <input type="checkbox" id={`${id}details`} className="modal-toggle" />

            {/* Modal content */}
            <div className="modal mt-0" role="dialog">
                <div className="modal-box w-11/12 max-w-5xl h-full max-h-[30rem] text-gray-900">
                    {/* Modal close button */}
                    <div className="modal-action">
                        <label
                            htmlFor={`${id}details`}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </label>
                    </div>

                    {/* Modal header with milestone name */}
                    <h3 className="text-xl font-medium">
                        {milestoneName} | (Details)
                    </h3>
                    <hr />

                    {/* Milestone details */}
                    <p className="text-justify mt-4">
                        {milestoneDetails}
                    </p>
                </div>
            </div>
        </>
    );
};

export default MilestoneDetailsModal;
