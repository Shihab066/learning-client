import { Helmet } from "react-helmet-async";
import ExtraSection from "../ExtraSection/ExtraSection";
import PopularClasses from "../PopularClasses/PopularClasses";
import PopularInstructor from "../PopularInstructor/PopularInstructor";
import Slider from "../Slider/Slider";
import JobPlacement from "../JobPlacementSection/JobPlacement";
import NewsLetter from "../NewsLetter/NewsLetter";
import Sponser from "../Sponser/Sponser";
import Testimonials from "../../../components/Testimonial/Testimonial";


const Home = () => {    
    return (
        <div>
            <Helmet>
                <title>Learning Point</title>
            </Helmet>
            <Slider />
            <PopularClasses />
            <PopularInstructor />
            <Testimonials />
            <ExtraSection />
            <JobPlacement />
            <NewsLetter />
            <Sponser />

        </div >
    );
};

export default Home;