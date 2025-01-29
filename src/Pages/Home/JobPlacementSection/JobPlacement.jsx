
import { useLottie } from 'lottie-react';
import animation1 from '../../../assets/Animation/animation2.json'
import ShieldCheck from '../../../components/Icons/ShieldCheck';

const JobPlacement = ({ isSmallDevice }) => {

    return (
        <div className='lg-container '>
            <div className='mt-20 sm:mt-36 lg:mt-40 grid md:grid-cols-2 gap-y-6 md:gap-y-0'>
                {
                    !isSmallDevice &&
                    <Animation />
                }
                <div className='justify-self-center order-1 md:order-2'>
                    <div className='lg:w-[500px] text-left px-3 sm:pr-4 md:pr-4 xl:pr-0'>
                        <h2 className='text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold mb-5'> Job Placement Assistance</h2>
                        <div>
                            <h4 className='flex justify-start items-center font-semibold md:text-base lg:text-lg gap-2 mb-3'><ShieldCheck /> Internship Programs</h4>
                            <p className='text-sm lg:text-base'>
                                Unlock career doors with our tech internship program! Gain hands-on experience, tackle real projects, and receive mentorship. Elevate your skills, build valuable industry connections, and prepare for success in your future career.
                            </p>
                        </div>
                        <div>
                            <h4 className='flex justify-start items-center font-semibold md:text-base lg:text-lg gap-2 my-3'><ShieldCheck /> Job Search Strategies</h4>
                            <p className='text-sm lg:text-base'>
                                Navigate your career journey with confidence using our Job Search Strategies guide. Discover effective techniques, industry insights, and personalized tips to enhance your job search in the dynamic tech landscape.
                            </p>
                        </div>
                        <div>
                            <h4 className='flex justify-start items-center font-semibold md:text-base lg:text-lg gap-2 my-3'><ShieldCheck /> Mock Interviews</h4>
                            <p className='text-sm lg:text-base'>
                                Sharpen your interview skills with our Mock Interviews program. Practice and refine your responses in a simulated interview environment. Receive constructive feedback, boost your confidence, and enhance your communication
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Animation = () => {
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
        <div className='w-[80%] md:w-full justify-self-center md:justify-self-start flex items-center order-2 md:order-1'>
            {View}
        </div>
    )
}

export default JobPlacement;