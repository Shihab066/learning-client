
import {  useNavigate, useParams } from 'react-router-dom';
import api from '../../services/baseAPI';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../components/Loading/Loading';
import ErrorPage from '../ErrorPage/ErrorPage';
import { useLottie } from 'lottie-react';
import tickMarkAnimation from '../../assets/Animation/successAnimation.json';

const PaymentSuccess = () => {
    const { sessionId, token } = useParams();

    const { data: paymentStatus, isLoading } = useQuery({
        queryKey: ['paymentStatus'],
        queryFn: async () => {
            const res = await api.get(`payment/retrieve-checkout-session/${token}/${sessionId}/${token}`)
            return res.data;
        },
        refetchOnWindowFocus: false
    });

    return (
        <section className='lg-container'>
            {
                isLoading
                    ?
                    <Loading className='h-screen md:h-[32rem]' />
                    :
                    paymentStatus.success
                        ?
                        <SuccessPage />
                        :
                        <ErrorPage showButton={false} />
            }
        </section>
    );
};


const SuccessPage = ({ className = 'h-[25rem] xl:h-[30rem]' }) => {
    const navigate = useNavigate();

    const options = {
        animationData: tickMarkAnimation,
        loop: false,

    };
    const { View } = useLottie(options);

    return (
        <div className={`lg-container ${className} flex flex-col justify-center items-center`}>
            <div className="w-28 sm:w-32 md:w-40 lg:w-44 xl:w-52">
                {View}
            </div>
            <div className="text-center text-2xl md:text-3xl font-medium">
                Order Completed
            </div>
            <button onClick={() => navigate('/courses')} className='btn btn-md rounded-none normal-case mt-10 bg-black text-white hover:bg-black hover:bg-opacity-80'>
                Keep Shopping
            </button>
        </div>
    );
};


export default PaymentSuccess;
