import ExtraSection from "../ExtraSection/ExtraSection";
import PopularCourses from "../PopularCourses/PopularCourses";
import PopularInstructor from "../PopularInstructor/PopularInstructor";
import Slider from "../Slider/Slider";
import JobPlacement from "../JobPlacementSection/JobPlacement";
import NewsLetter from "../NewsLetter/NewsLetter";
import Sponser from "../Sponser/Sponser";
import Testimonials from "../../../components/Testimonial/Testimonial";
import { useEffect, useState } from "react";


const Home = () => {
    const [isMobileView, setIsMobileView] = useState(false);
    const [isSmallDevice, setIsSmallDevice] = useState(false);

    const handleMobileView = () => {
        if (window.innerWidth < 1280) {
            setIsMobileView(true)
        } else {
            setIsMobileView(false)
        }
    }

    const handleSmallView = () => {
        if (window.innerWidth < 576) {
            setIsSmallDevice(true)
        } else {
            setIsSmallDevice(false)
        }
    }

    useEffect(() => {
        const handleResize = () => {
            handleMobileView();
            handleSmallView();
        };
        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    return (
        <>                        
            <Slider />
            <PopularCourses isMobileView={isMobileView} />
            <PopularInstructor isMobileView={isMobileView} />
            <Testimonials />
            <Sponser />
            <ExtraSection isSmallDevice={isSmallDevice} />
            <JobPlacement isSmallDevice={isSmallDevice} />
            <NewsLetter isSmallDevice={isSmallDevice} />
        </ >
    );
};

export default Home;