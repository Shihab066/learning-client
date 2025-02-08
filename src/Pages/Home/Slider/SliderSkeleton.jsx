import siteLogo from '/logo.png';

const SliderSkeleton = () => {
    return (
        <div className='lg-container h-fit lg:h-[20rem] xl:h-[25rem] grid md:grid-cols-2 gap-y-4 lg:gap-x-10 mt-6 sm:mt-10 px-6'>
            <div className='w-full h-full flex items-center order-2 md:order-1'>
                <div className='w-full flex flex-col gap-y-2 md:mr-10 lg:mr-28'>
                    <div className="h-5 sm:h-7 skeleton rounded"></div>
                    <div className="h-3 sm:h-5 skeleton rounded-full"></div>
                    <div className="h-3 sm:h-5 skeleton rounded-full"></div>
                    <div className="h-3 sm:h-5 skeleton rounded-full"></div>
                    <div className="h-3 sm:h-5 skeleton rounded-full"></div>
                    <div className="h-3 sm:h-5 skeleton rounded-full"></div>
                    <div className="w-[70%] h-3 sm:h-5 skeleton rounded-full"></div>
                </div>
            </div>
            <div className='w-full h-[12rem] sm:h-[15rem] md:h-full skeleton rounded-md flex justify-center items-center order-1 md:order-2'>
                <img className='grayscale opacity-30 w-16 sm:w-24' src={siteLogo} alt="" />
            </div>
        </div>
    );
};

export default SliderSkeleton;