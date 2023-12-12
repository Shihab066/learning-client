import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import PaymentHistroyRow from "./PaymentHistroyRow";

const PaymentHistory = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const { data: paymentsData = [] } = useQuery({
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
                            <th className="">Classes</th>   
                            <th>Email</th>
                            <th>Price</th>
                            <th>Transaction Id</th>
                            <th className="text-center">Enrolled Date</th>
                            <th className="text-center">Enrolled Time</th>
                        </tr>
                    </thead>
                    <tbody>                       
                        {
                            paymentsData.map(paymentData => <PaymentHistroyRow
                                key={paymentData._id}
                                paymentData={paymentData}                                
                            ></PaymentHistroyRow>)
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentHistory;