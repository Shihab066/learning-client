import { useLottie } from 'lottie-react';
import loadingAnimation from '../../assets/loadingAnimation/loading3.json';

const Loading = () => {    
    const options = {
        animationData: loadingAnimation,
        loop: true,

    };
    const { View } = useLottie(options);

    return (
        <div className="w-full h-[500px] flex flex-col justify-center items-center">
            <div className="w-40">
                {View}
            </div>
            <span className="mx-auto">
                loading...
            </span>
        </div>
    );
};

export default Loading;