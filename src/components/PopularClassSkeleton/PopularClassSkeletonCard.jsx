

const PopularClassSkeletonCard = () => {
    return (
        <div className="flex justify-center">
            <div className="card relative w-[90%] xl:w-96 h-[255px] shadow-xl bg-white">
                <div className="animate-pulse">
                    <span className="bg-base-300 w-[45px] h-[26px] xs:px-[3px] sm:px-2 lg:px-3 xs:py-[2px] sm:py-1 xs:text-sm sm:text-base rounded-lg text-center absolute right-2 top-3 z-30">

                    </span>
                    <div className="card-body xs:p-4 sm:p-6 lg:p-8 mt-4">
                        <h2 className="w-[250px] py-2 rounded-lg bg-base-300"></h2>
                        <span className="w-[200px] py-2 rounded-lg bg-base-300"></span>
                        <span className="w-[150px] py-2 rounded-lg bg-base-300"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularClassSkeletonCard;