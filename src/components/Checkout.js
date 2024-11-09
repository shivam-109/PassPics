import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Load your publishable key from Stripe (replace with your own key)
const stripePromise = loadStripe('your_publishable_key'); // Replace with your actual Stripe publishable key

const CheckoutButton = () => {
  const handleCheckout = async () => {
    // Fetch a new Stripe checkout session from the server
    const response = await fetch('/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photoURL: 'example-url-of-photo', // Replace with actual data if needed
      }),
    });

    const session = await response.json();

    // Redirect to the Stripe checkout page
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error('Error redirecting to checkout:', error);
    }
  };

  return (
    <button onClick={handleCheckout}>
      Pay and Download Photo
    </button>
  );
};

export default CheckoutButton;
