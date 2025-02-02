
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';
import useUserRole from '../hooks/useUserRole';
import Loading from '../components/Loading/Loading';

const PrivateRoutes = ({ type, children }) => {
    const location = useLocation();
    const { user, loading } = useAuth();
    const [userRole, isUserRoleLoading] = useUserRole();

    if (loading || isUserRoleLoading) {
        return <Loading />
    }

    if (user && type === userRole) {
        return children
    }
    else if (user && type !== userRole) {
        return <Navigate to='/error404' />
    }

    return <Navigate to='/login' state={{ from: location }} replace></Navigate>
};

export default PrivateRoutes;