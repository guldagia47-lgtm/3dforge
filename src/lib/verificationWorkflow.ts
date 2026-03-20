export function buildVerificationSubject(productName: string) {
  return `Verify your ${productName} account`;
}

export function buildVerificationEmailHtml(params: { productName: string; verificationUrl: string; displayName?: string }) {
  const greeting = params.displayName ? `Hi ${params.displayName},` : "Hi there,";

  return `
    <div style="font-family: Inter, Arial, sans-serif; color: #0f172a; line-height: 1.6">
      <h1 style="margin:0 0 16px; font-size: 24px">Verify your ${params.productName} account</h1>
      <p style="margin:0 0 16px">${greeting}</p>
      <p style="margin:0 0 24px">Click the link below to confirm your email address and activate your session.</p>
      <p style="margin:0 0 24px">
        <a href="${params.verificationUrl}" style="display:inline-block; padding:12px 18px; background:#0f172a; color:#fff; text-decoration:none; border-radius:999px">
          Verify email
        </a>
      </p>
      <p style="margin:0; color:#475569; font-size:14px">If you did not create an account, you can ignore this email.</p>
    </div>
  `;
}

export function buildVerificationEmailText(params: { productName: string; verificationUrl: string; displayName?: string }) {
  const greeting = params.displayName ? `Hi ${params.displayName},` : "Hi there,";

  return `${greeting}\n\nVerify your ${params.productName} account by opening this link:\n${params.verificationUrl}\n\nIf you did not create an account, you can ignore this email.`;
}

export function buildVerificationEmailPayload(params: { productName: string; verificationUrl: string; displayName?: string }) {
  return {
    subject: buildVerificationSubject(params.productName),
    html: buildVerificationEmailHtml(params),
    text: buildVerificationEmailText(params),
  };
}

// Use this helper in a backend route that sends mail through Resend.
