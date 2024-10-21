
const PopularInstructorSkeleton = () => {
    const SkeletonCount = new Array(8).fill(0);
    return (
        <>
            {
                SkeletonCount.map((item, index) => <PopularInstructorSkeletonCard key={index} />)
            }
        </>
    );
};
const PopularInstructorSkeletonCard = () => {
    return (
        <div className="animate-pulse justify-self-center">
            <div className="card relative w-[90%] xl:w-96 mb-20">
                <figure className="w-48 h-48 rounded-full mx-auto bg-gray-300">
                </figure>                
            </div>
        </div>
    );
};

export default PopularInstructorSkeleton;