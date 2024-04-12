"use server";

import prisma from "@/db";

export async function createRegistrationOTP(otp: string, email: string) {
  const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000);
  const existingOTP = await prisma.otp.findFirst({ where: { email } });

  let newOTP;

  if (existingOTP) {
    newOTP = await prisma.otp.update({
      data: { otp, expiresAt },
      where: { id: existingOTP.id },
    });
  } else {
    newOTP = await prisma.otp.create({ data: { otp, expiresAt, email } });
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
