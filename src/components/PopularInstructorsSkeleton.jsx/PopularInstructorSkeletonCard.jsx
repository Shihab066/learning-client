
const PopularInstructorSkeletonCard = () => {
    return (
        <div className="flex justify-center">
            <div className="card relative w-[90%] xl:w-96 false shadow-xl">
                <figure className="xs:h-[130px] sm:h-[200px] md:h-[180px] lg:h-[200px] xl:h-[255px] overflow-hidden bg-base-200">

                </figure>
                <div className="card-body xs:p-4 sm:p-6 lg:p-8">
                    <div className="space-y-2 animate-pulse">
                        <h2 className="w-[250px] py-2 rounded-lg bg-base-300"></h2>
                        <h2 className="w-[200px] py-2 rounded-lg bg-base-300"></h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularInstructorSkeletonCard;