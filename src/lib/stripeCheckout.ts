import { stripePlans } from "@/lib/stripePlans";
import type { PlanName } from "@/lib/subscriptions";
import { getStripeSetupMessage } from "@/lib/stripe";

type CreateCheckoutSessionInput = {
  plan: PlanName;
  email: string;
  userId: string;
};

export async function createCheckoutSession(input: CreateCheckoutSessionInput) {
  const plan = stripePlans.find((item) => item.id === input.plan);

  if (!plan || plan.id === "free") {
    return { ok: false as const, message: "Select a paid plan to create a checkout session." };
  }

  if (typeof import.meta.env === "undefined") {
    return { ok: false as const, message: getStripeSetupMessage() };
  }

  const priceId = import.meta.env[plan.priceEnvKey as keyof ImportMetaEnv]?.trim();

  if (!priceId) {
    return { ok: false as const, message: `Missing Stripe price ID for ${plan.label}.` };
  }

  return {
    ok: true as const,
    data: {
      checkoutUrl: `/api/stripe/checkout?plan=${input.plan}&priceId=${encodeURIComponent(priceId)}&userId=${encodeURIComponent(input.userId)}&email=${encodeURIComponent(input.email)}`,
      plan,
    },
  };
}
