import { sendMail } from "@/actions/auth";
import prisma from "@/db";
import { generateJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ message: "Email not found" });
  }

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: "User not found" });
  }

  const mailResponse = await sendMail(email, true);
  if (!mailResponse.otpId) {
    return NextResponse.json({
      status: mailResponse.status,
      message: mailResponse.message,
    });
  }

  const token = generateJWT({
    email,
    otpId: mailResponse.otpId,
  });
  cookies().set("otpToken", token);

  return NextResponse.json({
    status: 200,
    message: `Email sent to ${email}`,
  });
}
