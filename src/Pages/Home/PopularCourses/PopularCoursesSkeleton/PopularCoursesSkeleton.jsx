
const PopularCoursesSkeleton = ({isMobileView}) => {
    const SkeletonCount = new Array(isMobileView ? 6 : 8).fill(0);
    return (
        <>
            {
                SkeletonCount.map((item, index) => <PopularCoursesSkeletonCard key={index} />)
            }
        </>
    );
};

const PopularCoursesSkeletonCard = () => {
    return (
        <div className="w-full rounded-lg overflow-hidden space-y-2 shadow-md animate-pulse">
            <div className="w-full h-48 bg-gray-300"></div>
            <div className="p-4 space-y-2">
                <p className="w-[70%] h-3 rounded-full bg-gray-300"></p>
                <p className="w-[60%] h-3 rounded-full bg-gray-300"></p>
                <p className="w-[50%] h-3 rounded-full bg-gray-300"></p>
            </div>
        </div>
    );
};


export default PopularCoursesSkeleton;