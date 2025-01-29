import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import axios from "axios";
import sponsorImage1 from '../../../assets/sponser/amazon.png';
import sponsorImage2 from '../../../assets/sponser/cisco.png';
import sponsorImage3 from '../../../assets/sponser/deloitte.png';
import sponsorImage4 from '../../../assets/sponser/google.png';
import sponsorImage5 from '../../../assets/sponser/ibm.png';
import sponsorImage6 from '../../../assets/sponser/microsoft.png';

const Sponser = () => {
    // const [sponserImg, setSponserImg] = useState([]);

    // useEffect(() => {
    //     axios.get('/src/Pages/Home/Sponser/sponser.json')
    //         .then(data => setSponserImg(data.data))
    // }, [])

    const sponserImages = [sponsorImage1, sponsorImage2, sponsorImage3, sponsorImage4, sponsorImage5, sponsorImage6];

    return (
        <div className="lg-container pt-10 md:mt-12 lg:mt-16 xl:mt-20 xl:mb-40">
            <h2 className="text-center font-medium text-xl md:text-2xl lg:text-3xl mb-12 md:mb-16 ">Sponsors</h2>
            <Marquee className="grayscale" gradient={true} autoFill={true}>
                {
                    sponserImages.map((image, index) =>
                        <img
                            key={index}
                            src={image}
                            className="w-20 md:w-[6.25rem] xl:w-28 mr-14 sm:mr-24"
                        />
                    )
                }
            </Marquee>
        </div>
    );
};

export default Sponser;