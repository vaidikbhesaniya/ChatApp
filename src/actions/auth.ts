"use server";

import prisma from "@/db";
import { generateJWT, verifyJWT } from "@/lib/auth";
import { genSalt, hash } from "bcrypt";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import otpGenerator from "otp-generator";

export async function registerUser(email: string, password: string) {
  await prisma.user.deleteMany();
  // Check foe unique email
  const user = await prisma.user.findFirst({ where: { email } });
  if (user) {
    return { status: 400, message: "Account already exists" };
  }

  // Hash password
  const salt = await genSalt(10);
  const hashedPassword = await hash(password, salt);

  // Create User
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  // Check for Error while creating user
  if (!newUser) {
    return { status: 400, message: "Failed to create account" };
  }

  // Generate Token
  const token = generateJWT(newUser.id);
  cookies().set("userDoc", token);

  // Check for Error while creating token
  if (!token) {
    return { status: 400, message: "Failed to create token" };
  }

  // Update the token for user
  await prisma.user.update({
    data: {
      token,
    },
    where: {
      id: newUser.id,
    },
  });

  return { status: 200, message: "Account Created Successfully" };
}

export async function sendMail(email: string) {
  // Check for empty email
  if (!email) {
    return { status: 400, message: "Email Empty" };
  }

  // Check for valid email
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return { status: 400, message: "Invalid Email" };
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
      console.log(mailResponse.accepted);

      // Create/Update OTP in the DB
      if (mailResponse.accepted) {
        // Create OTP with userId as Foreign Key
        const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);
        const existingOTP = await prisma.otp.findFirst({
          where: { userId: user.id },
        });

        if (existingOTP) {
          await prisma.otp.update({
            data: {
              otp,
              expiresAt,
            },
            where: {
              id: existingOTP.id,
            },
          });
        } else {
          await prisma.otp.create({
            data: {
              otp,
              expiresAt,
              userId: user.id,
            },
          });
        }
      }

      return { status: 200, message: "OTP Sent Successfully" };
    } catch (error) {
      console.log(error);

      return { status: 200, message: "Failed to send OTP" };
    }
  }
  return { status: 500, message: "Internal Server Error" };
}

export async function verifyEmail(otp: string) {
  if (!otp) {
    return { status: 400, message: "Invalid OTP" };
  }
  const token = cookies().get("userDoc");

  if (!token) {
    return { status: 400, message: "Invalid Token" };
  }

  const decodedUser = verifyJWT(token.value);
  console.log(decodedUser);

  const user = await prisma.user.findFirst({
    where: {},
  });
  if (!user) {
    return { status: 400, message: "User not found" };
  }

  const otpRecord = await prisma.otp.findFirst({ where: { userId: user.id } });
  if (!otpRecord) {
    return { status: 400, message: "Invalid OTP" };
  }

  if (otpRecord.otp !== otp) {
    return { status: 400, message: "Invalid OTP" };
  }

  if (otpRecord.expiresAt < new Date()) {
    return { status: 400, message: "OTP Expired" };
  }

  await prisma.user.update({
    data: {
      verified: true,
    },
    where: {
      id: user.id,
    },
  });

  return { status: 200, message: "Email Verified Successfully" };
}
