import { Role } from "@prisma/client";

export type User = {
    name: string;
    id: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  };
  