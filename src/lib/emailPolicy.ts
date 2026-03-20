const disposableDomains = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "tempmail.com",
  "yopmail.com",
  "trashmail.com",
  "fakeinbox.com",
  "dispostable.com",
]);

const riskyLocalParts = ["test", "fake", "temp", "spam", "example"];

function extractDomain(email: string) {
  const at = email.lastIndexOf("@");
  return at === -1 ? "" : email.slice(at + 1).trim().toLowerCase();
}

function extractLocalPart(email: string) {
  const at = email.lastIndexOf("@");
  return at === -1 ? "" : email.slice(0, at).trim().toLowerCase();
}

export function validateSignupEmail(email: string) {
  const trimmed = email.trim().toLowerCase();
  const localPart = extractLocalPart(trimmed);
  const domain = extractDomain(trimmed);

  if (!trimmed || !trimmed.includes("@")) {
    return { allowed: false, reason: "Enter a valid email address." };
  }

  if (disposableDomains.has(domain)) {
    return { allowed: false, reason: "Disposable email providers are blocked." };
  }

  if (riskyLocalParts.some((value) => localPart.includes(value))) {
    return { allowed: false, reason: "Use a real inbox instead of a test or fake address." };
  }

  if (localPart.length < 2 || domain.length < 4) {
    return { allowed: false, reason: "That email looks incomplete." };
  }

  return { allowed: true as const };
}

// Server-side recommendation: add MX lookup, disposable domain reputation checks,
// and rate limits before sending any verification email through Resend.
