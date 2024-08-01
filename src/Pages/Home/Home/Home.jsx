import { Helmet } from "react-helmet-async";
import useAuth from "../../../hooks/useAuth";
import ExtraSection from "../ExtraSection/ExtraSection";
import PopularClasses from "../PopularClasses/PopularClasses";
import PopularInstructor from "../PopularInstructor/PopularInstructor";
import Slider from "../Slider/Slider";
import JobPlacement from "../JobPlacementSection/JobPlacement";
import NewsLetter from "../NewsLetter/NewsLetter";
import Sponser from "../Sponser/Sponser";
import PopularInstructorSkeletonCard from "../../../components/PopularInstructorsSkeleton.jsx/PopularInstructorSkeletonCard";


const Home = () => {
    const { loading } = useAuth();
    return (
        <div>
            <Helmet>
                <title>Learning Point</title>
            </Helmet>
            {loading ?
                <div className='flex justify-center items-center h-[700px] ' >
                    <span className="loading loading-spinner text-info loading-lg"></span>
                </div > :
                <div>
                    <Slider />
                    <PopularClasses />                    
                    <PopularInstructor />                    
                    <ExtraSection />
                    <JobPlacement />
                    <NewsLetter />
                    <Sponser />
                </div>
            }
        </div>
    );
};

export default Home;