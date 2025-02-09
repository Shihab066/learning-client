import siteLogo from '/logo.png';

const CourseDetailsSkeleton = () => {
    return (
        <>
            <div className="bg-[#F8FAFC]">
                <div className="lg-container px-4 xl:px-6 py-10 space-y-5 relative">
                    {/* Breadcrumb */}
                    <div className="w-[50%] h-3 rounded-lg skeleton" />

                    {/* Course Title */}
                    <div className="w-[50%] h-3 rounded-lg skeleton" />

                    {/* Course Short Description */}
                    <div className="w-[50%] h-3 rounded-lg skeleton" />

                    {/* Rating, Duration, and Lectures */}
                    <div className="flex gap-x-3">
                        <div className="w-[10rem] h-4 skeleton rounded" />
                        <div className="w-[8rem] h-4 skeleton rounded" />
                        <div className="w-[12rem] h-4 skeleton rounded" />
                        <div className="w-[7rem] h-4 skeleton rounded" />
                    </div>

                    <div className="flex gap-x-3">
                        <div className="w-[8rem] h-4 skeleton rounded" />
                        <div className="w-[10rem] h-4 skeleton rounded" />
                        <div className="w-[8rem] h-4 skeleton rounded" />
                        <div className="w-[10rem] h-4 skeleton rounded" />
                    </div>

                    {/* Instructor Info */}
                    <div className="flex justify-start items-center gap-x-2">
                        <div className="w-14 h-14 skeleton rounded-full" />
                        <div className="w-[10rem] sm:w-[16rem] h-4 skeleton rounded" />
                    </div>

                    {/* Language Info */}
                    <div className="w-[15rem] sm:w-[20rem] h-4 skeleton rounded" />

                    {/* Course Purchase Card */}
                    <div className="lg:w-[30%] xl:w-[25rem] bg-white border border-[#E2E8F0] shadow-[0px_0px_8px_0px] shadow-[#3b82f61f] mt-[50px!important] lg:mt-[0px!important] rounded-2xl lg:absolute right-4 top-0 lg:top-4">
                        <div className="px-4 sm:px-5 pt-4 sm:pt-6 pb-6 sm:pb-4 lg:pb-7 flex justify-between gap-x-4 flex-col sm:flex-row lg:flex-col">
                            {/* Thumbnail */}
                            <figure className="basis-1/2">
                                <div className="w-full aspect-video skeleton rounded flex justify-center items-center">
                                    <img className='grayscale opacity-30 w-14' src={siteLogo} />
                                </div>
                                <div className="hidden sm:flex justify-start items-center gap-x-1 md:gap-x-3 pt-4 lg:hidden">
                                    {/* Social Share */}                                    
                                    <ShareLinks />
                                </div>
                            </figure>

                            {/* Price and Discount */}
                            <div className="basis-1/2 mt-4 sm:mt-0 md:mt-4 xl:mt-8">
                                <div className="w-full h-5 skeleton rounded" />

                                <div className="mt-6 space-y-4">
                                    <div className="w-full h-10 skeleton" />
                                    <div className="w-full h-10 skeleton" />
                                </div>
                            </div>
                        </div>

                        <hr className="sm:hidden lg:block" />

                        {/* Share Section */}
                        <div className="px-5 pt-4 pb-6 space-y-2  sm:hidden lg:block">
                            <ShareLinks />
                        </div>
                    </div>
                </div>
            </div>

            {/* navigation for different seciton on this page */}
            <div className="lg-container px-4 md:px-6">
                <div className="xl:w-[65%] mr-auto">
                    {/* Navigation Section */}
                    <nav className="mt-6 lg:mt-10">
                        <ul className="flex flex-wrap justify-start items-center gap-2 sm:gap-x-6">
                            <div className="w-[8rem] h-12 skeleton rounded" />
                            <div className="w-[8rem] h-12 skeleton rounded" />
                            <div className="w-[8rem] h-12 skeleton rounded" />
                            <div className="w-[8rem] h-12 skeleton rounded" />
                        </ul>
                    </nav>

                    {/* Description Section */}
                    <section id="description" className="space-y-6 pt-6">
                        <hr />
                        <div>
                            <div className="sm:w-[20rem] h-4 skeleton rounded" />
                            <div className="flex flex-col gap-y-2 mt-3">
                                <div className="w-[90%] h-2 skeleton rounded" />
                                <div className="w-[84%] h-2 skeleton rounded" />
                                <div className="w-[80%] h-2 skeleton rounded" />
                                <div className="w-[75%] h-2 skeleton rounded" />
                                <div className="w-[70%] h-2 skeleton rounded" />
                                <div className="w-[65%] h-2 skeleton rounded" />
                            </div>
                        </div>

                        <div>
                            <div className="sm:w-[20rem] h-4 skeleton rounded" />
                            <div className="flex flex-col gap-y-2 mt-3">
                                <div className="w-[90%] h-2 skeleton rounded" />
                                <div className="w-[84%] h-2 skeleton rounded" />
                                <div className="w-[80%] h-2 skeleton rounded" />
                                <div className="w-[75%] h-2 skeleton rounded" />
                                <div className="w-[70%] h-2 skeleton rounded" />
                                <div className="w-[65%] h-2 skeleton rounded" />
                            </div>
                        </div>
                    </section>

                    {/* Instructor Section */}
                    <section id="instructor" className="space-y-6 pt-6 text-gray-700">
                        <hr />
                        <div className="w-[10rem] h-4 skeleton rounded" />
                        <div className="flex items-center gap-5">
                            <div className="w-[5.5rem] h-[5.5rem] sm:w-[6.5rem] sm:h-[6.5rem] skeleton rounded-full" />
                            <ul className="space-y-2">
                                <div className="w-[5rem] h-2 skeleton rounded" />
                                <div className="w-[6rem] h-2 skeleton rounded" />
                                <div className="w-[5rem] h-2 skeleton rounded" />
                            </ul>
                        </div>

                        {/* Instructor Bio */}
                        <div className="space-y-2">
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                            <div className="w-full h-2 skeleton rounded" />
                        </div>
                    </section>
                </div>

                {/* Reviews Section */}
                <section id="reviews" className="space-y-6 pt-6">
                    <hr />
                    <div className="w-[10rem] h-4 skeleton rounded" />
                    <Reviews />
                </section>
            </div>
        </>
    );
};

const ShareLinks = () => {
    const links = new Array(5).fill(0);

    return (
        <div className="flex justify-start items-center gap-x-2">
            {links.map((link, index) => (
                <div key={index} className="w-10 aspect-square skeleton rounded-lg" />
            ))}
        </div>
    );
};

const Reviews = () => {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start gap-y-6">
            <div className="space-y-4">
                <div className="flex items-center gadiv-x-3">
                    <div className="w-[10rem] h-3 skeleton rounded" />                    
                </div>
                <div className="w-[100%] h-2 skeleton rounded" />
                <div className="w-[100%] h-2 skeleton rounded" />
                <div className="w-[100%] h-2 skeleton rounded" />
                <div className="w-[100%] h-2 skeleton rounded" />
                <div className="w-[100%] h-2 skeleton rounded" />
            </div>

            <div className="w-full md:basis-[75%] space-y-4">
                <ReviewsSkeleton />
            </div>
        </div>
    )
};

const ReviewsSkeleton = () => {
    const SkeletonCount = new Array(3).fill(0);
    return (
        <>
            {
                SkeletonCount.map((item, index) => <ReviewsSkeletonCard key={index} />)
            }
        </>
    );
};

const ReviewsSkeletonCard = () => {
    return (
        <div className="w-full h-48 md:h-40 py-6 px-4 lg:p-6 rounded-lg bg-gray-50">
            <div className={`flex flex-col md:flex-row items-start gap-4 lg:gap-x-10`}>
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 rounded-full skeleton" />
                    <div className="w-20 lg:w-28 h-3 rounded-full skeleton" />
                </div>
                <div className="space-y-2 w-full">
                    <div className="w-[90%] h-3 rounded-full skeleton" />
                    <div className="w-[80%] h-3 rounded-full skeleton" />
                    <div className="w-[75%] h-3 rounded-full skeleton" />
                    <div className="w-[70%] h-3 rounded-full skeleton" />
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsSkeleton;