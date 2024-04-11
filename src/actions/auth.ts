"use server";

import prisma from "@/db";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import otpGenerator from "otp-generator";

export async function registerUser(email: string, password: string) {
  await prisma.user.create({
    data: {
      email,
      password,
      verified: true,
    },
  });
}

export async function sendMail(email: string) {
  // Check for empty email
  if (!email) {
    return { status: 400, message: "Email Empty" };
  }

  // Check for valid email
  const userExists = await prisma.user.findFirst({
    where: { email },
  });
  if (userExists) {
    return {
      status: 400,
      message: "User Already Exists",
    };
  }

  // Generate OTP
  const otp: string = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });

  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    // Configure Transporter
    const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
      nodemailer.createTransport({
        service: "gmail",
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

    // Mail Options
    const mailOptions = {
      from: process.env.USER,
      to: email,
      subject: "Email Verification",
      html: `<h1>${otp}</h1>`,
    };

    try {
      // Send Mail
      const mailResponse: SMTPTransport.SentMessageInfo =
        await transporter.sendMail(mailOptions);

      // Create/Update OTP in the DB
      if (mailResponse.accepted) {
        // Create OTP with userId as Foreign Key
        const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);
        const existingOTP = await prisma.otp.findFirst({
          where: {
            email,
          },
        });

        let newOTP;

        if (existingOTP) {
          newOTP = await prisma.otp.update({
            data: {
              otp,
              expiresAt,
            },
            where: {
              id: existingOTP.id,
            },
          });
        } else {
          newOTP = await prisma.otp.create({
            data: {
              otp,
              expiresAt,
              email,
            },
          });
        }
        return {
          status: 200,
          message: "OTP Sent Successfully",
          otpId: newOTP.id,
        };
      }
    } catch (error) {
      console.log(error);
      return { status: 400, message: "Failed to send OTP" };
    }
  }
  return { status: 500, message: "Internal Server Error" };
}
