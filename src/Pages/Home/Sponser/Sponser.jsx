import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import axios from "axios";

const Sponser = () => {
    const [sponserImg, setSponserImg] = useState([]);

    useEffect(() => {
        axios.get('/src/Pages/Home/Sponser/sponser.json')
            .then(data => setSponserImg(data.data))
    }, [])

    return (
        <div className="lg-container pt-10 md:mt-12 lg:mt-16 xl:mt-20 xl:mb-40">
            <h2 className="text-center font-medium text-xl md:text-2xl lg:text-3xl mb-12 md:mb-16 ">Sponsors</h2>
            <Marquee className="grayscale" gradient={true} autoFill={true}>
                {
                    sponserImg.map((image, index) =>
                        <img
                            key={index}
                            src={image.sponserImage}
                            className="w-20 md:w-[6.25rem] xl:w-28 mr-14 sm:mr-24"
                        />
                    )
                }
            </Marquee>
        </div>
    );
};

export default Sponser;