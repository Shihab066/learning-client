import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useUserSuspensionStatus = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();

    const { data: isUserSuspended = '', isLoading: isSuspendedStatusLoading } = useQuery({
        queryKey: ['userSuspendedStatus', user?.uid],
        enabled: user !== null,
        queryFn: async () => {
            const res = await axiosSecure.get(`/user/suspendedStatus/${user?.uid}`);
            return res.data.suspended;
        }
    });
    return { isUserSuspended, isSuspendedStatusLoading };
};

export default useUserSuspensionStatus;