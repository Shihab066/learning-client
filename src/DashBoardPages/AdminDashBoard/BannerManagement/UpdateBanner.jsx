import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import CloseIcon from "../../../components/Icons/CloseIcon";
import useUploadImage from "../../../hooks/useUploadImage";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toastSuccess } from "../../../utils/toastUtils";
import generateImageLink from "../../../utils/generateImageLink";
import { useQueryClient } from "@tanstack/react-query";

const UpdateBanner = ({ setIsBannerUpdateEnable, currentBannerInfo: oldBannerInfo }) => {
    const [currentBannerInfo, setCurrentBannerInfo] = useState(oldBannerInfo);
    const { _id, bannerImage: oldBannerImage, zoom: bannerZoom, crop: bannerCrop } = currentBannerInfo;

    // State variables
    const [crop, setCrop] = useState(bannerCrop);
    const [zoom, setZoom] = useState(bannerZoom);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [bannerImage, setBannerImage] = useState(generateImageLink({ imageId: oldBannerImage }));
    const bannerImageRef = useRef();
    const [isUpdateBtnEnable, setIsUpdateBtnEnable] = useState(false);
    const queryClient = useQueryClient();

    const { uploadImage } = useUploadImage();
    const [axiosSecure] = useAxiosSecure();

    const resetBannerInfo = () => {
        setBannerImage(generateImageLink({ imageId: oldBannerInfo.bannerImage }));
        setZoom(oldBannerInfo.zoom);
        setCrop(oldBannerInfo.crop);
        setCurrentBannerInfo(oldBannerInfo);
    };

    // Handle image selection for cropping
    const handleBannerImage = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setBannerImage(URL.createObjectURL(file));
            setCurrentBannerInfo((prevData) => ({ ...prevData, bannerImage: file }));
        } else if (!file) {
            resetBannerInfo();
        } else {
            alert("Please select a valid image file.");
        }
    };

    // Close the modal and reset state
    const handleCloseButton = () => {
        setIsBannerUpdateEnable(false);
        setBannerImage(null);
    };

    // Update cropped area and other info
    const onCropComplete = (_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
        setCurrentBannerInfo((prevData) => ({ ...prevData, crop, zoom }));
    };

    // Upload the updated banner image
    const handleUploadBanner = async () => {
        try {
            const uploadedBannerImage =
                (bannerImageRef.current?.files?.[0] && (await uploadImage(bannerImageRef.current.files[0]))) ||
                oldBannerInfo.bannerImage;

            const bannerInfo = {
                bannerImage: uploadedBannerImage,
                cropArea: croppedAreaPixels,
                crop,
                zoom,
            };

            const res = await axiosSecure.patch(`/banner/update/${_id}`, bannerInfo);
            if (res.data.modifiedCount) {
                toastSuccess("Banner updated successfully");
                queryClient.refetchQueries(["banner"]);
                handleCloseButton();
            }
        } catch (error) {
            console.error("Failed to update banner:", error);
        }
    };

    // Enable update button only when there are changes
    useEffect(() => {
        const hasChanges = JSON.stringify(currentBannerInfo) !== JSON.stringify(oldBannerInfo);
        setIsUpdateBtnEnable(hasChanges);
    }, [currentBannerInfo, oldBannerInfo]);

    const [isLoaded, setIsLoaded] = useState(false);
    const handleImageLoad = () => {
        setIsLoaded(true); // Mark the image as loaded
    };
    console.log(currentBannerInfo);
    console.log(oldBannerInfo);
    return (
        <div>
            {/* Input and Close Button */}
            <div className="flex items-start my-4 select-none">
                <div className="flex flex-col grow">
                    <label htmlFor="banner-image-input" className="font-medium w-fit">
                        Add New Image
                    </label>
                    <input
                        ref={bannerImageRef}
                        id="banner-image-input"
                        type="file"
                        accept="image/*"
                        className="file-input file-input-bordered w-full max-w-md mt-2 focus:outline-none"
                        onChange={handleBannerImage}
                    />
                </div>
                <button
                    onClick={handleCloseButton}
                    className="p-1 rounded-full duration-300 hover:bg-base-300"
                >
                    <CloseIcon width={6} />
                </button>
            </div>

            {/* Cropper Area */}
            <img
                className="hidden"
                src={bannerImage}
                onLoad={handleImageLoad}
            />
            {
                !isLoaded &&
                <div className={`w-full h-[600px] bg-gray-200 flex justify-center items-center`}>
                    loading...
                </div>
            }

            {
                isLoaded &&
                <>
                    <div className={`relative w-full h-[600px] border bg-gray-300`}>
                        <Cropper
                            image={bannerImage}
                            crop={crop}
                            zoom={zoom}
                            aspect={11 / 4}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>


                    {/* Zoom and Update Button */}
                    <div className="flex justify-between items-end">
                        <div className="flex items-center gap-x-4 mt-8">
                            <label htmlFor="zoom">Zoom</label>
                            <input
                                id="zoom"
                                type="range"
                                min={1}
                                max={3}
                                step={0.1}
                                value={zoom}
                                className="w-[250px] h-[2px] my-2 focus:outline-none"
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                            />
                        </div>
                        <button
                            onClick={handleUploadBanner}
                            className={`px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded ${!isUpdateBtnEnable ? "opacity-50" : ""
                                }`}
                            disabled={!isUpdateBtnEnable}
                        >
                            Update
                        </button>
                    </div>
                </>
            }
        </div>
    );
};


export default UpdateBanner;