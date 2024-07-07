import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import Home from "../Pages/Home/Home/Home";
import Classes from "../Pages/Classes/Classes";
import Instructors from "../Pages/Instructors/Instructors";
import DashBoard from "../Layout/DashBoard";
import SelectedClass from "../DashBoardPages/StudentDashBoard/SelectedClass";
import EnrolledClass from "../DashBoardPages/StudentDashBoard/EnrolledClass";
import PaymentHistory from "../DashBoardPages/StudentDashBoard/PaymentHistory";
import AddClass from "../DashBoardPages/InstructorDashBoard/AddClass";
import MyClass from "../DashBoardPages/InstructorDashBoard/MyClass";
import ManageClasses from "../DashBoardPages/AdminDashBoard/ManageClasses";
import ManageUser from "../DashBoardPages/AdminDashBoard/ManageUser";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import PrivateRoutes from "./PrivateRoutes";
import InstructorRoute from "./InstructorRoute";
import AdminRoutes from "./AdminRoutes";
import StudentRoutes from "./StudentRoutes";
import ScrollToTop from "../components/ClassCard/scrollToTop";
import Profile from "../Pages/Profile/Profile";


export const router = createBrowserRouter([
  {
    path: "/",
    element:
      <>
        <Main></Main>
        <ScrollToTop />
      </>,
    errorElement: <ErrorPage></ErrorPage>,
    children: [
      {
        path: '/',
        element: <Home></Home>
      },
      {
        path: 'login',
        element: <Login></Login>
      },
      {
        path: 'signup',
        element: <SignUp></SignUp>
      },
      {
        path: 'class',
        element: <Classes></Classes>,
      },
      {
        path: 'instructors',
        element: <Instructors></Instructors>
      },
      {
        path: 'profile',
        element:<Profile />
      },
      {
        path: 'dashboard',
        element: <PrivateRoutes><DashBoard></DashBoard></PrivateRoutes>,
        children: [
          // STUDENT ROUTES
          {
            path: 'selectedClass',
            element: <StudentRoutes><SelectedClass></SelectedClass></StudentRoutes>
          },
          {
            path: 'enrolledClass',
            element: <StudentRoutes><EnrolledClass></EnrolledClass></StudentRoutes>
          },
          {
            path: 'paymentHistory',
            element: <StudentRoutes><PaymentHistory></PaymentHistory></StudentRoutes>
          },

          // INSTRUCTOR ROUTES
          {
            path: 'addClass',
            element: <InstructorRoute><AddClass></AddClass></InstructorRoute>
          },
          {
            path: 'myClass',
            element: <InstructorRoute><MyClass></MyClass></InstructorRoute>
          },


          // ADMIN ROUTES
          {
            path: 'manageClass',
            element: <AdminRoutes><ManageClasses></ManageClasses></AdminRoutes>
          },
          {
            path: 'manageUser',
            element: <AdminRoutes><ManageUser></ManageUser></AdminRoutes>
          }
        ]
      }
    ]
  },
]);