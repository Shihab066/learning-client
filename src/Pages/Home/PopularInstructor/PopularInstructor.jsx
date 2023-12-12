import axios from "axios";
import { useEffect, useState } from "react";
import ClassCard from "../../../components/ClassCard/ClassCard";


const PopularInstructor = () => {
    const [instructors, setInstructors] = useState([]);
    useEffect(() => {
        axios.get('https://summer-camp-school-server-zeta.vercel.app/topinstructors')
            .then(res => {
                setInstructors(res.data)
            })
    }, [])
    return (
        <div>
            <h2 className="mt-20 mb-10 text-center text-4xl font-semibold">Popular Instructors</h2>
            <div className="lg-container grid md:grid-cols-3 gap-y-10">
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