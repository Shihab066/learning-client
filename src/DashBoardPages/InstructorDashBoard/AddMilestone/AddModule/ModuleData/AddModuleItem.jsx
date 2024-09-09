import { useRef, useState } from "react";
import generateMongoId from "../../../../../utils/genarateID";

const AddModuleItem = ({ milestoneId, moduleId, milestonesData, setMilestonesData }) => {
    const moduleItemName = useRef();
    const moduleItemData = useRef();
    const closeModal = useRef();

    const [moduleItemNameError, setModuleItemNameError] = useState(false);
    const [moduleItemDataError, setModuleItemDataError] = useState(false);
    const [isVideoField, setIsVideoField] = useState(true);

    // Handle validation of the module item name
    const handleNameError = () => {
        const name = moduleItemName.current.value;
        setModuleItemNameError(!name);
    };

    // Handle validation of the module item data
    const handleDataError = () => {
        const data = moduleItemData.current.value;
        setModuleItemDataError(!data);
    };

    // Update milestone module items with the new item
    const updateModuleItems = () => {
        const name = moduleItemName.current.value;
        const data = moduleItemData.current.value;

        if (!name) setModuleItemNameError(true);
        if (!data) setModuleItemDataError(true);
        if (!name || !data) return;

        const newModuleItem = {
            id: generateMongoId(),
            itemName: name,
            itemData: data
        };

        const updatedMilestoneData = milestonesData.map(milestone =>
            milestone._id === milestoneId
                ? {
                    ...milestone,
                    milestoneModules: milestone.milestoneModules.map(mod =>
                        mod.id === moduleId
                            ? { ...mod, moduleItems: [...mod.moduleItems, newModuleItem] }
                            : mod
                    ),
                }
                : milestone
        );

        setMilestonesData(updatedMilestoneData);
        resetModalData();
        closeModal.current.click(); // Close modal after saving
    };

    // Reset modal data fields and errors
    const resetModalData = () => {
        moduleItemName.current.value = '';
        moduleItemData.current.value = '';
        setModuleItemNameError(false);
        setModuleItemDataError(false);
    };

    return (
        <>
            {/* Modal Input */}
            <input type="checkbox" id={`${moduleId}addModuleItem`} className="modal-toggle" />
            <div className="modal mt-[0px!important]" role="dialog">
                <div className="modal-box w-11/12 max-w-5xl">
                    <div onClick={resetModalData} className="modal-action">
                        <label ref={closeModal} htmlFor={`${moduleId}addModuleItem`} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</label>
                    </div>

                    <div>
                        {/* Module Item Title */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Title<span className="text-red-600"> *</span>
                                </span>
                            </label>
                            <input
                                ref={moduleItemName}
                                onChange={handleNameError}
                                type="text"
                                placeholder="Enter title"
                                className="input input-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            />
                            {moduleItemNameError && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* Toggle for Video/Text Input */}
                        <div className="flex justify-start items-center gap-x-2 my-4">
                            <button
                                onClick={() => setIsVideoField(true)}
                                className={`btn btn-sm text-white bg-blue-600 hover:bg-blue-700 ${isVideoField ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                Add Video
                            </button>
                            <span>or</span>
                            <button
                                onClick={() => setIsVideoField(false)}
                                className={`btn btn-sm text-white bg-blue-600 hover:bg-blue-700 ${!isVideoField ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                Add Text
                            </button>
                        </div>

                        {/* Dynamic Input for Video or Text */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    {isVideoField ? 'Video Link' : 'Text Instruction'}
                                    <span className="text-red-600"> *</span>
                                </span>
                            </label>
                            {isVideoField ? (
                                <input
                                    ref={moduleItemData}
                                    onChange={handleDataError}
                                    type="text"
                                    placeholder="Add video link"
                                    className="input input-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                                />
                            ) : (
                                <textarea
                                    ref={moduleItemData}
                                    onChange={handleDataError}
                                    rows="5"
                                    cols="50"
                                    placeholder="Text Instruction"
                                    className="textarea textarea-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0 resize-none"
                                />
                            )}
                            {moduleItemDataError && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/* Add Button */}
                        <div
                            onClick={updateModuleItems}
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

export default AddModuleItem;
