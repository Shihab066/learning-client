// success.js (frontend page for successful checkout)
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import api from '../../services/baseAPI';
import { useQuery } from '@tanstack/react-query';

const PaymentSuccess = () => {
    const { sessionId, token } = useParams();

    const { data: paymentSuccessStatus, isLoading } = useQuery({
        queryKey: ['paymentStatus'],
        queryFn: async () => {
            const res = await api.get(`payment/retrieve-checkout-session/${sessionId}/${token}`)
            return res.data;
        }
    })
console.log(paymentSuccessStatus);

    return (
        <div>
            ...
        </div>
    );
};

export default PaymentSuccess;
