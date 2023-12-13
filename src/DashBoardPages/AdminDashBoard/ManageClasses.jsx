
import { useQuery } from "@tanstack/react-query";
import ManageClassRow from "./ManageClassRow";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ManageClasses = () => {   
    const [axiosSecure] = useAxiosSecure();
    const { data: classes = [], refetch } = useQuery({
        queryKey: ['classes'],
        queryFn: async () => {
            const res = await axiosSecure.get(`https://learning-info-bd.vercel.app/allClasses`);
            return res.data;
        }
    })    
    return (
        <div className=" overflow-auto w-[1000px] h-[700px] rounded-lg shadow-xl">
            <table className="table">
                {/* head */}
                <thead className="bg-base-300 text-[14px] text-gray-600">
                    <tr>
                        <th>Classes</th>
                        <th >Instructor Name</th>
                        {/* <th>Instructor Email</th> */}
                        <th>Available seats</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                        <th>Feedback</th>

                    </tr>
                </thead>
                <tbody className="text-center">
                    {/* row 1 */}
                    {
                        classes.map(classData => <ManageClassRow
                            key={classData._id}
                            classData={classData}
                            refetch= {refetch}
                        ></ManageClassRow>)
                    }

                </tbody>


            </table>
        </div>
    );
};

export default ManageClasses;