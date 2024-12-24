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

const BannerManagement = () => {
    const [axiosSecure] = useAxiosSecure();
    const [isAddBannerEnable, setAddBannerEnable] = useState(false);
    const [isBannerUpdateEnable, setIsBannerUpdateEnable] = useState(false);
    const [currentBannerInfo, setCurrentBannerInfo] = useState(null);

    const { data, isLoading, refetch: refetchBanners } = useQuery({
        queryKey: ['banner'],
        queryFn: async () => {
            const res = await axiosSecure.get('http://localhost:5000/api/v1/banner/get');
            return res.data
        }
    });
    // console.log(data)
    const handleDelete = async (bannerId) => {
        const res = await axiosSecure.delete(`http://localhost:5000/api/v1/banner/delete/${bannerId}`);
        if (res.data.deletedCount) {
            toastSuccess('Banner removed');
            refetchBanners();
        }
    };

    return (
        <div>
            <div className="flex items-start justify-between border-b pb-2 mt-6 xl:mt-0">
                <h2 className="font-bold text-lg">Banner Management</h2>
                {
                    !isAddBannerEnable && !isBannerUpdateEnable &&
                    <button onClick={() => setAddBannerEnable(true)} className="bg-blue-600 text-white font-medium text-sm px-2 py-2 rounded">
                        Add Banner
                    </button>
                }
            </div>

            {
                isLoading
                    ?
                    <Loading />
                    :
                    isAddBannerEnable
                        ?
                        <AddBanner
                            setAddBannerEnable={setAddBannerEnable}
                        />
                        :
                        isBannerUpdateEnable
                            ?
                            <UpdateBanner
                                setIsBannerUpdateEnable={setIsBannerUpdateEnable}
                                currentBannerInfo={currentBannerInfo}
                            />
                            :
                            data.length > 0
                                ?
                                <div className="mt-4">
                                    {
                                        data?.map((bannerData, index) =>
                                            <BannerCard
                                                key={index}
                                                bannerData={bannerData}
                                                setIsBannerUpdateEnable={setIsBannerUpdateEnable}
                                                setCurrentBannerInfo={setCurrentBannerInfo}
                                                handleDelete={handleDelete}
                                            />
                                        )
                                    }
                                </div>
                                :
                                <EmptyPage
                                    text="It looks like there are no banner items added."
                                />
            }
        </div>
    );
};

const BannerCard = ({ bannerData, setIsBannerUpdateEnable, setCurrentBannerInfo, handleDelete }) => {
    const { _id, bannerImage } = bannerData;

    const handleEdit = () => {
        setIsBannerUpdateEnable(true);
        setCurrentBannerInfo(bannerData);
    };

    const handleBannnerDelete = () => {
        removeAlert()
            .then(result => {
                if (result.isConfirmed) {
                    handleDelete(_id);
                }
            })
    };
    return (
        <div className="flex items-center justify-between border rounded-md p-2 sm:p-4 mt-4 usernoe">
            <img
                className="w-40 aspect-[11/5] object-cover rounded"
                src={generateImageLink({ imageId: bannerImage, width: 200 })}
                alt="banner image"
            />

            <div className="flex items-center gap-x-2">
                <div onClick={handleEdit} className="bg-yellow-600 p-1 rounded text-white cursor-pointer" title="edit">
                    <EditIcon width={6} />
                </div>
                <div onClick={handleBannnerDelete} className="bg-red-600 p-1 rounded text-white cursor-pointer" title="delete">
                    <DeleteIcon width={6} />
                </div>
            </div>
        </div>
    )
};

export default BannerManagement;