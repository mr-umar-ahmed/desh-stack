import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// You should verify a domain in Resend and replace this with something like "notifications@yourdomain.com"
// For now, testing with Resend usually requires sending FROM "onboarding@resend.dev"
const FROM_EMAIL = 'onboarding@resend.dev';

export async function sendVendorApprovedEmail(email: string, name: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email, // Note: In testing on free tier, you can only send to your verified email address.
      subject: 'Welcome to DeshStack Publishers!',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Congratulations, ${name || 'Vendor'}!</h2>
          <p>Your publisher account on DeshStack has been approved.</p>
          <p>You can now log in, upgrade your plan if needed, and start listing your software products for Indian businesses to discover.</p>
          <br/>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Go to Dashboard
          </a>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send vendor approval email:", error);
  }
}

export async function sendProductApprovedEmail(email: string, productName: string, productSlug: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your Product is Live on DeshStack!',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Great news!</h2>
          <p>Your product <strong>${productName}</strong> has been approved by our moderation team.</p>
          <p>It is now live on DeshStack and visible to thousands of Indian businesses.</p>
          <br/>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products/${productSlug}" style="background-color: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            View Your Product
          </a>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send product approval email:", error);
  }
}
