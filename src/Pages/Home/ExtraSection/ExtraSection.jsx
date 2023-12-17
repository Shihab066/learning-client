import { useLottie } from 'lottie-react';
import animation1 from '../../../assets/Animation/Animation - 1702834713716.json'
import person from '../../../assets/Animation/person.gif';
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
            <div className='mt-32 grid grid-cols-2 items-center'>
                <div className='justify-self-center'>
                    <div>
                        <h2 className='text-3xl font-bold mb-5'>Why Choose Us!</h2>
                        <div>
                            <h4 className='flex items-center font-semibold text-lg gap-2 mb-3'><RiShieldCheckLine className='text-xl'></RiShieldCheckLine> Expert Instructors</h4>
                            <p className='w-[500px] '>
                            Our courses are led by a team of highly qualified and experienced instructors who are passionate about their respective fields. They offer expert guidance, personalized instruction, and valuable insights to help learners enhance their skills and unlock their full potential.
                            </p>
                        </div>
                        <div>
                            <h4 className='flex items-center font-semibold text-lg gap-2 my-3'><RiShieldCheckLine className='text-xl'></RiShieldCheckLine> Supportive Environment</h4>
                            <p className='w-[500px]'>
                            We uphold a safe and monitored environment, adhering to the highest standards. Our committed team ensures that learners feel supported, motivated, and encouraged throughout their learning journey with us.
                            </p>
                        </div>
                        <div>
                            <h4 className='flex items-center font-semibold text-lg gap-2 my-3'><RiShieldCheckLine className='text-xl'></RiShieldCheckLine> Diverse Tech Programs</h4>
                            <p className='w-[500px]'>
                            We provide an extensive array of tech programs designed to meet diverse interests and skill levels. Whether you&apos;re a coding enthusiast, an aspiring data scientist, or a budding UX/UI designer, we offer courses tailored to your specific needs. Our programs are crafted to empower you with the skills and knowledge.
                            </p>
                        </div>
                    </div>
                </div>
                <div className='w-[600px] justify-self-end'>
                    {View}
                    {/* <img src={person} alt="" /> */}
                </div>
            </div>
        </div>
    );
};

export default ExtraSection;