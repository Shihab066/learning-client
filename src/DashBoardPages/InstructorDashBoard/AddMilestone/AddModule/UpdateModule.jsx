import { useEffect, useRef, useState } from "react";

const UpdateModule = ({ milestoneId, moduleId, name, milestonesData, setMilestonesData }) => {
    const [newNameValue, setNewNameValue] = useState(name);
    const [moduleNameError, setModuleNameError] = useState(false);
    const [isUpdateDisabled, setIsUpdateDisabled] = useState(true);
    const closeModal = useRef();

    // Validate module name and toggle update button
    useEffect(() => {
        const isNameValid = newNameValue && newNameValue !== name;
        setModuleNameError(!newNameValue);
        setIsUpdateDisabled(!isNameValid);
    }, [newNameValue, name]);

    // Update the module name
    const updateModuleData = () => {
        const updatedMilestonesData = milestonesData.map(milestone =>
            milestone._id === milestoneId
                ? {
                    ...milestone,
                    milestoneModules: milestone.milestoneModules.map(mod => mod.id === moduleId
                        ? {
                            ...mod, moduleName: newNameValue
                        }
                        : mod
                    ),
                }
                : milestone
        );
        setMilestonesData(updatedMilestonesData);
        closeModal.current.click();  // Close the modal after saving
    };

    // Reset input field to the original value
    const resetData = () => setNewNameValue(name);

    return (
        <>
            <input type="checkbox" id={`${moduleId}moduleUpdate`} className="modal-toggle" />
            <div className="modal mt-[0px!important] text-gray-900" role="dialog">
                <div className="modal-box w-11/12 max-w-5xl">
                    <div className="modal-action">
                        <label onClick={resetData} htmlFor={`${moduleId}moduleUpdate`} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                        <label ref={closeModal} htmlFor={`${moduleId}moduleUpdate`} />
                    </div>

                    <div>
                        {/* Module Name Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Module Name <span className="text-red-600">*</span></span>
                            </label>
                            <input
                                type="text"
                                value={newNameValue}
                                placeholder="Module Name"
                                onChange={(e) => setNewNameValue(e.target.value)}
                                className="input input-info border-base-300 focus:border-blue-500 focus:outline-0"
                            />
                            {moduleNameError && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* Save Changes Button */}
                        <div
                            onClick={updateModuleData}
                            className={`w-fit font-medium text-white bg-blue-600 hover:bg-blue-700 mt-4 px-4 py-2 rounded-md cursor-pointer ${isUpdateDisabled ? 'pointer-events-none opacity-40' : ''}`}
                        >
                            Save Changes
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateModule;
