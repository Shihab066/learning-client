
import useAuth from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoutes = ({ children }) => {
    const location = useLocation();
    const { user,loading } = useAuth();          
    if (loading) {
        return <div className='flex justify-center items-center h-[700px] '>
            <span className="loading loading-spinner text-info loading-lg"></span>
        </div>
    }

    if (user) {
        return children
    }

    return <Navigate to='/login' state={{ from: location }} replace></Navigate>
};

export default PrivateRoutes;