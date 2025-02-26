import Title from "../../../components/Title/Title";
import CourseStatistics from "./CourseStatistics/CourseStatistics";
import ReviewsStatistics from "./ReviewsStatistics/ReviewsStatistics";
import SalesStatistics from "./SalesStatistics/SalesStatistics";

const InstructorDasboard = () => {
    return (
        <>
            <Title title={'Dashboard'}/>
            <SalesStatistics />
            <ReviewsStatistics />
            <CourseStatistics />
        </>
    )
};



export default InstructorDasboard;