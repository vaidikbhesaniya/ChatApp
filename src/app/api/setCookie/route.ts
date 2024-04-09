import { generateJWT } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { user } = await request.json();

  const token = generateJWT(user);

  cookies().set("userDoc", token);
  return NextResponse.json({ status: 200 });
}
