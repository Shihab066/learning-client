
const CourseStatisticsSekeleton = () => {
    const SkeletonCount = new Array(9).fill(0);
    return (
        <>
            {
                SkeletonCount.map((item, index) => <CourseStatisticsSekeletonCard key={index} />)
            }
        </>
    );
};

const CourseStatisticsSekeletonCard = () => {
    return (
        <div className="px-5 py-8 rounded-lg bg-gray-50">
            <div className="w-[90%] h-2 rounded-full bg-gray-300 animate-pulse" />
            <div className="border my-3" />
            <div className={`space-y-2 animate-pulse`}>
                <div className="w-[50%] h-2 rounded-full bg-gray-300" />
                <div className="w-[60%] h-2 rounded-full bg-gray-300" />
                <div className="w-[70%] h-2 rounded-full bg-gray-300" />
                <div className="w-[80%] h-2 rounded-full bg-gray-300" />
            </div>
        </div>
    );
};
export default CourseStatisticsSekeleton;