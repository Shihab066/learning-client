import BannerManagement from "../DashBoardPages/AdminDashBoard/BannerManagement/BannerManagement";
import Dashboard from "../DashBoardPages/AdminDashBoard/Dashboard/Dashboard";
import ManageCourse from "../DashBoardPages/AdminDashBoard/ManageCourse/ManageCourse";
import ManageSuspention from "../DashBoardPages/AdminDashBoard/ManageSuspention/ManageSuspention";
import ManageUser from "../DashBoardPages/AdminDashBoard/ManageUser/ManageUser";
import PrivateRoutes from "./PrivateRoutes";

const adminRoutes = [
    {
        path: 'dashboard',
        element: <PrivateRoutes userType='admin'><Dashboard /></PrivateRoutes>
    },
    {
        path: 'manage-course',
        element: <PrivateRoutes userType='admin'><ManageCourse /></PrivateRoutes>
    },
    {
        path: 'manage-user',
        element: <PrivateRoutes userType='admin'><ManageUser /></PrivateRoutes>
    },
    {
        path: 'banner-management',
        element: <PrivateRoutes userType='admin'><BannerManagement /></PrivateRoutes>
    },
    {
        path: 'manage-suspension',
        element: <PrivateRoutes userType='admin'><ManageSuspention /></PrivateRoutes>
    }
];

export default adminRoutes;