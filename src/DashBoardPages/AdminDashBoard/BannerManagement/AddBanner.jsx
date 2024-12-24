import { useRef, useState } from "react";
import Cropper from "react-easy-crop";
import CloseIcon from "../../../components/Icons/CloseIcon";
import useUploadImage from "../../../hooks/useUploadImage";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { toastSuccess } from "../../../utils/toastUtils";
import { useQueryClient } from "@tanstack/react-query";

const AddBanner = ({ setAddBannerEnable }) => {
    // State variables
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const bannerImageRef = useRef();
    const queryClient = useQueryClient();
    const [isBannerUploading, setIsBannerUploading] = useState(false);

    const { uploadImage } = useUploadImage();
    const [axiosSecure] = useAxiosSecure();

    // Handle image selection for cropping
    const handleBannerImage = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setBannerImage(URL.createObjectURL(file));
        } else if (!file) {
            setBannerImage(null);
        } else {
            alert("Please select a valid image file.");
        }
    };

    // Close the Add Banner modal
    const handleCloseButton = () => {
        setAddBannerEnable(false);
        setBannerImage(null);
    };

    // Capture the cropped area dimensions
    const onCropComplete = (_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    // Upload the cropped banner image
    const handleUploadBanner = async () => {
        try {
            setIsBannerUploading(true);
            const uploadedBannerImage = await uploadImage(bannerImageRef.current.files[0]);
            const bannerInfo = {
                bannerImage: uploadedBannerImage,
                cropArea: croppedAreaPixels,
                crop,
                zoom
            };
            const res = await axiosSecure.post("/banner/add", bannerInfo);
            if (res.data.insertedId) {
                toastSuccess("Banner added successfully");
                handleCloseButton();
                queryClient.refetchQueries(['banner']);
                setIsBannerUploading(false);
            }
        } catch (error) {
            console.error("Failed to upload banner:", error);
        }
    };

    return (
        <div>
            {/* Input and Close Button */}
            <div className="flex items-start my-4 select-none">
                <div className="flex flex-col grow">
                    <label htmlFor="banner-image-input" className="w-fit font-medium">
                        Banner Image
                    </label>
                    <input
                        ref={bannerImageRef}
                        id="banner-image-input"
                        type="file"
                        accept="image/*"
                        className="file-input file-input-sm md:file-input-md file-input-bordered max-w-md mt-2 w-full focus:outline-none"
                        onChange={handleBannerImage}
                    />
                </div>
                <button
                    onClick={handleCloseButton}
                    className="p-1 duration-300 rounded-full hover:bg-base-300"
                >
                    <CloseIcon width={6} />
                </button>
            </div>

            {/* Cropper Area */}
            <div className="relative h-[250px] sm:h-[400px] md:h-[600px] w-full bg-gray-300 border">
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

            {/* Zoom and Add Button */}
            {bannerImage && (
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-y-4">
                    <div className="flex items-center gap-x-4 mt-8">
                        <label htmlFor="zoom">Zoom</label>
                        <input
                            id="zoom"
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            className="my-2 h-[2px] w-full max-w-[250px] focus:outline-none"
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                        />
                    </div>
                    <button
                        onClick={handleUploadBanner}
                        className={`px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded ${isBannerUploading ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                        {isBannerUploading ? 'Uploading...' : 'Add'}
                    </button>
                </div>
            )}
        </div>
    );
};


export default AddBanner;