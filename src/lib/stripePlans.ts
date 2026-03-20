import type { PlanName } from "@/lib/subscriptions";

export type StripePlan = {
  id: PlanName;
  label: string;
  price: string;
  description: string;
  priceEnvKey: string;
  features: string[];
};

export const stripePlans: StripePlan[] = [
  {
    id: "free",
    label: "Free",
    price: "$0",
    description: "For testing the product and generating a small number of models.",
    priceEnvKey: "STRIPE_PRICE_ID_FREE",
    features: ["3 generations per month", "Library access", "Community support"],
  },
  {
    id: "pro",
    label: "Pro",
    price: "$29",
    description: "For individual builders who need a reliable generation flow.",
    priceEnvKey: "STRIPE_PRICE_ID_PRO",
    features: ["50 generations per month", "Priority queue", "Commercial usage"],
  },
  {
    id: "premium",
    label: "Premium",
    price: "$79",
    description: "For teams that need the fastest turnaround and higher quotas.",
    priceEnvKey: "STRIPE_PRICE_ID_PREMIUM",
    features: ["Unlimited-ish monthly quota", "Fastest provider routing", "Team-ready workflows"],
  },
];
