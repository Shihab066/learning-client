import AddCourse from "../DashBoardPages/InstructorDashBoard/AddCourse";
import InstructorDasboard from "../DashBoardPages/InstructorDashBoard/Dashboard/InstructorDashboard";
import MyCourses from "../DashBoardPages/InstructorDashBoard/MyCourses/MyCourses";
import UpdateCourse from "../DashBoardPages/InstructorDashBoard/MyCourses/UpdateCourse";
import CourseReviews from "../DashBoardPages/InstructorDashBoard/Reviews/CourseReviews";
import PrivateRoutes from "./PrivateRoutes";

const instructorRoutes = [
    {
        path: 'instructor_dashboard',
        element: <PrivateRoutes userType='instructor'><InstructorDasboard /></PrivateRoutes>
    },
    {
        path: 'myCourses',
        element: <PrivateRoutes userType='instructor'><MyCourses /></PrivateRoutes>
    },
    {
        path: 'addCourse',
        element: <PrivateRoutes userType='instructor'><AddCourse /></PrivateRoutes>
    },
    {
        path: 'updateCourse',
        element: <PrivateRoutes userType='instructor'><UpdateCourse /></PrivateRoutes>
    },
    {
        path: 'courseReviews',
        element: <PrivateRoutes userType='instructor'><CourseReviews /></PrivateRoutes>
    }
];

export default instructorRoutes;