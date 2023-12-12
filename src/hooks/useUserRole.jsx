import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import axios from "axios";

const useUserRole = () => {
    const {user, loading} = useAuth();     
    const {data: userRole, isLoading: isUserRoleLoading} = useQuery({
        queryKey: ['userRole', user?.email],
        enabled: !loading,
        queryFn: async () => {
            const res = await axios.get(`https://summer-camp-school-server-zeta.vercel.app/users/${user?.email}`);
            return res.data;
        }
    })    
    return [userRole, isUserRoleLoading]
};

export default useUserRole;