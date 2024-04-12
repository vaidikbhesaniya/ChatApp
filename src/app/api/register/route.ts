import { sendMail } from "@/actions/auth";
import prisma from "@/db";
import { generateJWT } from "@/lib/auth";
import { genSalt, hash } from "bcrypt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Check Body
  if (!email || !password) {
    return NextResponse.json({ status: 400, message: "Invalid Credentials" });
  }
  // Find User
  const userExists = await prisma.user.findFirst({
    where: { email },
  });
  if (userExists) {
    return NextResponse.json({
      status: 400,
      message: "User Already Exists",
    });
  }

  // Send Mail
  const mailResponse = await sendMail(email);

  if (!mailResponse.otpId) {
    return NextResponse.json({
      status: mailResponse.status,
      message: mailResponse.message,
    });
  }

  const hashedPassword = await hash(password, await genSalt(10));

  // Generate Token if mail is sent
  const token = generateJWT({
    email,
    password: hashedPassword,
    otpId: mailResponse.otpId,
  });
  cookies().set("userDoc", token);

  return NextResponse.json({
    status: 200,
    message: `Email sent to ${email}`,
  });
}
