import PopularInstructorSkeletonCard from "./PopularInstructorSkeletonCard";

const PopularInstructorSkeleton = () => {
    const SkeletonCount = new Array(6).fill(0);
    return (
        <>
            {
                SkeletonCount.map((item, index) => <PopularInstructorSkeletonCard key={index} />)
            }
        </>
    );
};

export default PopularInstructorSkeleton;