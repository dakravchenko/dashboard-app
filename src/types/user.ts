import { Project, ResourceType, Task } from "@prisma/client";

export type ReducedUser = {
  id: string;
  name: string;
  email: string;
};

export type FullProject = Project & {
  members: ReducedUser[];
  tasks: Task[];
  resources: { type: ResourceType; amount: number }[];
};
