import { Navigate } from "react-router-dom";
import MyClasses from "../DashBoardPages/StudentDashboard/MyClasses/MyClasses";
import Cart from "../Pages/Cart/Cart";
import PaymentSuccess from "../Pages/PaymentSuccess/PaymentSuccess";
import ViewCourse from "../Pages/ViewCourse/ViewCourse";
import Wishlist from "../Pages/WishList/Wishlist";
import PrivateRoutes from "./PrivateRoutes";
import PendingReviews from "../DashBoardPages/StudentDashboard/MyReviews/PendingReviews";
import MyReviewsHistory from "../DashBoardPages/StudentDashboard/MyReviews/MyReviewsHistory";
import MyReviews from "../DashBoardPages/StudentDashboard/MyReviews/MyReviews";
import Feedback from "../DashBoardPages/StudentDashboard/Feedback/Feedback";
import PurchaseHistory from "../DashBoardPages/StudentDashboard/PurchaseHistory/PurchaseHistory";


export const studentRoutes1 = [
    {
        path: 'cart',
        element: <PrivateRoutes userType='student'><Cart /></PrivateRoutes>
    },
    {
        path: 'wishlist',
        element: <PrivateRoutes userType='student'><Wishlist /></PrivateRoutes>
    },
    {
        path: 'paymentSuccess/:token/:sessionId',
        element: <PrivateRoutes userType='student'><PaymentSuccess /></PrivateRoutes>
    },
    {
        path: 'my-classes',
        element: <PrivateRoutes userType='student'><MyClasses /></PrivateRoutes>
    },
    {
        path: 'course/view/:courseId',
        element: <PrivateRoutes userType='student'><ViewCourse /></PrivateRoutes>
    }
];

export const studentRoutes2 = [
    {
        path: 'purchase-history',
        element: <PrivateRoutes userType='student'><PurchaseHistory /></PrivateRoutes>
    },
    {
        path: 'feedback',
        element: <PrivateRoutes userType='student'><Feedback /></PrivateRoutes>
    },
    {
        path: 'my-reviews',
        element: <PrivateRoutes userType='student'><MyReviews /></PrivateRoutes>,
        children: [
            {
                path: '/user/my-reviews',
                element: <Navigate to='pending-reviews' />
            },
            {
                path: 'pending-reviews',
                element: <PrivateRoutes userType='student'><PendingReviews /></PrivateRoutes>
            },
            {
                path: 'reviews-history',
                element: <PrivateRoutes userType='student'><MyReviewsHistory /></PrivateRoutes>
            }
        ]
    }
];