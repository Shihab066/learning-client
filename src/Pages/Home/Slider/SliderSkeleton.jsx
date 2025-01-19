import siteLogo from '/logo.png';

const SliderSkeleton = () => {
    return (
        <div className='lg-container h-[25rem] grid grid-cols-2 gap-x-10 mt-10 px-6'>
            <div className='w-full h-full flex items-center'>
                <div className='w-full flex flex-col gap-y-2 mr-28'>
                    <div className="h-7 skeleton rounded"></div>
                    <div className="h-5 skeleton rounded-full"></div>
                    <div className="h-5 skeleton rounded-full"></div>
                    <div className="h-5 skeleton rounded-full"></div>
                    <div className="h-5 skeleton rounded-full"></div>
                    <div className="h-5 skeleton rounded-full"></div>
                    <div className="w-[70%] h-5 skeleton rounded-full"></div>
                </div>
            </div>
            <div className='w-full h-full skeleton rounded-md flex justify-center items-center'>
                <img className='grayscale opacity-30 w-24' src={siteLogo} alt="" />
            </div>
        </div>
    );
};

export default SliderSkeleton;