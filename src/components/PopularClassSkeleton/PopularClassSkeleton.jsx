import PopularClassSkeletonCard from "./PopularClassSkeletonCard";

const PopularClassSkeleton = () => {
    const SkeletonCount = new Array(6).fill(0);
    return (
        <>
            {
                SkeletonCount.map((item, index) => <PopularClassSkeletonCard key={index} />)
            }
        </>
    );
};

export default PopularClassSkeleton;