import { useEffect, useState } from "react";
import PopularClassSkeleton from "../../../components/PopularClassSkeleton/PopularClassSkeleton";
import axios from "axios";

const PopularClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {        
        axios.get('https://learning-info-bd.vercel.app/topclass')
            .then((res) => {
                setClasses(res.data);
                setLoading(false); 
            })
            .catch((error) => {
                console.error("Error fetching popularClasses:", error);
                setLoading(false);
            });            
    }, []);

    return (
        <div className="lg-container">
            {/* Heading */}
            <h2 className="mb-10 text-center font-semibold xs:mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-32 xs:text-xl md:text-2xl lg:text-3xl">
                Popular Courses
            </h2>

            {/* Grid layout for class cards or skeleton loader */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-4 sm:gap-y-6 xl:gap-y-10 sm:px-2 2xl:px-0">
                {loading
                    ?
                    <PopularClassSkeleton />
                    :
                    classes.length > 0
                        ?
                        classes?.map(item => (
                        <PopularClassCard
                            key={item._id}
                            item={item}
                        />
                        ))                        
                        :
                        <p>No Class Found</p>
                }
            </div>
        </div>
    );
};

// Popular Class Card Component
const PopularClassCard = ({ item }) => {
    const { image, name, instructorName, price, students } = item;

    return (
        <div className="flex justify-center">
            <div className="relative w-[95%] xl:w-[90%] card shadow-xl image-full">
                {/* Class Image */}
                <figure className="h-[12.5rem] md:h-[14.375rem] xl:h-[15.938rem] overflow-hidden bg-base-200">
                    <img
                        src={image}
                        alt="classImg"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-linear"
                    />
                </figure>

                {/* Price Tag */}
                <span className="absolute right-2 top-3 z-30 bg-white px-2 lg:px-3 py-1 rounded-lg text-center xs:text-sm sm:text-base">
                    $ {price}
                </span>

                {/* Class Info */}
                <div className="card-body pl-4 pr-14 py-6 lg:p-8 lg:pr-14">
                    {/* Class Name */}
                    <h2 className="card-title text-sm sm:text-base lg:text-xl h-8 sm:h-12 lg:h-14">
                        {name}
                    </h2>

                    {/* Instructor Name */}
                    <span className="text-[0.8rem] sm:text-sm lg:text-base">
                        by {instructorName}
                    </span>

                    {/* Student Count */}
                    <span className="text-[0.8rem] sm:text-sm lg:text-base">
                        Students: {students}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PopularClasses;
