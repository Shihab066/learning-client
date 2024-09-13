const PopularClassSkeletonCard = () => {
    return (
        <div className="flex justify-center">
            <div className="card relative w-[95%] h-[15.938rem] xl:w-[90%] shadow-xl bg-white">
                <div className="animate-pulse">
                    <span className="absolute right-2 top-3 z-30 w-11 h-7 px-1 py-[0.125rem] sm:px-2 sm:py-1 lg:px-3 rounded-lg bg-base-300 text-center xs:text-sm sm:text-base"></span>
                    <div className="p-2 mt-10 card-body sm:p-4 lg:p-8 md:mt-4">
                        <h2 className="w-[80%] py-2 rounded-lg bg-base-300"></h2>
                        <span className="w-[70%] py-2 rounded-lg bg-base-300"></span>
                        <span className="w-[60%] py-2 rounded-lg bg-base-300"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopularClassSkeletonCard;
