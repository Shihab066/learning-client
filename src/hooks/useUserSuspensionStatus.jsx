import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useState } from "react";

const useUserSuspensionStatus = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const [isSuspendedStatusLoading, setIsSuspendedStatusLoading] = useState(false);

    const { data: isUserSuspended = '',} = useQuery({
        queryKey: ['userSuspendedStatus', user],
        enabled: user !== null,
        queryFn: async () => {
            setIsSuspendedStatusLoading(true);
            const res = await axiosSecure.get(`/user/suspendedStatus/${user?.uid}`);
            setIsSuspendedStatusLoading(false);
            return res.data.suspended;
        }
    });
    
    return { isUserSuspended, isSuspendedStatusLoading };
};

export default useUserSuspensionStatus;