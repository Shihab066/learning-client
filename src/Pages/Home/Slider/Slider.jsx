import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useQuery } from '@tanstack/react-query';
import api from '../../../services/baseAPI';
import generateImageLink from '../../../utils/generateImageLink';
import getCroppedImg from '../../../utils/getCropImage';
import SliderSkeleton from './SliderSkeleton';

const Slider = () => {
    const { data: banners = [], isLoading } = useQuery({
        queryKey: ["client-banner"],
        queryFn: async () => {
            const res = await api.get("/banner/slider-images");
            const rawBanners = res.data;

            // Process banners directly in the query function to cache them
            const bannerImagesPromises = rawBanners.map(async ({ bannerImage, cropArea }) => {
                const bannerImageUrl = generateImageLink({ imageId: bannerImage });
                const croppedImage = await getCroppedImg(bannerImageUrl, cropArea);
                return croppedImage;
            });

            const resolvedBannerImages = await Promise.all(bannerImagesPromises);
            return resolvedBannerImages;
        },
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
    });

    if (isLoading) {
        return <SliderSkeleton />
    } else {
        return (
            <Carousel className='' animationHandler='fade' swipeable={false} showThumbs={false} showStatus={false} autoPlay={true} infiniteLoop={true} autoFocus={true} interval={4000} transitionTime={500} stopOnHover={true} showArrows={false}>
                {
                    banners.map((url, index) => (
                        <div key={index}>
                            <img src={url} className='h-full min-h-[25rem] max-h-[45rem] object-cover' />
                        </div>
                    ))
                }
            </Carousel>
        );
    }
};

export default Slider;