import { loadStripe } from '@stripe/stripe-js';
import api from './baseAPI';

// Load your publishable key from the Stripe Dashboard
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY); 

export const checkout = async (products, userId) => {
    const stripe = await stripePromise;

    // Call backend to create a checkout session
    const response = await api.post(`payment/create-checkout-session`, { products });

    const session = response.data;

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    console.log(result)

    if (result.error) {
      alert(result.error.message);
    }
  };
