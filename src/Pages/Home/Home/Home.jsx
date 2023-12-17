import { Helmet } from "react-helmet-async";
import useAuth from "../../../hooks/useAuth";
import ExtraSection from "../ExtraSection/ExtraSection";
import PopularClasses from "../PopularClasses/PopularClasses";
import PopularInstructor from "../PopularInstructor/PopularInstructor";
import Slider from "../Slider/Slider";


const Home = () => {
    const { loading } = useAuth();
    return (
        <div>
            <Helmet>
                <title>Shikho</title>
            </Helmet>
            {loading ?
                <div className='flex justify-center items-center h-[700px] ' >
                    <span className="loading loading-spinner text-info loading-lg"></span>
                </div > :
                <div>
                    <Slider></Slider>
                    <PopularClasses></PopularClasses>
                    <PopularInstructor></PopularInstructor>
                    <ExtraSection></ExtraSection>
                </div>
            }
        </div>
    );
};

export default Home;