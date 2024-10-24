import { useRef, useState } from "react";
import generateMongoId from "../../../../../utils/genarateID";
import useVideoUpload from "../../../../../hooks/useVideoUpload";



const AddModuleItem = ({ milestoneId, moduleId, milestonesData, setMilestonesData }) => {
    const videoTitle = useRef();
    const videoRef = useRef();
    const closeModal = useRef();

    const [videoTitleError, setVideoTitleError] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const { uploadVideo } = useVideoUpload();

    // Handle validation of the module item name
    const handleNameError = () => {
        const name = videoTitle.current.value;
        setVideoTitleError(!name);
    };

    // Handle validation of the module item data
    const handleVideoError = () => {
        const videoFile = videoRef.current.files[0];
        if (videoFile && !videoFile.type.startsWith('video/')) {
            alert('Please select a valid video file.');
            videoRef.current.value = '';
        }
        setVideoError(!videoFile);
    };

    // Handle upload video
    const handleVideoUpload = async (video) => {
        uploadVideo(video)
    };   

    // Update milestone module items with the new item
    const addModuleItems = () => {
        const name = videoTitle.current.value;
        const videoFile = videoRef.current.files[0];

        if (!name) setVideoTitleError(true);
        if (!videoFile) setVideoError(true);
        if (!name || !videoFile) return;
        handleVideoUpload(videoFile);

        const newModuleItem = {
            id: generateMongoId(),
            itemName: name,
            itemData: videoFile
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
        // resetModalData();
        // closeModal.current.click(); // Close modal after saving
    };

    // Reset modal data fields and errors
    const resetModalData = () => {
        videoTitle.current.value = '';
        videoRef.current.value = '';
        setVideoTitleError(false);
        setVideoError(false);
    };

    // console.log(video)
    return (
        <>
            {/* Modal Input */}
            <input type="checkbox" id={`${moduleId}addModuleItem`} className="modal-toggle" />
            <div className="modal mt-[0px!important] text-gray-900" role="dialog">
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
                                ref={videoTitle}
                                onChange={handleNameError}
                                type="text"
                                placeholder="Enter title"
                                className="input input-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            />
                            {videoTitleError && <span className="text-red-600">Field is required</span>}
                        </div>

                        {/*Module Video Input */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Upload Video
                                    <span className="text-red-600"> *</span>
                                </span>
                            </label>
                            <input
                                ref={videoRef}
                                type="file"
                                accept="video/*"
                                className="file-input w-full border-base-300 focus:border-blue-500 active:border-0 focus:outline-0"
                            />                            
                        </div>

                        {/*Module Videos Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">
                                    Description
                                </span>
                            </label>
                            <textarea
                                rows="5"
                                cols="50"
                                placeholder="description"
                                className="textarea textarea-info border-base-300 focus:border-blue-500 active:border-0 focus:outline-0 resize-none"
                            />

                            {/* {videoError && <span className="text-red-600">Field is required</span>} */}
                        </div>

                        {/* Add Button */}
                        <div
                            onClick={addModuleItems}
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
