import { loadStripe, type Stripe } from "@stripe/stripe-js";

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim();

export const stripeReady = Boolean(publishableKey);

export const stripePromise: Promise<Stripe | null> | null = publishableKey
  ? loadStripe(publishableKey)
  : null;

export function getStripeSetupMessage() {
  return "Configure VITE_STRIPE_PUBLISHABLE_KEY for checkout, and keep STRIPE_SECRET_KEY on the server for webhooks and session creation.";
}
