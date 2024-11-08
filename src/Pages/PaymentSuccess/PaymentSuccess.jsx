// success.js (frontend page for successful checkout)
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import api from '../../services/baseAPI';

const PaymentSuccess = () => {
    const [paymentInfo, setPaymentInfo] = useState(null);
    const { sessionId } = useParams();

    useEffect(() => {
        const handleRetrieveSession = async () => {
            try {
                const res = await api.get(`retrieve-checkout-session/${sessionId}`)
                console.log(res.data);
                
            } catch (error) {
                console.error('Error fetching payment info:', error)
            }
        }
        // Fetch session details using sessionId
        if (sessionId) {
            handleRetrieveSession();
        }
    }, []);

    return (
        <div>
            {paymentInfo ? (
                <div>
                    <h1>Payment Successful</h1>
                    <p>Customer ID: {paymentInfo.customerId}</p>
                    <p>User ID: {paymentInfo.userId}</p>
                    <p>Amount Paid: {paymentInfo.amount / 100} {paymentInfo.currency.toUpperCase()}</p>
                    <p>Payment Status: {paymentInfo.paymentStatus}</p>
                    {/* Add more info as needed */}
                </div>
            ) : (
                <p>Loading payment information...</p>
            )}
        </div>
    );
};

export default PaymentSuccess;
