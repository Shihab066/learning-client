import CourseStatistics from "./CourseStatistics/CourseStatistics";
import ReviewsStatistics from "./ReviewsStatistics/ReviewsStatistics";
import SalesStatistics from "./SalesStatistics/SalesStatistics";

const InstructorDasboard = () => {
    return (
        <>
            <SalesStatistics />
            <ReviewsStatistics />
            <CourseStatistics />
        </>
    )
};



export default InstructorDasboard;