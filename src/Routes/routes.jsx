import { createBrowserRouter, Navigate } from "react-router-dom";
import Main from "../Layout/Main";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import PrivateRoutes from "./PrivateRoutes";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import Profile from "../Pages/Authentication/Profile/Profile";
import ProfileLayout from "../Layout/ProfileLayout";
import commonRoutes from "./CommonRoutes";
import { studentRoutes1, studentRoutes2 } from "./StudentRoutes";
import adminRoutes from "./AdminRoutes";
import instructorRoutes from "./InstructorRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element:
      <>
        <Main />
        <ScrollToTop />
      </>,
    errorElement: <ErrorPage />,
    children: [
      ...commonRoutes,      
      ...studentRoutes1,      
      {
        path: 'user',
        element: <PrivateRoutes userType='any'><ProfileLayout /></PrivateRoutes>,
        children: [
          {
            path: '/user',
            element: <Navigate to='error404' />
          },
          {
            path: 'profile',
            element: <PrivateRoutes userType='any'><Profile /></PrivateRoutes>
          },
          // Admin Routes
          ...adminRoutes
          ,
          // INSTRUCTOR ROUTES
          ...instructorRoutes
          ,
          // STUDENT ROUTES       
          ...studentRoutes2
        ]
      }
    ]
  },
]);