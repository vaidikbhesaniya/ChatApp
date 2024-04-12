"use server";

import prisma from "@/db";

export async function createOTP(
  otp: string,
  email: string,
  forgotPassword?: boolean
) {
  const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);
  const existingOTP = await prisma.otp.findFirst({ where: { email } });

  let newOTP;

  if (existingOTP) {
    if (forgotPassword) {
      newOTP = await prisma.otp.update({
        data: { otp, verified: false, expiresAt, forget: true },
        where: { id: existingOTP.id },
      });
    } else {
      newOTP = await prisma.otp.update({
        data: { otp, verified: false, expiresAt },
        where: { id: existingOTP.id },
      });
    }
  } else {
    if (forgotPassword) {
      newOTP = await prisma.otp.create({
        data: { otp, expiresAt, forget: true, email },
      });
    } else {
      newOTP = await prisma.otp.create({ data: { otp, expiresAt, email } });
    }
  }

  if (!newOTP) {
    return {
      status: 400,
      message: "Failed to send OTP",
      otpId: undefined,
    };
  }

  return {
    status: 200,
    message: "OTP Sent Successfully",
    otpId: newOTP.id,
  };
}
