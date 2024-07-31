import { useLottie } from 'lottie-react';
import errorAnimation from '../../assets/errorAnimation/error404.json'
const ErrorPage = ({text = 'Page Not Found', showButton = true}) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: errorAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }

    };
    const { View } = useLottie(defaultOptions);

    const hanldeBack = () => {
        history.back(-1);
    }
    return (
        <div className=' flex justify-center'>
            <div className='text-center'>
                {View}
                <p className='text-3xl font-bold mb-7'>{ text }</p>
                {showButton && <button onClick={hanldeBack} className='btn bg-blue-500 hover:bg-blue-600 text-white'>Go Back</button>}
            </div>
        </div>
    );
};

export default ErrorPage;