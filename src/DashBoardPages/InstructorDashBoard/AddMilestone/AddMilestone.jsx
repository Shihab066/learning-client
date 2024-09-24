import { useRef, useState } from "react";
import generateMongoId from "../../../utils/genarateID";

const AddMilestone = ({ milestonesData, setMilestonesData }) => {
    // Refs for input fields and modal close button
    const milestoneNameRef = useRef();
    const milestoneDetailsRef = useRef();
    const closeModalRef = useRef();

    // State for managing validation errors
    const [milestoneNameError, setMilestoneNameError] = useState(false);
    const [milestoneDetailsError, setMilestoneDetailsError] = useState(false);

    // Handler to validate and add milestone data
    const handleMilestoneData = () => {
        const name = milestoneNameRef.current.value.trim();
        const details = milestoneDetailsRef.current.value.trim();

        // Simple validation
        if (!name) setMilestoneNameError(true);
        if (!details) setMilestoneDetailsError(true);
        if (!name || !details) return;

        // Construct the new milestone object
        const newMilestone = {
            _id: generateMongoId(),
            milestoneName: name,
            milestoneDetails: details,
            milestoneModules: [],
        };

        // Update milestones data and reset form
        setMilestonesData([...milestonesData, newMilestone]);
        resetForm();
        closeModalRef.current.click(); // Close the modal
    };

    // Handle name input validation
    const handleNameValidation = () => {
        const name = milestoneNameRef.current.value.trim();
        setMilestoneNameError(!name); // Set error if empty
    };

    // Handle details input validation
    const handleDetailsValidation = () => {
        const details = milestoneDetailsRef.current.value.trim();
        setMilestoneDetailsError(!details); // Set error if empty
    };

    // Reset the form and clear any errors
    const resetForm = () => {
        milestoneNameRef.current.value = '';
        milestoneDetailsRef.current.value = '';
        setMilestoneNameError(false);
        setMilestoneDetailsError(false);
    };

    return (
        <>            
            {/* Modal for adding milestone */}
            <input type="checkbox" id="newMilestone" className="modal-toggle" />
            <div className="modal mt-0" role="dialog">
                <div className="modal-box w-11/12 max-w-5xl">
                    <div className="modal-action" onClick={resetForm}>
                        <label ref={closeModalRef} htmlFor="newMilestone" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    </div>

                    <div>
                        {/* Milestone Name Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Milestone Name <span className="text-red-600">*</span>
                                </span>
                            </label>
                            <input
                                ref={milestoneNameRef}
                                type="text"
                                placeholder="Milestone Name"
                                className="input input-info border-base-300 focus:border-blue-500 focus:outline-0"
                                onChange={handleNameValidation}
                            />
                            {milestoneNameError && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* Milestone Details Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Milestone Details <span className="text-red-600">*</span>
                                </span>
                            </label>
                            <textarea
                                ref={milestoneDetailsRef}
                                placeholder="Milestone Details"
                                rows="5"
                                className="textarea textarea-info border-base-300 focus:border-blue-500 focus:outline-0 resize-none"
                                onChange={handleDetailsValidation}
                            />
                            {milestoneDetailsError && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* Save Button */}
                        <div
                            className="w-fit font-medium text-white bg-blue-600 hover:bg-blue-700 mt-4 px-4 py-2 rounded-md cursor-pointer"
                            onClick={handleMilestoneData}
                        >
                            SAVE
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddMilestone;
