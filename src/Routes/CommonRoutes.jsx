import Login from "../Pages/Authentication/Login/Login";
import AddNewPassword from "../Pages/Authentication/PassowrdReset/AddNewPassword";
import PasswordReset from "../Pages/Authentication/PassowrdReset/PasswordReset";
import SignUp from "../Pages/Authentication/SignUp/SignUp";
import CourseDetails from "../Pages/CourseDetailsPage/CourseDetails";
import Courses from "../Pages/Courses/Courses";
import Home from "../Pages/Home/Home/Home";
import InstructorProfile from "../Pages/InstructorProfile/InstructorProfile";
import Instructors from "../Pages/Instructors/Instructors";
import Notifications from "../Pages/Notifications/Notifications";
import PrivateRoutes from "./PrivateRoutes";

const commonRoutes = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: 'login',
        element: <Login />
    },
    {
        path: 'signup',
        element: <SignUp />
    },
    {
        path: 'courses',
        element: <Courses />
    },
    {
        path: 'course/:courseId',
        element: <CourseDetails />
    },
    {
        path: 'instructors',
        element: <Instructors />
    },
    {
        path: 'instructor/:instructorId',
        element: <InstructorProfile />
    },
    {
        path: 'account_recovery',
        element: <PasswordReset />
    },
    {
        path: 'password_reset',
        element: <AddNewPassword />
    },
    {
        path: 'notification',
        element: <PrivateRoutes userType='any'><Notifications /></PrivateRoutes>
    }
]

export default commonRoutes;