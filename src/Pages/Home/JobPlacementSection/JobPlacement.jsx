
import { useLottie } from 'lottie-react';
import animation1 from '../../../assets/Animation/animation2.json'
import { RiShieldCheckLine } from "react-icons/ri";

const JobPlacement = () => {
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
        <div className='lg-container '>
            <div className='mt-48 grid grid-cols-2 items-center'>
                <div className='w-[600px] justify-self-start'>
                    {View}
                    {/* <img src={person} alt="" /> */}
                </div>
                <div className='justify-self-center'>
                    <div className='w-[500px]'>
                        <h2 className='text-3xl font-bold mb-5'> Job Placement Assistance</h2>
                        <div>
                            <h4 className='flex items-center font-semibold text-lg gap-2 mb-3'><RiShieldCheckLine className='text-xl'></RiShieldCheckLine> Internship Programs</h4>
                            <p>
                                Unlock career doors with our tech internship program! Gain hands-on experience, tackle real projects, and receive mentorship. Elevate your skills, build valuable industry connections, and prepare for success in your future career.
                            </p>
                        </div>
                        <div>
                            <h4 className='flex items-center font-semibold text-lg gap-2 my-3'><RiShieldCheckLine className='text-xl'></RiShieldCheckLine> Job Search Strategies</h4>
                            <p>
                                Navigate your career journey with confidence using our Job Search Strategies guide. Discover effective techniques, industry insights, and personalized tips to enhance your job search in the dynamic tech landscape.
                            </p>
                        </div>
                        <div>
                            <h4 className='flex items-center font-semibold text-lg gap-2 my-3'><RiShieldCheckLine className='text-xl'></RiShieldCheckLine> Mock Interviews</h4>
                            <p>
                                Sharpen your interview skills with our Mock Interviews program. Practice and refine your responses in a simulated interview environment. Receive constructive feedback, boost your confidence, and enhance your communication
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobPlacement;