import prisma from "@/db";
import { generateJWT } from "@/lib/auth";
import { compare } from "bcrypt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  // Check Body
  if (!email || !password) {
    return NextResponse.json({ status: 400, message: "User not found" });
  }

  try {
    // Find User
    const userExists = await prisma.user.findFirst({
      where: { email },
    });
    if (!userExists) {
      return NextResponse.json({ status: 400, message: "Invalid Email" });
    }
    // Compare Password
    const passwordMatch = await compare(password, userExists.password);
    if (!passwordMatch) {
      return NextResponse.json({ status: 400, message: "Invalid Password" });
    }

    // Check if email is verified
    if (!userExists.verified) {
      return NextResponse.json({ status: 400, message: "Email not verified" });
    }

    // Generate Token
    const token = generateJWT({
      id: userExists.id,
      email: userExists.email,
    });
    cookies().set("token", token);

    return NextResponse.json({ status: 200, message: "Login Successfully" });
  } catch (error) {
    return NextResponse.json({ status: 500, message: "Internal Server Error" });
  }
}
