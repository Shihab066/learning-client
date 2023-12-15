import { useEffect, useState } from "react";
import ClassCard from "../../../components/ClassCard/ClassCard";


const PopularClasses = () => {
    const [classes, setClasses] = useState([]);
    useEffect(() => {
        fetch('https://learning-info-bd.vercel.app/topclass')
            .then(res => res.json())
            .then(data => setClasses(data))
    }, [])
    return (
        <div>
            <h2 className="mt-20 mb-10 text-center text-4xl font-semibold">Popular Classes</h2>
            <div className="lg-container grid md:grid-cols-3 gap-y-10">
                {classes.map(item => <ClassCard
                    key={item._id}
                    item={item}  
                    overlay={true}
                    cardForClass={true}
                    propularClass={true}
                ></ClassCard>)}
            </div>
        </div>
    );
};

export default PopularClasses;