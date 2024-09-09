import { useEffect, useRef, useState } from "react";

const UpdateMilestone = ({ id, name, details, milestonesData, setMilestonesData }) => {
    // State to manage form values and validation
    const [newNameValue, setNewNameValue] = useState(name);
    const [newDetailsValue, setNewDetailsValue] = useState(details);
    const [milestoneNameError, setMilestoneNameError] = useState(false);
    const [milestoneDetailsError, setMilestoneDetailsError] = useState(false);
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);

    // Reference to close the modal after update
    const closeModal = useRef();

    // Validate milestone name
    const handleNameError = () => {
        setMilestoneNameError(!newNameValue);
    };

    // Validate milestone details
    const handleDetailsError = () => {
        setMilestoneDetailsError(!newDetailsValue);
    };

    // Enable/Disable the update button based on changes
    const toggleUpdateButton = () => {
        const hasChanges = newNameValue !== name || newDetailsValue !== details;
        const hasValidInputs = newNameValue && newDetailsValue;
        setIsUpdateDisabled(!(hasChanges && hasValidInputs));
    };

    // Update milestone data and close modal
    const updateMilestoneData = () => {
        const updatedMilestones = milestonesData.map(item => 
            item._id === id ? { ...item, milestoneName: newNameValue, milestoneDetails: newDetailsValue } : item
        );
        setMilestonesData(updatedMilestones);
        setIsUpdateDisabled(true);
        closeModal.current.click();
    };

    // Reset form to initial values
    const resetData = () => {
        setNewNameValue(name);
        setNewDetailsValue(details);
    };

    // Effect to handle input validation and toggle button state
    useEffect(() => {
        toggleUpdateButton();
        handleNameError();
        handleDetailsError();
    }, [newNameValue, newDetailsValue]);

    return (
        <>
            <input type="checkbox" id={`${id}update`} className="modal-toggle" />
            <div className="modal mt-[0px!important]" role="dialog">
                <div className="modal-box w-11/12 max-w-5xl">
                    {/* Modal actions */}
                    <div className="modal-action">
                        <label onClick={resetData} htmlFor={`${id}update`} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                        <label ref={closeModal} htmlFor={`${id}update`}></label>
                    </div>

                    {/* Form to update milestone */}
                    <div>
                        {/* Milestone Name Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Milestone Name <span className="text-red-600">*</span></span>
                            </label>
                            <input
                                onChange={(e) => setNewNameValue(e.target.value)}
                                type="text"
                                placeholder="Milestone Name"
                                value={newNameValue}
                                className="input input-info border-base-300 focus:border-blue-500 focus:outline-0"
                            />
                            {milestoneNameError && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* Milestone Details Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Milestone Details <span className="text-red-600">*</span></span>
                            </label>
                            <textarea
                                onChange={(e) => setNewDetailsValue(e.target.value)}
                                rows="10"
                                placeholder="Milestone Details"
                                value={newDetailsValue}
                                className="textarea textarea-info border-base-300 focus:border-blue-500 focus:outline-0 resize-none"
                            />
                            {milestoneDetailsError && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* Update Button */}
                        <div
                            onClick={updateMilestoneData}
                            className={`w-fit font-medium text-white bg-blue-600 hover:bg-blue-700 mt-4 px-4 py-2 rounded-md cursor-pointer 
                                ${isUpdateDisabled && 'pointer-events-none opacity-40'}`}
                        >
                            Save Changes
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateMilestone;
