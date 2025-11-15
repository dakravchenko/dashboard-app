import { Task } from "@prisma/client";

// export type OptionalTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'number'> & {
//     id?: string;
//     createdAt?: Date;
//     updatedAt?: Date;
//     number?: number;
//   };

export type OptionalTask = Partial<Omit<Task, 'level'>> & { level: Task['level'] };
