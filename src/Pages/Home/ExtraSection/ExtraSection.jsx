import { useLottie } from 'lottie-react';
import animation1 from '../../../assets/Animation/animation3.json'
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
            <div className='mt-24 lg:mt-32 grid sm:grid-cols-2 h-fit content-center'>
                <div className='justify-self-center px-2 sm:pl-5 md:pl-10 xl:pl-0'>
                    <div className='text-center sm:text-left lg:w-[500px]'>
                        <h2 className='text-2xl sm:text-xl md:text-2xl lg:text-3xl font-bold mb-5'>Why Choose Us!</h2>
                        <div>
                            <h4 className='flex justify-center sm:justify-start items-center font-semibold md:text-base lg:text-lg gap-2 mb-3'><RiShieldCheckLine className='text-xl'></RiShieldCheckLine> Expert Instructors</h4>
                            <p className='text-sm lg:text-base'>
                            Our courses are led by a team of highly qualified and experienced instructors who are passionate about their respective fields. They offer expert guidance, personalized instruction, and valuable insights to help learners enhance their skills and unlock their full potential.
                            </p>
                        </div>
                        <div>
                            <h4 className='flex justify-center sm:justify-start items-center font-semibold md:text-base lg:text-lg gap-2 my-3'><RiShieldCheckLine className='text-xl'></RiShieldCheckLine> Supportive Environment</h4>
                            <p className='text-sm lg:text-base'>
                            We uphold a safe and monitored environment, adhering to the highest standards. Our committed team ensures that learners feel supported, motivated, and encouraged throughout their learning journey with us.
                            </p>
                        </div>
                        <div>
                            <h4 className='flex justify-center sm:justify-start items-center font-semibold md:text-base lg:text-lg gap-2 my-3'><RiShieldCheckLine className='text-xl'></RiShieldCheckLine> Diverse Tech Programs</h4>
                            <p className='text-sm lg:text-base'>
                            We provide an extensive array of tech programs designed to meet diverse interests and skill levels. Whether you&apos;re a coding enthusiast, an aspiring data scientist, or a budding UX/UI designer, we offer courses tailored to your specific needs. Our programs are crafted to empower you with the skills and knowledge.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='w-[90%] xl:w-[600px] justify-self-end hidden sm:flex items-center'>
                    {View}                    
                </div>
            </div>
        </div>
    );
};

export default ExtraSection;