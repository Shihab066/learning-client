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
        <div className="mt-48">
            <div className="lg-container h-[300px] relative flex justify-between shadow-md overflow-hidden rounded-lg">
                <div className='w-[50%] flex justify-center items-center'>
                    {View}
                </div>
                <div className="w-[60%] h-full change-shape bg-black text-white flex justify-end items-center">
                    <div className="w-[500px] ">
                        <h3 className="text-3xl font-semibold mb-2 opacity-90">Subcribe To Our Newsletter</h3>
                        <p className="opacity-80">Stay up-to-date with our latest news, exclusive offers, and <br />
                            exciting promotions by subscribing to our newsletter today!</p>
                        <div className="flex items-center gap-x-2 mt-4">
                            <input type="text" placeholder="Enter your e-mail" className='text-gray-900 font-normal focus:outline-none box-border w-[260px] py-3 pl-3 rounded overflow-hidden' />
                            <button className="btn btn-md bg-blue-600 text-white border-none rounded">
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