import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import EnrolledClassRow from "./EnrolledClassRow";

const EnrolledClass = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const { data: paymentsData = [], refetch } = useQuery({
        queryKey: ['paymentsData', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/paymentsData/${user?.email}`)
            return res.data;
        }
    });
    return (
        <div>
            <div className=" overflow-auto w-[1000px] h-[700px] ml-3 rounded-lg shadow-xl">            
                <table className="table">                    
                    <thead className="bg-base-300 text-[14px] text-gray-600">                              
                        <tr>
                            <th className="w-5/12">Classes</th>
                            <th>Instructor Name</th>
                            <th>Price</th>
                            <th className="text-center">Enrolled Date</th>
                        </tr>
                    </thead>
                    <tbody>                       
                        {
                            paymentsData.map(paymentData => <EnrolledClassRow
                                key={paymentData._id}
                                paymentData={paymentData}
                                refetch={refetch}
                            ></EnrolledClassRow>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EnrolledClass;