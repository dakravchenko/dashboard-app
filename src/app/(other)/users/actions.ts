"use server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const deleteUser = async (userId: string) => {
  await prisma.user.delete({ where: { id: userId } });

  revalidatePath("/users");
};

export const updateUser = async (
  userId: string,
  name: string,
  email: string,
  role: Role
) => {
  await prisma.user.update({
    where: { id: userId },
    data: { name, email, role },
  });

  revalidatePath("/users");
};
