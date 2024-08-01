import { useEffect, useState } from "react";
import ClassCard from "../../../components/ClassCard/ClassCard";
import PopularClassSkeleton from "../../../components/PopularClassSkeleton/PopularClassSkeleton";


const PopularClasses = () => {
    const [classes, setClasses] = useState([]);
    useEffect(() => {
        fetch('https://learning-info-bd.vercel.app/topclass')
            .then(res => res.json())
            .then(data => setClasses(data))
    }, [])
    return (
        <div>
            <h2 className="xs:mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-32 mb-10 text-center xs:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold">Popular Classes</h2>
            <div className="lg-container grid xs:grid-cols-2 md:grid-cols-3 gap-y-10">
                {classes.length
                    ? classes.map(item =>
                        <ClassCard
                            key={item._id}
                            item={item}
                            overlay={true}
                            cardForClass={true}
                            propularClass={true}
                        ></ClassCard>)
                    : <PopularClassSkeleton />
                }
            </div>
        </div>
    );
};

export default PopularClasses;