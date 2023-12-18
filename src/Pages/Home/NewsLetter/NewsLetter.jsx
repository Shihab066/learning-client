import { useLottie } from 'lottie-react';
import animation1 from '../../../assets/Animation/animation1.json'

const NewsLetter = () => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animation1,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };
    const { View } = useLottie(defaultOptions);

    return (
        <div className="mt-28 sm:mt-40 lg:mt-48 px-3">
            <div className="lg-container sm:h-[180px] md:h-[200px] lg:h-[250px] xl:h-[300px] relative flex justify-between shadow-md overflow-hidden rounded-lg">
                <div className='w-[50%] hidden sm:flex justify-center items-center '>
                    {View}
                </div>
                <div className="w-full md:w-[65%] lg:w-[60%] h-full text-center sm:text-left change-shape bg-black text-white flex justify-center sm:justify-end items-center sm:pr-2 md:pr-0">
                    <div className="sm:w-[75%] p-5 sm:p-0">
                        <h3 className="sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-semibold mb-2 opacity-90">Subcribe To Our Newsletter</h3>
                        <p className="text-xs md:text-sm xl:text-base opacity-80">Stay up-to-date with our latest news, exclusive offers, and <br className='hidden lg:flex' />
                            exciting promotions <span className='hidden lg:inline-block'>by subscribing to our newsletter today!</span></p>
                        <div className="flex justify-center sm:justify-start items-center gap-x-2 mt-4">
                            <input type="text" placeholder="Enter your e-mail" className='text-gray-900 font-normal text-sm md:text-base focus:outline-none box-border md:w-[200px] lg:w-[250px] xl:w-[280px] py-2 lg:py-3 px-3 rounded overflow-hidden' />
                            <button className="px-2 lg:px-3 h-[38px] min-h-[38px] md:h-[42px] md:min-h-[42px] lg:h-[48px] lg:min-h-[48px] btn lg:btn-md bg-blue-600 text-white text-xs md:text-sm border-none rounded">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsLetter;