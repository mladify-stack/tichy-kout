import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.EMAIL_FROM ?? "Tichý kout <noreply@tichy-kout.cz>";

export async function sendOrderConfirmationEmail(params: {
  to: string;
  orderNumber: string;
  totalCents: number;
  recipientName: string;
}) {
  const { to, orderNumber, totalCents, recipientName } = params;
  const total = (totalCents / 100).toFixed(0);

  return resend.emails.send({
    from: fromEmail,
    to,
    subject: `Váš pohled je na cestě — ${orderNumber}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #3d4838;">
        <h1 style="font-weight: normal; font-size: 24px;">Děkujeme za důvěru</h1>
        <p>Váš pohled pro <strong>${recipientName}</strong> jsme přijali.</p>
        <p>Objednávka <strong>${orderNumber}</strong> · ${total} Kč</p>
        <p style="color: #788a68;">Brzy jej vytiskneme a odešleme poštou. Na cestě bude klid.</p>
        <hr style="border: none; border-top: 1px solid #e8ebe3; margin: 24px 0;" />
        <p style="font-size: 14px; color: #96a586;">Tichý kout · tichy-kout.cz</p>
      </div>
    `,
  });
}

export async function sendContactEmail(params: {
  name: string;
  email: string;
  message: string;
}) {
  const adminEmail = process.env.ADMIN_EMAILS?.split(",")[0]?.trim();
  if (!adminEmail) return null;

  return resend.emails.send({
    from: fromEmail,
    to: adminEmail,
    replyTo: params.email,
    subject: `Kontakt: ${params.name}`,
    text: `Od: ${params.name} (${params.email})\n\n${params.message}`,
  });
}
