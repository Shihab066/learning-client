
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import img1 from '../../../assets/home/1.jpg';
import img2 from '../../../assets/home/2.jpg';
import img3 from '../../../assets/home/3.jpg';
import img4 from '../../../assets/home/4.jpg';
import img5 from '../../../assets/home/5.jpg';


const Slider = () => {
    return (
        <Carousel className='' animationHandler='fade' swipeable={false} showThumbs={false} showStatus={false} autoPlay={true} infiniteLoop={true} autoFocus={true} interval={4000} transitionTime={500} stopOnHover={true} showArrows={false}>
            <div>
                <img src={img1} className='h-full min-h-[400px] object-cover' />
            </div>
            <div>
                <img src={img2} className='h-full min-h-[400px] object-cover' />
            </div>
            <div>
                <img src={img3} className='h-full min-h-[400px] object-cover' />
            </div>
            <div>
                <img src={img4} className='h-full min-h-[400px] object-cover' />
            </div>
            <div>
                <img src={img5} className='h-full min-h-[400px] object-cover' />
            </div>
        </Carousel>
    );
};

export default Slider;