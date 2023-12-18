import axios from "axios";
import { useEffect, useState } from "react";
import ClassCard from "../../../components/ClassCard/ClassCard";


const PopularInstructor = () => {
    const [instructors, setInstructors] = useState([]);
    useEffect(() => {
        axios.get('https://learning-info-bd.vercel.app/topinstructors')
            .then(res => {
                setInstructors(res.data)
            })
    }, [])
    return (
        <div>
            <h2 className="mt-16 lg:mt-20 xl:mt-32 mb-10 text-center xs:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold">Popular Instructors</h2>
            <div className="lg-container xs:px-2 lg:px-0 grid xs:grid-cols-2 md:grid-cols-3 xs:gap-x-0 lg:gap-x-0 gap-y-10">
                {instructors.map(instructorData => <ClassCard
                    key={instructorData._id}
                    item={instructorData}
                    overlay={false}
                    cardForClass={false}
                ></ClassCard>)}
            </div>
        </div>
    );
};

export default PopularInstructor;