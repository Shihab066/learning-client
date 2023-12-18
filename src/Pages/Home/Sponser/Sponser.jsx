import Marquee from "react-fast-marquee";
import logo1 from '../../../assets/sponser/BRAC.svg'
import logo2 from '../../../assets/sponser/samsung.png'
import logo3 from '../../../assets/sponser/Unilever.svg.png'
import logo4 from '../../../assets/sponser/daraz.png'
import logo5 from '../../../assets/sponser/united.png'
import logo6 from '../../../assets/sponser/apex.png'
import logo7 from '../../../assets/sponser/oppo.png'

const Sponser = () => {
    return (
        <div className="lg-container grayscale">
            <Marquee className="mt-48" gradient={true} autoFill={true}>                
                    <img src={logo1} className="w-[100px] mr-24" />
                    <img src={logo2} className="w-[100px] mr-24" />
                    <img src={logo3} className="w-[70px] mr-24" />
                    <img src={logo4} className="w-[100px] mr-24" />
                    <img src={logo5} className="w-[60px] mr-24" />            
                    <img src={logo6} className="w-[100px] mr-24" />            
                    <img src={logo7} className="w-[120px] mr-24" />            
            </Marquee>
        </div>
    );
};

export default Sponser;