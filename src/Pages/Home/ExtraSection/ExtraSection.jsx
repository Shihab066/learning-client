import { useLottie } from 'lottie-react';
import animation1 from '../../../assets/Animation/basket.json'
import { RiShieldCheckLine } from "react-icons/ri";
const ExtraSection = () => {
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
            <div className='mt-20 grid grid-cols-2 items-center'>
                <div className='flex justify-center'>
                    <div>
                        <h2 className='text-3xl font-bold mb-5'>Why Choose Us!</h2>
                        <div>
                            <h4 className='flex items-center font-semibold text-lg gap-2 mb-3'><RiShieldCheckLine className='text-xl'></RiShieldCheckLine> Expert Coach</h4>
                            <p className='w-[500px] '>
                                Our camp is led by a team of highly qualified and experienced coaches who are passionate about their respective sports. They provide expert guidance, personalized instruction, and valuable insights to help campers improve their skills and reach their full potential.
                            </p>
                        </div>
                        <div>
                            <h4 className='flex items-center font-semibold text-lg gap-2 my-3'><RiShieldCheckLine className='text-xl'></RiShieldCheckLine> Safe and Supportive Environment</h4>
                            <p className='w-[500px]'>
                                The safety and well-being of our campers are of paramount importance to us. We maintain a secure and supervised environment, adhering to the highest safety standards. Our dedicated staff ensures that campers feel supported, encouraged, and motivated throughout their time with us.
                            </p>
                        </div>
                        <div>
                            <h4 className='flex items-center font-semibold text-lg gap-2 my-3'><RiShieldCheckLine className='text-xl'></RiShieldCheckLine> Diverse Sports Programs</h4>
                            <p className='w-[500px]'>
                                We offer a wide range of sports programs to cater to various interests and abilities. Whether your child is a soccer enthusiast, an aspiring gymnast, or a budding tennis player, we have a program tailored to their specific needs
                            </p>
                        </div>
                    </div>
                </div>
                <div className='mt-20'>
                    {View}
                </div>
            </div>
        </div>
    );
};

export default ExtraSection;