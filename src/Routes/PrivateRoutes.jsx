
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import useUserRole from '../hooks/useUserRole';
import Loading from '../components/Loading/Loading';
import useUserSuspensionStatus from '../hooks/useUserSuspensionStatus';
import SuspendPage from '../components/SuspendPage/SuspendPage';

const PrivateRoutes = ({ userType, children }) => {
    const location = useLocation();
    const { user, loading } = useAuth();
    const [userRole, isUserRoleLoading] = useUserRole();
    const { isUserSuspended, isSuspendedStatusLoading } = useUserSuspensionStatus();

    if (loading || isUserRoleLoading || isSuspendedStatusLoading) {
        return <Loading />
    }

    if (isUserSuspended) {
        return <SuspendPage />
    }

    if (user && userType === 'any') {
        return children
    }
    else if (user && userType === userRole) {
        return children
    }
    else if (user && userType !== userRole) {
        return <Navigate to='/error404' />
    }

    return <Navigate to='/login' state={{ from: location }} replace></Navigate>
};

export default PrivateRoutes;