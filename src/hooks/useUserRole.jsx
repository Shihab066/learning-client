import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import axios from "axios";

const useUserRole = () => {
    const { user } = useAuth();    
    const { data: userRole, isLoading: isUserRoleLoading } = useQuery({
        queryKey: ['userRole', user?.uid],
        enabled: user !== null,
        queryFn: async () => {
            const res = await axios.get(`http://localhost:5000/api/v1/user/role/${user?.uid}`);
            return res.data.role;
        }
    });
    return [userRole, isUserRoleLoading];
};

export default useUserRole;