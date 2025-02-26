import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import generateImageLink from "../../../utils/generateImageLink";
import EditIcon from "../../../components/Icons/EditIcon";
import DeleteIcon from "../../../components/Icons/DeleteIcon";
import EmptyPage from "../../../components/EmptyPage/EmptyPage";
import Loading from "../../../components/Loading/Loading";
import { useState } from "react";
import AddBanner from "./AddBanner";
import UpdateBanner from "./UpdateBanner";
import { removeAlert, toastSuccess } from "../../../utils/toastUtils";
import Title from "../../../components/Title/Title";

const BannerManagement = () => {
    const [axiosSecure] = useAxiosSecure();
    const [isAddBannerEnable, setAddBannerEnable] = useState(false);
    const [isBannerUpdateEnable, setIsBannerUpdateEnable] = useState(false);
    const [currentBannerInfo, setCurrentBannerInfo] = useState(null);

    // Fetch banners using React Query
    const { data, isLoading, refetch: refetchBanners } = useQuery({
        queryKey: ['banner'],
        queryFn: async () => {
            const res = await axiosSecure.get('/banner/get');
            return res.data;
        },
    });

    // Handle banner deletion
    const handleDelete = async (bannerId) => {
        try {
            const res = await axiosSecure.delete(`/banner/delete/${bannerId}`);
            if (res.data.deletedCount) {
                toastSuccess('Banner removed');
                refetchBanners();
            }
        } catch (error) {
            console.error('Failed to delete banner:', error);
        }
    };

    return (
        <div>
            <Title title={'Banner Management'}/>
            {/* Header Section */}
            <div className="pb-2 border-b flex items-start justify-between">
                <h2 className="text-lg font-bold">Banner Management</h2>
                {!isAddBannerEnable && !isBannerUpdateEnable && (
                    <button
                        onClick={() => setAddBannerEnable(true)}
                        className="px-2 py-2 text-sm font-medium text-white bg-blue-600 rounded"
                    >
                        Add Banner
                    </button>
                )}
            </div>

            {/* Conditional Rendering for Banner States */}
            {isLoading ? (
                <Loading />
            ) : isAddBannerEnable ? (
                <AddBanner setAddBannerEnable={setAddBannerEnable} />
            ) : isBannerUpdateEnable ? (
                <UpdateBanner
                    setIsBannerUpdateEnable={setIsBannerUpdateEnable}
                    currentBannerInfo={currentBannerInfo}
                />
            ) : data.length > 0 ? (
                <div className="mt-4">
                    {data.map((bannerData, index) => (
                        <BannerCard
                            key={index}
                            bannerData={bannerData}
                            setIsBannerUpdateEnable={setIsBannerUpdateEnable}
                            setCurrentBannerInfo={setCurrentBannerInfo}
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                <EmptyPage text="It looks like there are no banner items added." />
            )}
        </div>
    );
};

const BannerCard = ({ bannerData, setIsBannerUpdateEnable, setCurrentBannerInfo, handleDelete }) => {
    const { _id, bannerImage } = bannerData;

    // Handle edit button click
    const handleEdit = () => {
        setIsBannerUpdateEnable(true);
        setCurrentBannerInfo(bannerData);
    };

    // Handle delete button click with confirmation
    const handleBannerDelete = () => {
        removeAlert().then(result => {
            if (result.isConfirmed) {
                handleDelete(_id);
            }
        });
    };

    return (
        <div className="mt-4 flex items-center justify-between border rounded-md p-2 sm:p-4">
            {/* Banner Image */}
            <img
                className="w-40 aspect-[11/5] object-cover rounded"
                src={generateImageLink({ imageId: bannerImage, width: 200 })}
                alt="banner image"
            />

            {/* Action Buttons */}
            <div className="flex items-center gap-x-2">
                {/* Edit Button */}
                <div
                    onClick={handleEdit}
                    className="p-1 text-white bg-yellow-600 rounded cursor-pointer"
                    title="Edit"
                >
                    <EditIcon width={6} />
                </div>

                {/* Delete Button */}
                <div
                    onClick={handleBannerDelete}
                    className="p-1 text-white bg-red-600 rounded cursor-pointer"
                    title="Delete"
                >
                    <DeleteIcon width={6} />
                </div>
            </div>
        </div>
    );
};

export default BannerManagement;