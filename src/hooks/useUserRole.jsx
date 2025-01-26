import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import api from "../services/baseAPI";

const useUserRole = () => {
    const { user } = useAuth();    
    const { data: userRole, isLoading: isUserRoleLoading } = useQuery({
        queryKey: ['userRole', user?.uid],
        enabled: user !== null,
        queryFn: async () => {
            const res = await api.get(`/user/role/${user?.uid}`);
            return res.data.role;
        }
    });
    return [userRole, isUserRoleLoading];
};

export default useUserRole;