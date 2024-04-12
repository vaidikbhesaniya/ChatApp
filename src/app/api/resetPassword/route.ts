import prisma from "@/db";
import { verifyJWT } from "@/lib/auth";
import { genSalt, hash } from "bcrypt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  if (!password) {
    return NextResponse.json({ status: 400, message: "Password not found" });
  }

  const otpToken = cookies().get("otpToken");
  if (!otpToken || !otpToken.value) {
    return NextResponse.json({ status: 400, message: "Invalid OTP" });
  }

  const decodedOTPToken = verifyJWT(otpToken.value);
  if (decodedOTPToken.status !== 200) {
    return NextResponse.json({
      status: 400,
      messsage: decodedOTPToken.message,
    });
  }

  const hashedPassword = await hash(password, await genSalt(10));
  const user = await prisma.user.update({
    where: { email: decodedOTPToken.payload.email },
    data: { password: hashedPassword },
  });
  if (!user) {
    return NextResponse.json({ status: 400, message: "User not found" });
  }
  cookies().delete("otpToken");

  return NextResponse.json({
    status: 200,
    message: "Password changed successfully",
  });
}
