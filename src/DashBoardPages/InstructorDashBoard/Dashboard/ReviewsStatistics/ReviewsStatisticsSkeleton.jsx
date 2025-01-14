
const ReviewsStatisticsSkeleton = () => {
    const SkeletonCount = new Array(6).fill(0);
    return (
        <>
            {
                SkeletonCount.map((item, index) => <ReviewsStatisticsSkeletonCard key={index} />)
            }
        </>
    );
};

const ReviewsStatisticsSkeletonCard = () => {
    return (
        <div className="px-5 py-8 rounded-lg bg-gray-50">
            <div className={`space-y-2 animate-pulse`}>
                <div className="w-[70%] h-2 rounded-full bg-gray-300" />
                <div className="w-[80%] h-2 rounded-full bg-gray-300" />
            </div>
        </div>
    );
};

export default ReviewsStatisticsSkeleton;