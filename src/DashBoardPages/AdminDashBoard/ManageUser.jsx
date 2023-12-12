import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import ManageUserRow from "./ManageUserRow";

const ManageUser = () => {
    const [axiosSecure] = useAxiosSecure();
    const { data: users = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users`);
            return res.data;
        }
    }) 
    console.log(users)
    return (
        <div className=" overflow-auto w-[1000px] h-[700px] rounded-lg shadow-xl">
            <table className="table">                
                <thead className="bg-base-300 text-[14px] text-gray-600">
                    <tr>
                        <th>Users</th>                        
                        <th>User Email</th>
                        <th>User Type</th>                        
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>                    
                    {
                        users.map(user => <ManageUserRow
                            key={user._id}
                            user={user}
                            refetch={refetch}
                        ></ManageUserRow>)
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ManageUser;