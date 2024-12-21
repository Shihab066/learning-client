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

const BannerManagement = () => {
    const [axiosSecure] = useAxiosSecure();
    const [isAddBannerEnable, setAddBannerEnable] = useState(false);
    const [isBannerUpdateEnable, setIsBannerUpdateEnable] = useState(false);
    const [currentBannerInfo, setCurrentBannerInfo] = useState(null);

    const { data, isLoading } = useQuery({
        queryKey: ['banner'],
        queryFn: async () => {
            const res = await axiosSecure.get('http://localhost:5000/api/v1/banner/get');
            return res.data
        }
    });

    return (
        <div>
            <div className="flex items-start justify-between border-b pb-2">
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
                    data.length > 0
                        ?
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
                                <div className="mt-4">
                                    {
                                        data?.map((bannerData, index) =>
                                            <BannerCard
                                                key={index}
                                                bannerData={bannerData}
                                                setIsBannerUpdateEnable={setIsBannerUpdateEnable}
                                                setCurrentBannerInfo={setCurrentBannerInfo}
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

const BannerCard = ({ bannerData, setIsBannerUpdateEnable, setCurrentBannerInfo }) => {
    const { bannerImage } = bannerData;

    const handleEdit = () => {
        setIsBannerUpdateEnable(true);
        setCurrentBannerInfo(bannerData);
    }
    return (
        <div className="flex items-center justify-between border rounded-md p-4 mt-4 usernoe">
            <img
                className="w-32 aspect-video rounded"
                src={generateImageLink({ imageId: bannerImage, width: 128 })}
                alt="banner image"
            />

            <div className="flex items-center gap-x-2">
                <div onClick={handleEdit} className="bg-yellow-600 p-1 rounded text-white cursor-pointer" title="edit">
                    <EditIcon width={6} />
                </div>
                <div className="bg-red-600 p-1 rounded text-white cursor-pointer" title="delete">
                    <DeleteIcon width={6} />
                </div>
            </div>
        </div>
    )
};

export default BannerManagement;