"use server";

import { createOTP } from "@/actions/otp";
import prisma from "@/db";
import { generateJWT } from "@/lib/auth";
import sendOTP from "@/utils/emailUtils";
import { cookies } from "next/headers";
import otpGenerator from "otp-generator";

export async function registerUser(email: string, password: string) {
  const newUser = await prisma.user.create({
    data: {
      email,
      password,
      verified: true,
    },
  });

  const token = generateJWT({
    id: newUser.id,
    email: newUser.email,
  });
  cookies().set("token", token);
}

export async function sendMail(email: string, forgotPassword?: boolean) {
  // Check for empty email
  if (!email) {
    return { status: 400, message: "Email Empty" };
  }

  // Check for valid email
  const userExists = await prisma.user.findFirst({
    where: { email },
  });
  if (userExists && forgotPassword !== true) {
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
    try {
      // Send Verification OTP
      const { mailResponse } = await sendOTP(email, otp);

      // Send Forgot Mail
      if (forgotPassword === true) {
        const otpId = await createOTP(otp, email, true);
        return {
          status: 200,
          message: "OTP Sent Successfully",
          otpId,
        };
      }

      // Create/Update OTP in the DB
      if (mailResponse.accepted) {
        // Create OTP with userId as Foreign Key
        const otpId = await createOTP(otp, email);
        return {
          status: 200,
          message: "OTP Sent Successfully",
          otpId,
        };
      }
    } catch (error) {
      console.log(error);
      return { status: 400, message: "Failed to send OTP" };
    }
  }
  return { status: 500, message: "Internal Server Error" };
}
