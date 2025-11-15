import { Project, ResourceType, Task, User } from "@prisma/client";

// export type ReducedUser = {
//   id: string;
//   name: string;
//   email: string;
// };

export type ReducedUser = Pick<User, "id" | "name" | "email">;

export type FullProject = Project & {
  members: ReducedUser[];
  tasks: Task[];
  resources: { type: ResourceType; amount: number }[];
};
