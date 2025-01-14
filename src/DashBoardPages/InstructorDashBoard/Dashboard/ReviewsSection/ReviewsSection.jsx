import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import formatNumber from "../../../../utils/FormateNumber";
import ReviewsSectionSkeleton from "./ReviewsSectionSkeleton";


const ReviewsSection = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();

    // Color codes for rating levels (1-5 stars)
    const ratingColors = ['#EF4444', '#CA8A04', '#FACC15', '#4ADE80', '#16A34A'];

    // Fetching instructor reviews statistics
    const { data = {}, isLoading } = useQuery({
        queryKey: ['instructor-reviews-statistics'],
        enabled: !!user,
        queryFn: async () => {
            const res = await axiosSecure(`/dashboard/instructor/getReviewsStatistics/${user.uid}`);
            return res.data;
        }
    });

    return (
        <div className="mt-10">
            <h2 className="font-bold text-lg">Reviews</h2>
            
            <div className="grid gap-2 mt-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-6">
                {isLoading ? (
                    <ReviewsSectionSkeleton />
                ) : (
                    <>
                        {/* Total Reviews Card */}
                        <div className="p-4 lg:p-5 border border-[#E2E8F0] shadow-[0px_0px_8px_0px] shadow-[#3b82f61f] rounded">
                            <div className="text-gray-500">Total</div>
                            <div className="flex items-center gap-x-2">
                                <div 
                                    className="text-2xl font-medium text-black" 
                                    title={data?.totalReviews}
                                >
                                    {formatNumber({ num: data?.totalReviews, showFraction: false })}
                                </div>
                            </div>
                        </div>

                        {/* Rating Breakdown Cards */}
                        {data?.reviewsStatistics?.map((totalRating, index) => (
                            <ReviewsStatisticsCard
                                key={index}
                                star={index + 1}
                                ratingBg={ratingColors[index]}
                                totalRating={totalRating}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

const ReviewsStatisticsCard = ({ star, ratingBg, totalRating }) => {
    return (
        <div className="p-4 lg:p-5 border border-[#E2E8F0] shadow-[0px_0px_8px_0px] shadow-[#3b82f61f] rounded">
            {/* Star Rating Display */}
            <div className="flex items-center">
                <span 
                    className="px-2 text-sm text-white rounded mr-1" 
                    style={{ backgroundColor: ratingBg }}
                >
                    {star}.0
                </span>
                <span className="text-gray-500">star</span>
            </div>
            
            {/* Total Rating Count */}
            <div 
                className="mt-2 text-2xl font-medium text-black" 
                title={totalRating}
            >
                {formatNumber({ num: totalRating, showFraction: false })}
            </div>
        </div>
    );
};


export default ReviewsSection;