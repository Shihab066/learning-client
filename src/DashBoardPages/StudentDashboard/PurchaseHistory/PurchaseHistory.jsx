import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import { getPurchaseHistory } from '../../../services/paymentService';
import { Link } from 'react-router-dom';
import Loading from '../../../components/Loading/Loading';
import EmptyPage from '../../../components/EmptyPage/EmptyPage';
import formatDate from '../../../utils/formatDate';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

// Order row component for each purchase item
const OrderRow = ({ data }) => (
    <tr className='flex flex-col md:table-row'>
        {/* Order ID */}
        <td className='order-2 px-0 sm:px-4'>
            <div className='flex items-center'>
                <div className='w-[25%] font-medium text-gray-500 md:hidden'>Order</div>
                {data._id}
            </div>
        </td>

        {/* Course List */}
        <td className='order-1 px-0 sm:px-4'>
            <div className='space-y-2'>
                {data.courses.map(({ courseId, courseName }, index) => (
                    <div key={index} className='flex items-center gap-x-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='min-w-[1.5rem] w-6' viewBox="0 0 24 24">
                            <path fill="currentColor" d="M16.904 20.058L20 18.116l-3.096-1.943zM6.769 8.73h10.462v-1H6.769zM18 22.116q-1.671 0-2.835-1.165Q14 19.787 14 18.116t1.165-2.836T18 14.116t2.836 1.164T22 18.116q0 1.67-1.164 2.835Q19.67 22.116 18 22.116M4 20.769V5.616q0-.672.472-1.144T5.616 4h12.769q.67 0 1.143.472q.472.472.472 1.144v5.944q-.244-.09-.484-.154q-.241-.064-.516-.1v-5.69q0-.231-.192-.424T18.384 5H5.616q-.231 0-.424.192T5 5.616V19.05h6.344q.068.41.176.802q.109.392.303.748l-.034.034l-1.135-.826l-1.346.961l-1.346-.961l-1.346.961l-1.347-.961zm2.77-4.5h4.709q.056-.275.138-.515t.192-.485H6.77zm0-3.769h7.31q.49-.387 1.05-.645q.56-.259 1.197-.355H6.769zM5 19.05V5z" />
                        </svg>
                        <Link to={`/course/${courseId}`} className='text-blue-700 text-base'>{courseName}</Link>
                    </div>
                ))}
            </div>
        </td>

        {/* Purchase Date */}
        <td className='order-3 px-0 sm:px-4'>
            <div className='flex items-center'>
                <div className='w-[25%] font-medium text-gray-500 md:hidden'>Date</div>
                {formatDate(data.purchaseDate)}
            </div>
        </td>

        {/* Total Amount */}
        <td className='order-4 px-0 sm:px-4'>
            <div className='flex items-center'>
                <div className='w-[25%] font-medium text-gray-500 md:hidden'>Total</div>
                ${data.amount}
            </div>
        </td>

        {/* Receipt Link */}
        <td className='order-5 px-0 sm:px-4'>
            <div>
                <a href={data.receipt} target='_blank' rel="noreferrer" className='md:w-24 h-7 border border-black hover:bg-base-200 flex justify-center items-center font-medium'>
                    Receipt
                </a>
            </div>
        </td>
    </tr>
);

const PurchaseHistory = () => {
    const { user } = useAuth();
    const [axiosSecure] = useAxiosSecure();
    const { data: purchaseData = [], isLoading: isPurchaseDataLoading } = useQuery({
        queryKey: ['paymentsData'],
        enabled: !!user,
        queryFn: () => getPurchaseHistory(axiosSecure, user.uid)
    });

    return (
        <div className='lg:px-2 xl:px-0'>
            <div>
                <h2 className='text-xl font-medium mb-4 mt-6 xl:mt-0'>Purchase History</h2>
            </div>
            {
                isPurchaseDataLoading
                    ? <Loading />
                    : purchaseData.length > 0
                        ? (
                            <table className="table">
                                {/* Table Head */}
                                <thead className='hidden md:table-header-group'>
                                    <tr>
                                        <th className='w-[20%]'>Order #</th>
                                        <th className='w-[50%]'>Course</th>
                                        <th className='min-w-[8rem]'>Date</th>
                                        <th className='w-[10%]'>Total</th>
                                        <th className='w-[10%]'></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseData.map((data, index) => (
                                        <OrderRow key={index} data={data} />
                                    ))}
                                </tbody>
                            </table>
                        )
                        : <EmptyPage text="It looks like you haven't made any purchases yet." />
            }
        </div>
    );
};

export default PurchaseHistory;