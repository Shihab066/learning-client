import { useRef, useState } from "react";
import generateMongoId from "../../../../utils/genarateID";

const AddModule = ({ id, milestonesData, setMilestonesData }) => {

    // References to input and modal close button
    const moduleNameRef = useRef();
    const closeModalRef = useRef();

    // State to manage validation error for module name
    const [moduleNameError, setModuleNameError] = useState(false);

    // Handles adding the new module data
    const handleModuleData = () => {
        const moduleName = moduleNameRef.current.value;

        // Validate module name
        if (!moduleName) {
            setModuleNameError(true);
            return;
        }

        // Generate new module data with a unique ID
        const moduleId = generateMongoId();
        const newModule = {
            id: moduleId,
            moduleName,
            moduleItems: []
        };

        // Update the milestone with the new module
        const updatedMilestones = milestonesData.map(item =>
            item._id === id ? { ...item, milestoneModules: [...item.milestoneModules, newModule] } : item
        );

        setMilestonesData(updatedMilestones);
        resetModalData();
        closeModalRef.current.click(); // Close the modal after saving
    };

    const handleNameError = () => {
        const moduleName = moduleNameRef.current.value;
        setModuleNameError(!moduleName); // Show error if the field is empty
    };

    const resetModalData = () => {
        moduleNameRef.current.value = '';
        setModuleNameError(false);
    };

    return (
        <>
            {/* Modal to add a new module */}
            <input type="checkbox" id={`${id}addModule`} className="modal-toggle" />
            <div className="modal mt-[0px!important] text-gray-900" role="dialog">
                <div className="modal-box w-11/12 max-w-5xl">
                    <div onClick={resetModalData} className="modal-action">
                        {/* Close modal button */}
                        <label ref={closeModalRef} htmlFor={`${id}addModule`} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    </div>

                    {/* Module input form */}
                    <div>
                        {/* Module Name Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Module Name <span className="text-red-600">*</span></span>
                            </label>
                            <input
                                onChange={handleNameError}
                                ref={moduleNameRef}
                                type="text"
                                placeholder="Module Name"
                                className="input input-info border-base-300 focus:border-blue-500 focus:outline-0"
                            />
                            {moduleNameError && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* Add button */}
                        <div
                            onClick={handleModuleData}
                            className="w-fit font-medium text-white bg-blue-600 hover:bg-blue-700 mt-4 px-4 py-2 rounded-md cursor-pointer"
                        >
                            Add
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddModule;
