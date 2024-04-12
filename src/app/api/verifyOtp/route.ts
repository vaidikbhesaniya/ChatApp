import prisma from "@/db";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { otp } = await request.json();
  if (!otp) {
    return NextResponse.json({ message: "Invalid OTP" });
  }

  const otpToken = cookies().get("otpToken");
  if (!otpToken || !otpToken.value) {
    return NextResponse.json({ message: "Invalid OTP" });
  }

  const decodedOTPToken = verifyJWT(otpToken.value);
  if (decodedOTPToken.status !== 200) {
    return NextResponse.json(decodedOTPToken.message);
  }

  const existingOTP = await prisma.otp.findFirst({
    where: {
      id: decodedOTPToken.payload.otpId.otpId,
    },
  });

  if (!existingOTP) {
    return NextResponse.json({ message: "OTP Not Found" });
  }
  if (existingOTP.expiresAt < new Date()) {
    return NextResponse.json({ message: "OTP Expired" });
  }
  if (otp !== existingOTP.otp) {
    return NextResponse.json({ message: "Incorrect OTP" });
  }

  await prisma.otp.update({
    data: { forget: false },
    where: { id: existingOTP.id },
  });

  cookies().delete("otpToken");

  return NextResponse.json({
    status: 200,
    message: "Change your Password",
  });
}
