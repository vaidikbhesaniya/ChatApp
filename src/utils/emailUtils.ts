import nodemailer from "nodemailer";

function configureNodemailer() {
  return nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export default async function sendOTP(email: string, otp: string) {
  const transporter = configureNodemailer();
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: "Email Verification",
    html: `
    <h1>
      ${otp}
    </h1>
    `,
  };

  const mailResponse = await transporter.sendMail(mailOptions);
  return { mailResponse: mailResponse };
}
