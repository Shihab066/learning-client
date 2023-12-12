
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);
const Payments = ({ price,classData,refetch }) => {
    const totalPrice = parseFloat(price.toFixed(2));
    return (
        <div>            
            <Elements stripe={stripePromise}>
                <CheckoutForm
                    price={totalPrice}
                    classData={classData}
                    refetch={() => refetch()}
                ></CheckoutForm>
            </Elements>
        </div>
    );
};

export default Payments;