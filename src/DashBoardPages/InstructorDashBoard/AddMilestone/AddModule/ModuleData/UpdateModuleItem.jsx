import { useEffect, useRef, useState } from "react";

const UpdateModuleItem = ({
    moduleItem,
    moduleId,
    milestoneId,
    milestonesData,
    setMilestonesData
}) => {
    const { itemName, itemData } = moduleItem;

    // State for form fields
    const [newName, setNewName] = useState(itemName);
    const [newData, setNewData] = useState(itemData);

    // State for form validation errors
    const [errors, setErrors] = useState({
        name: false,
        data: false
    });

    // State to control the Save button
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);

    // State to toggle between video and text input fields
    const [isVideo, setIsVideo] = useState(true);

    // Ref to programmatically close the modal
    const closeModalRef = useRef();

    /**
     * Validates form fields and updates error states.
     */
    const validateFields = () => {
        const nameError = !newName;
        const dataError = !newData;

        setErrors({
            name: nameError,
            data: dataError
        });

        // Determine if Save button should be enabled
        const hasChanges = newName !== itemName || newData !== itemData;
        const hasNoErrors = !nameError && !dataError;
        setIsSaveDisabled(!(hasChanges && hasNoErrors));
    };

    /**
     * Updates the module item data in the milestonesData state.
     */
    const updateModuleItem = () => {
        const updatedModuleItem = {
            ...moduleItem,
            itemName: newName,
            itemData: newData
        };

        const updatedMilestones = milestonesData.map(milestone => {
            if (milestone._id !== milestoneId) return milestone;

            const updatedModules = milestone.milestoneModules.map(mod => {
                if (mod.id !== moduleId) return mod;

                const updatedItems = mod.moduleItems.map(item =>
                    item.id === moduleItem.id ? updatedModuleItem : item
                );

                return { ...mod, moduleItems: updatedItems };
            });

            return { ...milestone, milestoneModules: updatedModules };
        });
        setMilestonesData(updatedMilestones);

        // Disable the Save button and close the modal
        setIsSaveDisabled(true);
        closeModalRef.current.click();
    };

    /**
     * Resets the form fields and error states to their initial values.
     */
    const resetForm = () => {
        setNewName(itemName);
        setNewData(itemData);
        setErrors({ name: false, data: false });
    };

    // Effect to validate fields whenever form inputs change
    useEffect(() => {
        validateFields();
    }, [newName, newData]);

    return (
        <>            
            <input
                type="checkbox"
                id={`${moduleItem.id}updateModuleItem`}
                className="modal-toggle"
            />
            <div className="modal" role="dialog">
                <div className="modal-box w-11/12 max-w-5xl">
                    {/* Modal Close Button */}
                    <div className="modal-action">
                        <label
                            onClick={resetForm}
                            htmlFor={`${moduleItem.id}updateModuleItem`}
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </label>
                        <label ref={closeModalRef} htmlFor={`${moduleItem.id}updateModuleItem`} />
                    </div>

                    <div>
                        {/* Item Name Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Item Name <span className="text-red-600">*</span>
                                </span>
                            </label>
                            <input
                                type="text"
                                placeholder="Enter item name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="input input-info border-base-300 focus:border-blue-500 focus:outline-0"
                            />
                            {errors.name && (
                                <span className="text-red-600">Field is required</span>
                            )}
                        </div>

                        {/* Toggle between Video and Text Input Fields */}
                        <div className="flex justify-start items-center gap-x-2 my-4">
                            <button
                                type="button"
                                onClick={() => setIsVideo(true)}
                                className={`btn btn-sm text-white bg-blue-600 hover:bg-blue-700 ${isVideo ? "pointer-events-none opacity-50" : ""
                                    }`}
                            >
                                Add Video
                            </button>
                            <span>or</span>
                            <button
                                type="button"
                                onClick={() => setIsVideo(false)}
                                className={`btn btn-sm text-white bg-blue-600 hover:bg-blue-700 ${!isVideo ? "pointer-events-none opacity-50" : ""
                                    }`}
                            >
                                Add Text
                            </button>
                        </div>

                        {/* Conditional Input Field: Video Link or Text Instruction */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    {isVideo ? "Video Link" : "Text Instruction"}{" "}
                                    <span className="text-red-600">*</span>
                                </span>
                            </label>
                            {isVideo ? (
                                <input
                                    type="text"
                                    placeholder="Add video link"
                                    value={newData}
                                    onChange={(e) => setNewData(e.target.value)}
                                    className="input input-info border-base-300 focus:border-blue-500 focus:outline-0"
                                />
                            ) : (
                                <textarea
                                    rows="5"
                                    cols="50"
                                    placeholder="Text Instruction"
                                    value={newData}
                                    onChange={(e) => setNewData(e.target.value)}
                                    className="textarea textarea-info border-base-300 focus:border-blue-500 focus:outline-0 resize-none"
                                />
                            )}
                            {errors.data && (
                                <span className="text-red-600">Field is required</span>
                            )}
                        </div>

                        {/* Save Changes Button */}
                        <button
                            type="button"
                            onClick={updateModuleItem}
                            disabled={isSaveDisabled}
                            className={`w-fit font-medium text-white bg-blue-600 hover:bg-blue-700 mt-4 px-4 py-2 rounded-md ${isSaveDisabled
                                    ? "opacity-40 cursor-not-allowed"
                                    : "cursor-pointer"
                                }`}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateModuleItem;
