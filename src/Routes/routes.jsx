import { createBrowserRouter, Navigate } from "react-router-dom";
import Main from "../Layout/Main";
import Login from "../Pages/Authentication/Login/Login";
import SignUp from "../Pages/Authentication/SignUp/SignUp";
import Home from "../Pages/Home/Home/Home";
import Instructors from "../Pages/Instructors/Instructors";
import ErrorPage from "../Pages/ErrorPage/ErrorPage";
import PrivateRoutes from "./PrivateRoutes";
import InstructorRoute from "./InstructorRoute";
import AdminRoutes from "./AdminRoutes";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import Profile from "../Pages/Authentication/Profile/Profile";
import PasswordReset from "../Pages/Authentication/PassowrdReset/PasswordReset";
import AddNewPassword from "../Pages/Authentication/PassowrdReset/AddNewPassword";
import CourseDetails from "../Pages/CourseDetailsPage/CourseDetails";
import InstructorProfile from "../Pages/InstructorProfile/InstructorProfile";
import ProfileLayout from "../Layout/ProfileLayout";
import MyCourses from "../DashBoardPages/InstructorDashBoard/MyCourses/MyCourses";
import CourseReviews from "../DashBoardPages/InstructorDashBoard/Reviews/CourseReviews";
import UpdateCourse from "../DashBoardPages/InstructorDashBoard/MyCourses/UpdateCourse";
import Courses from "../Pages/Courses/Courses";
import Cart from "../Pages/Cart/Cart";
import Wishlist from "../Pages/WishList/Wishlist";
import Notifications from "../Pages/Notifications/Notifications";
import PaymentSuccess from "../Pages/PaymentSuccess/PaymentSuccess";
import MyClasses from "../DashBoardPages/StudentDashboard/MyClasses/MyClasses";
import PurchaseHistory from "../DashBoardPages/StudentDashboard/PurchaseHistory/PurchaseHistory";
import MyReviews from "../DashBoardPages/StudentDashboard/MyReviews/MyReviews";
import PendingReviews from "../DashBoardPages/StudentDashboard/MyReviews/PendingReviews";
import MyReviewsHistory from "../DashBoardPages/StudentDashboard/MyReviews/MyReviewsHistory";
import Feedback from "../DashBoardPages/StudentDashboard/Feedback/Feedback";
import ViewCourse from "../Pages/ViewCourse/ViewCourse";
import Dashboard from "../DashBoardPages/AdminDashBoard/Dashboard/Dashboard";
import ManageCourse from "../DashBoardPages/AdminDashBoard/ManageCourse/ManageCourse";
import ManageUser from "../DashBoardPages/AdminDashBoard/ManageUser/ManageUser";
import BannerManagement from "../DashBoardPages/AdminDashBoard/BannerManagement/BannerManagement";
import ManageSuspention from "../DashBoardPages/AdminDashBoard/ManageSuspention/ManageSuspention";
import InstructorDasboard from "../DashBoardPages/InstructorDashBoard/Dashboard/InstructorDashboard";
import AddCourse from "../DashBoardPages/InstructorDashBoard/AddCourse";


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
        path: 'cart',
        element: <Cart />
      },
      {
        path: 'wishlist',
        element: <Wishlist />
      },
      {
        path: 'notification',
        element: <Notifications />
      },
      {
        path: 'paymentSuccess/:token/:sessionId',
        element: <PaymentSuccess />
      },
      {
        path: 'my-classes',
        element: <MyClasses />
      },
      {
        path: 'course/view/:courseId',
        element: <ViewCourse />
      },
      // {
      //   path: 'dashboard',
      //   element: <PrivateRoutes><DashBoard></DashBoard></PrivateRoutes>,
      //   children: [
      //     // STUDENT ROUTES
      //     // {
      //     //   path: 'selectedClass',
      //     //   element: <StudentRoutes><SelectedClass></SelectedClass></StudentRoutes>
      //     // },
      //     // {
      //     //   path: 'enrolledClass',
      //     //   element: <StudentRoutes><EnrolledClass></EnrolledClass></StudentRoutes>
      //     // },
      //     // {
      //     //   path: 'paymentHistory',
      //     //   element: <StudentRoutes><PaymentHistory></PaymentHistory></StudentRoutes>
      //     // },

      //     // INSTRUCTOR ROUTES
      //     {
      //       path: 'addClass',
      //       element: <InstructorRoute><AddClass></AddClass></InstructorRoute>
      //     },
      //     // {
      //     //   path: 'myClass',
      //     //   element: <InstructorRoute><MyClass></MyClass></InstructorRoute>
      //     // },


      //     // ADMIN ROUTES
      //     {
      //       path: 'manageClass',
      //       element: <AdminRoutes><ManageClasses></ManageClasses></AdminRoutes>
      //     },
      //     {
      //       path: 'manageUser',
      //       element: <AdminRoutes><ManageUser></ManageUser></AdminRoutes>
      //     }
      //   ]
      // },
      {
        path: 'user',
        element: <ProfileLayout />,
        children: [
          {
            path: '/user',
            element: <Navigate to='error404' />
          },
          {
            path: 'profile',
            element: <Profile />
          },
          // Admin Routes
          {
            path: 'dashboard',
            element: <Dashboard />
          },
          {
            path: 'manage-course',
            element: <ManageCourse />
          },
          {
            path: 'manage-user',
            element: <ManageUser />
          },
          {
            path: 'banner-management',
            element: <BannerManagement />
          },         
          {
            path: 'manage-suspension',
            element: <ManageSuspention />
          },         
          // INSTRUCTOR ROUTES
          {
            path: 'instructor_dashboard',
            element: <InstructorDasboard/>
          },
          {
            path: 'myCourses',
            element: <MyCourses />
          },
          {
            path: 'addCourse',
            element: <AddCourse />
          },
          {
            path: 'updateCourse',
            element: <UpdateCourse />
          },
          {
            path: 'courseReviews',
            element: <CourseReviews />
          },
          // STUDENT ROUTES       
          {
            path: 'purchase-history',
            element: <PurchaseHistory />
          },
          {
            path: 'feedback',
            element: <Feedback />
          },
          {
            path: 'my-reviews',
            element: <MyReviews />,
            children: [
              {
                path: '/user/my-reviews',
                element: <Navigate to='pending-reviews' />
              },
              {
                path: 'pending-reviews',
                element: <PendingReviews />
              },
              {
                path: 'reviews-history',
                element: <MyReviewsHistory />
              }
            ]
          }
        ]
      }
    ]
  },
]);