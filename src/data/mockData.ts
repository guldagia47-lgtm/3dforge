export const dashboardStats = [
  { label: "Credits left", value: "128", detail: "+24 from last cycle" },
  { label: "Active jobs", value: "3", detail: "2 in queue, 1 refining" },
  { label: "Completion rate", value: "94%", detail: "Last 30 days" },
  { label: "Avg. turnaround", value: "4m 18s", detail: "Tripo + Meshy pipeline" },
];

export const planCards = [
  {
    name: "Free",
    price: "$0",
    badge: "Starter access",
    description: "Useful for testing the flow and keeping a small personal library.",
    features: ["3 generations per month", "Basic preview", "Email support"],
  },
  {
    name: "Pro",
    price: "$29",
    badge: "Best for creators",
    description: "A balanced plan for solo users who ship models frequently.",
    features: ["50 generations per month", "Priority jobs", "Stripe checkout"],
  },
  {
    name: "Premium",
    price: "$79",
    badge: "Best for teams",
    description: "Built for teams that need faster routing and higher throughput.",
    features: ["High monthly quota", "Fastest routing", "Team support"],
  },
];

export const recentJobs = [
  { name: "City scooter", status: "Completed", provider: "Meshy AI", time: "8 min ago" },
  { name: "Shoe concept", status: "Refining", provider: "Tripo AI", time: "22 min ago" },
  { name: "Desk lamp", status: "Queued", provider: "Tripo AI", time: "41 min ago" },
  { name: "Helmet kit", status: "Failed", provider: "Meshy AI", time: "Yesterday" },
];

export const landingSteps = [
  {
    title: "Prompt and reference",
    body: "Start with a text prompt, add images, and define the target style and export format.",
  },
  {
    title: "Generate and refine",
    body: "Send the job through Tripo AI for creation, then let Meshy AI refine topology and texture.",
  },
  {
    title: "Review and ship",
    body: "Store the asset in the library, preview it in the browser, and export the files your team needs.",
  },
];

export const landingPillars = [
  {
    title: "Prompt plus visuals",
    body: "Users can combine text instructions with reference images to steer generation with more precision.",
  },
  {
    title: "Tripo AI and Meshy AI",
    body: "The app routes requests through the right provider and normalizes every response into one clean workflow.",
  },
  {
    title: "Library first",
    body: "Every finished model is saved to Supabase so the user can revisit, preview, and delete assets later.",
  },
];

export const dashboardFocus = [
  {
    title: "Generation pace",
    body: "Keep users moving by surfacing active jobs, average turnaround, and one clear next action.",
  },
  {
    title: "Account health",
    body: "Make billing and verification visible so users always know why features are available or blocked.",
  },
  {
    title: "Saved work",
    body: "Place the most recent assets at the center of the dashboard so returning users feel progress immediately.",
  },
];

export const libraryAssets = [
  {
    name: "Aurora Speaker",
    provider: "Meshy AI",
    format: "GLB",
    status: "Ready",
    updated: "2h ago",
  },
  {
    name: "Retro Drone",
    provider: "Tripo AI",
    format: "OBJ",
    status: "Ready",
    updated: "5h ago",
  },
  {
    name: "Travel Mug",
    provider: "Meshy AI",
    format: "GLTF",
    status: "Draft",
    updated: "Yesterday",
  },
  {
    name: "Task Chair",
    provider: "Tripo AI",
    format: "FBX",
    status: "Ready",
    updated: "2 days ago",
  },
];