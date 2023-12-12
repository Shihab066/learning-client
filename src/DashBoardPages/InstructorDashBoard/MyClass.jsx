
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import MyClassRow from "./MyClassRow";
import { useQuery } from "@tanstack/react-query";


const MyClass = () => {
    const { user, loading } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const { data: classes = [],refetch} = useQuery({
        queryKey: ['classes', user?.email],
        enabled: !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/classes/${user?.email}`);
            return res.data;
        }
    })
    return (
        <div className="overflow-auto w-full h-[700px] ml-5 rounded-lg shadow-xl">
            <table className="table">
                {/* head */}
                <thead className="bg-base-300 text-[14px] text-gray-600">
                    <tr>
                        <th className="w-8/12">Classes</th>
                        <th>Price</th>
                        <th>Total Students</th>
                        <th>Available Seats</th>
                        <th>Feedback</th>
                        <th className="text-center">Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    {
                        classes.map(classData => <MyClassRow
                            key={classData._id}
                            classData={classData}
                            refetch={refetch}
                        ></MyClassRow>)
                    }

                </tbody>


            </table>
        </div>
    );
};

export default MyClass;