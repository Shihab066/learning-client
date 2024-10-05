
const CourseReviewsSkeleton = () => {
    const SkeletonCount = new Array(5).fill(0);
    return (
        <>
            {
                SkeletonCount.map((item, index) => <CourseReviewsSkeletonCard key={index} />)
            }
        </>
    );
};

const CourseReviewsSkeletonCard = () => {
    return (
        <div className="p-4 rounded-lg bg-gray-50">
            <div className={`space-y-2 animate-pulse`}>
                <div className="w-12 h-12 rounded-full bg-gray-300" />
                <div className="w-[40%] h-3 rounded-full bg-gray-300" />
                <div className="w-[35%] h-3 rounded-full bg-gray-300" />
                <div className="w-[30%] h-3 rounded-full bg-gray-300" />
            </div>
        </div>
    );
};

export default CourseReviewsSkeleton;