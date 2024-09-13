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
        <div className="lg-container grayscale">
            <Marquee className="mt-20 sm:mt-28 md:mt-36 lg:mt-40" gradient={true} autoFill={true}>
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