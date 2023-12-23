import { NavLink, Outlet } from "react-router-dom";
import useUserRole from "../hooks/useUserRole";
import { Helmet } from "react-helmet-async";


const DashBoard = () => {
    const [userRole] = useUserRole();
    const isAdmin = userRole === 'admin';
    const isStudent = userRole === 'student';
    const isInstructor = userRole === 'instructor';
    return (
        <div className="lg-container pt-10">
            <Helmet>
                <title>Learning Point_Dashboard</title>
            </Helmet>
            <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex justify-center h-fit w-full">
                    {/* Page content here */}                   
                    <Outlet></Outlet>
                    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>
                </div>
                <div className="drawer-side h-[700px]">
                    <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
                    <ul className="menu p-4 w-64 h-full rounded-lg bg-gray-100 text-base-content">
                        {/* Sidebar content here */}
                        {isStudent &&
                            <>
                                <li><NavLink to="/dashboard/selectedClass">Selected Classes</NavLink></li>
                                <li><NavLink to="/dashboard/enrolledClass">Enrolled Classes</NavLink></li>
                                <li><NavLink to="/dashboard/paymentHistory">Payment History</NavLink></li>
                            </>
                        }

                        {isInstructor &&
                            <>
                                <li><NavLink to="/dashboard/myClass">My Classes</NavLink></li>
                                <li><NavLink to="/dashboard/addClass">Add a Class</NavLink></li>
                            </>
                        }

                        {isAdmin &&
                            <>
                                <li><NavLink to="/dashboard/manageClass">Manage Classes</NavLink></li>
                                <li><NavLink to="/dashboard/manageUser">Manage Users</NavLink></li>
                            </>
                        }
                    </ul>

                </div>
            </div>
        </div>
    );
};

export default DashBoard;