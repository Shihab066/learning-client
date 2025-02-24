import { useEffect, useRef, useState } from "react";
import useVideoUpload from "../../../../../hooks/useVideoUpload";

const UpdateModuleItem = ({
    moduleItem,
    moduleId,
    milestoneId,
    milestonesData,
    setMilestonesData
}) => {

    // Ref    
    const closeModalRef = useRef();
    const videoRef = useRef();

    // State for form fields
    const [formData, setFormData] = useState(moduleItem);
    const { itemName, itemData, itemDescription } = formData || {};
    const [videoTitleError, setVideoTitleError] = useState(false);
    const [isVideoUploadDisable, setIsVideoUploadDisable] = useState(true);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);
    const [isVideoUploading, setIsVideoUploading] = useState(false);
    const { uploadVideo } = useVideoUpload();

    // Handle validation of the module item name
    const handleNameError = (e) => {
        const name = e.target.value;
        setVideoTitleError(!name);
    };

    // Handle validation of the module item video
    const handleVideoError = (e) => {
        const videoFile = e.target.files[0];
        // console.log(videoFile);

        const maxSize = 100 * 1024 * 1024;
        if (videoFile && !videoFile.type.startsWith('video/')) {
            alert('Please select a valid video file.');
            setIsVideoUploadDisable(true);
            e.target.value = '';
        }
        else if (videoFile && videoFile.size > maxSize) {
            alert('The file is larger than 100MB.');
            setIsVideoUploadDisable(true);
            e.target.value = '';
        }
        else if (videoFile) {
            setIsVideoUploadDisable(false);
        }
        else if (!videoFile) {
            setIsVideoUploadDisable(true);
        }
        // setVideoError(!videoFile);
    };

    // Handle input change for general form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleVideoTitleInput = (e) => {
        handleNameError(e);
        handleInputChange(e);
    }

    const handleVideoUpload = async () => {
        // handleVideoError(e);
        
        setIsVideoUploading(true);
        const videoFile = videoRef.current.files[0];
        const videoId = await uploadVideo(videoFile);
        if (videoId) {
            setFormData(prevData => ({ ...prevData, ['itemData']: videoId }));
            setIsVideoUploading(false);
        }
    }

    // Check if form data has changed to enable/disable update button
    useEffect(() => {
        const hasChanges = JSON.stringify(formData) !== JSON.stringify(moduleItem);
        setIsSaveDisabled(!hasChanges);
    }, [formData, moduleItem]);

    /**
     * Updates the module item data in the milestonesData state.
     */
    const updateModuleItem = () => {
        if (!formData.itemName) return;
        const updatedModuleItem = formData;
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
        setFormData(moduleItem)
        setIsVideoUploadDisable(true);
        videoRef.current.value = '';
    };

    return (
        <>
            <input
                type="checkbox"
                id={`${moduleItem.id}updateModuleItem`}
                className="modal-toggle"
            />
            <div className="modal" role="dialog">
                <div className="modal-box w-11/12 max-w-5xl text-gray-900">
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
                        {/* Module Item Title */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Video Title<span className="text-red-600"> *</span>
                                </span>
                            </label>
                            <input
                                // ref={videoTitle}
                                onChange={(e) => handleVideoTitleInput(e)}
                                value={itemName}
                                name="itemName"
                                type="text"
                                placeholder="Enter title"
                                className="input input-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            />
                            {videoTitleError && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/*old Video id */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Video ID
                                </span>
                            </label>
                            <input
                                disabled
                                type="text"
                                value={itemData}
                                className="input input-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            />
                        </div>

                        {/*Module Video Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Upload New Video (limit 100MB)
                                </span>
                            </label>
                            <input
                                onChange={(e) => handleVideoError(e)}
                                ref={videoRef}
                                type="file"
                                accept="video/*"
                                className="file-input w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            />

                            <button
                                disabled={isVideoUploadDisable}
                                onClick={handleVideoUpload}
                                className={`w-fit font-medium text-white bg-blue-600 hover:bg-blue-700 mt-4 px-4 py-2 rounded-md ${isVideoUploadDisable
                                    ? "opacity-50 cursor-not-allowed"
                                    : "cursor-pointer"
                                    } ${isVideoUploading ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                {isVideoUploading ? 'Uploading...' : 'Upload'}
                            </button>
                            {/* {videoError && <span className="text-red-600">Field is required</span>} */}
                        </div>

                        {/*Module Videos Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Video Description
                                </span>
                            </label>
                            <textarea
                                // ref={videoDescription}
                                value={itemDescription}
                                onChange={handleInputChange}
                                rows="5"
                                cols="50"
                                placeholder="description"
                                className="textarea textarea-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0 resize-none"
                                name="itemDescription"
                            />
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
