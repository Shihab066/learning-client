import { loadStripe } from '@stripe/stripe-js';

// Load your publishable key from the Stripe Dashboard
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);

export const checkout = async (axiosSecure, products, userId) => {
  const stripe = await stripePromise;

  // Call backend to create a checkout session
  const response = await axiosSecure.post(`/payment/create-checkout-session`, { userId, products });

  const session = response.data;

  // Redirect to Stripe Checkout
  const result = await stripe.redirectToCheckout({
    sessionId: session.id,
  });

  if (result.error) {
    alert(result.error.message);
  }
};

export const expireSession = async (axiosSecure, sessionInfo) => {
  await axiosSecure.post(`/payment/expire-session`, sessionInfo);
};

export const getPurchaseHistory = async (axiosSecure, studentId) => {
  const res = await axiosSecure.get(`/payment/get/${studentId}`);
  return res.data;
};