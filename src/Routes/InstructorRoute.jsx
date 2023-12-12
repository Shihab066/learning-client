import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';

const InstructorRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [userRole, isUserRoleLoading] = useUserRole();
    const isInstructor = userRole === 'instructor';
    if (loading || isUserRoleLoading) {
        return <div className='flex justify-center items-center h-[700px] '>
            <span className="loading loading-spinner text-info loading-lg"></span>
        </div>
    }

    if (user && isInstructor) {
        return children
    }

    return <Navigate to='/error404'></Navigate>
};

export default InstructorRoute;