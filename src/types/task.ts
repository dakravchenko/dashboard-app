import { Task } from "@prisma/client";

export type OptionalTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & {
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };