import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import api from "../services/baseAPI";

const useUserRole = () => {
    const { user } = useAuth();
    const { data: userRole, isLoading } = useQuery({
        queryKey: ['userRole', user],
        enabled: user !== null,
        queryFn: async () => {
            const res = await api.get(`/user/role/${user?.uid}`);
            return res.data.role;
        }
    });
    const isUserRoleLoading = user ? isLoading : false;

    return [userRole, isUserRoleLoading];
};

export default useUserRole;