import { useLottie } from 'lottie-react';
import loadingAnimation from '../../assets/loadingAnimation/loading3.json';

const Loading = ({className = 'h-[32rem]'}) => {    
    const options = {
        animationData: loadingAnimation,
        loop: true,

    };
    const { View } = useLottie(options);

    return (
        <div className={`w-full ${className} flex flex-col justify-center items-center`}>
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