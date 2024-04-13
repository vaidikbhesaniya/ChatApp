import prisma from "@/db";
import { verifyJWT } from "@/lib/auth";
import { cookies } from "next/headers";

export async function getUser() {
  const token = cookies().get("token");
  if (!token) {
    return undefined;
  }

  const decodedToken = verifyJWT(token.value);
  if (decodedToken.status !== 200) {
    return undefined;
  }

  const user = await prisma.user.findFirst({
    where: { email: decodedToken.payload.email },
  });
  if (!user) {
    return undefined;
  }
  return user;
}
