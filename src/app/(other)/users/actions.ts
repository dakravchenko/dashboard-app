"use server";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z, ZodError } from "zod";

const updateUserSchema = z.object({
  userId: z.string(), //z.uuid()
  name: z
  
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name is too long" }),
  email: z.email({ message: "Invalid email address" }),
  role: z.enum(Role),
});
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
  try {
    updateUserSchema.parse({ userId, name, email, role });
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        errors: error.issues.reduce(
          (acc, curr) => {
            if (curr.path.length > 0) {
              acc[curr.path[0] as string] = curr.message;
            }
            return acc;
          },
          {} as Record<string, string>
        ),
      };
    }
    return { success: false, errors: { global: "Unexpected error occurred" } };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { name, email, role },
  });

  revalidatePath("/users");

  return { success: true };
};
