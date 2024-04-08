"use server";

import prisma from "@/db";

export async function registerUser(email: string, password: string) {
  const newUser = await prisma.user.create({
    data: {
      email,
      password,
    },
  });

  return newUser;
}
