import { loadStripe } from '@stripe/stripe-js';
import api from './baseAPI';

// Load your publishable key from the Stripe Dashboard
const stripePromise = loadStripe(import.meta.env.VITE_PAYMENT_KEY);

export const checkout = async (products, userId) => {
  const stripe = await stripePromise;

  // Call backend to create a checkout session
  const response = await api.post(`payment/create-checkout-session`, { userId, products });

  const session = response.data;

  // Redirect to Stripe Checkout
  const result = await stripe.redirectToCheckout({
    sessionId: session.id,
  });

  if (result.error) {
    alert(result.error.message);
  }
};

export const expireSession = async (sessionInfo) => {
  await api.post(`payment/expire-session`, sessionInfo);
};

export const getPurchaseHistory = async (studentId) => {
  const res = await api.get(`payment/get/${studentId}`);
  return res.data;
};