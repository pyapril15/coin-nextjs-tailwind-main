import nodemailer from 'nodemailer';

const email = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: email,
    pass,
  },
});

export const sendMail = async (to: string, subject: string, html: string) => {
  if (!email || !pass) {
    console.warn("⚠️ SMTP keys missing in .env. Logging email payload to terminal instead:");
    console.log("============================");
    console.log(`📩 To: ${to}\n📑 Subject: ${subject}\n\n${html}`);
    console.log("============================");
    return;
  }
  
  try {
    await transporter.sendMail({
      from: `"Coin App Enterprise" <${email}>`,
      to,
      subject,
      html,
    });
    console.log("📧 Authentication Email Dispatched Successfully");
  } catch (error) {
    console.error("🚨 Nodemailer sending failure:", error);
  }
};
