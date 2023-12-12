import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import SelectedClassRow from "./SelectedClassRow";

const SelectedClass = () => {
    const { user } = useAuth()
    const [axiosSecure] = useAxiosSecure();
    const { data: classes = [], refetch } = useQuery({
        queryKey: ['classes', user?.email],        
        queryFn: async () => {
            const res =await axiosSecure.get(`/selectedClass/${user?.email}`)
            return res.data;
        }
    });

    return (
        <div className=" overflow-auto w-[1000px] h-[700px] ml-3 rounded-lg shadow-xl">
            <table className="table">
                <thead className="bg-base-300 text-[14px] text-gray-600">
                    <tr>
                        <th className="w-5/12">Classes</th>
                        <th>Instructor Name</th>
                        <th>Price</th>
                        <th className="text-center">Buy</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        classes.map(classData => <SelectedClassRow
                            key={classData._id}
                            classData={classData}
                            refetch={refetch}
                        ></SelectedClassRow>)
                    }
                </tbody>
            </table>
        </div>
    );
};

export default SelectedClass;