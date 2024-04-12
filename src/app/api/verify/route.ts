import { registerUser } from "@/actions/auth";
import prisma from "@/db";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { otp } = await request.json();
  if (!otp) {
    return NextResponse.json({ message: "Invalid OTP" });
  }

  if (cookies().get("otpToken")) {
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
      data: { forget: false, verified: true },
      where: { id: existingOTP.id },
    });

    cookies().delete("otpToken");

    return NextResponse.json({
      status: 200,
      message: "Change your Password",
      verificationType: "password",
    });
  }

  const userDoc = cookies().get("userDoc");
  if (!userDoc || !userDoc.value) {
    return NextResponse.json({ message: "Invalid User" });
  }

  const decodedUserDoc = verifyJWT(userDoc.value);
  if (decodedUserDoc.status !== 200) {
    return NextResponse.json(decodedUserDoc.message);
  }

  const existingOTP = await prisma.otp.findFirst({
    where: {
      id: decodedUserDoc.payload.otpId.otpId,
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
    data: {
      verified: true,
    },
    where: {
      id: existingOTP.id,
    },
  });

  await registerUser(
    decodedUserDoc.payload.email,
    decodedUserDoc.payload.password
  );

  cookies().delete("userDoc");

  return NextResponse.json({
    status: 200,
    message: "Account Created Successfully",
    verificationType: "email",
  });
}
