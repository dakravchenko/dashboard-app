import {
  Role,
  ProjectStatus,
  TaskStatus,
  TaskPriority,
  ResourceType,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import prisma from "../src/lib/prisma.js";


async function main() {
  console.log("Seeding database...");

  const admin = await prisma.user.create({
    data: {
      name: "Alice Admin",
      email: "admin@example.com",
      password: "hashedpassword123", // Replace with hashed value
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.create({
    data: {
      name: "Mark Manager",
      email: "manager@example.com",
      password: "hashedpassword123",
      role: Role.MANAGER,
    },
  });

  const member = await prisma.user.create({
    data: {
      name: "Mia Member",
      email: "member@example.com",
      password: "hashedpassword123",
      role: Role.MEMBER,
    },
  });

  const nlCities = [
    "Amsterdam",
    "Rotterdam",
    "The Hague",
    "Utrecht",
    "Eindhoven",
    "Tilburg",
    "Groningen",
    "Almere",
    "Breda",
    "Nijmegen",
  ];

  const projects = [];
  for (let i = 0; i < 3; i++) {
    const project = await prisma.project.create({
      data: {
        title: faker.company.name() + " Project",
        description: faker.lorem.sentences(2),
        startDate: faker.date.past({ years: 0.5 }),
        endDate: faker.date.future({ years: 0.5 }),
        status: faker.helpers.arrayElement([
          ProjectStatus.NOT_STARTED,
          ProjectStatus.IN_PROGRESS,
          ProjectStatus.COMPLETED,
        ]),
        locationName: faker.helpers.arrayElement(nlCities),
        mapData: {},
        members: {
          connect: [{ id: admin.id }, { id: manager.id }, { id: member.id }],
        },
      },
    });
    projects.push(project);
  }

  for (const project of projects) {
    for (let j = 0; j < 5; j++) {
      await prisma.task.create({
        data: {
          title: faker.hacker.verb() + " " + faker.hacker.noun(),
          description: faker.lorem.sentence(),
          status: faker.helpers.arrayElement([
            TaskStatus.TODO,
            TaskStatus.IN_PROGRESS,
            TaskStatus.DONE,
          ]),
          priority: faker.helpers.arrayElement([
            TaskPriority.LOW,
            TaskPriority.MEDIUM,
            TaskPriority.HIGH,
          ]),
          dueDate: faker.date.future(),
          projectId: project.id,
          assignedToId: faker.helpers.arrayElement([
            admin.id,
            manager.id,
            member.id,
          ]),
        },
      });
    }
  }

  for (const project of projects) {
    for (let k = 0; k < 3; k++) {
      await prisma.resourceLog.create({
        data: {
          type: faker.helpers.arrayElement([
            ResourceType.HOURS,
            ResourceType.BUDGET,
          ]),
          amount: faker.number.float({ min: 10, max: 200 }),
          projectId: project.id,
        },
      });
    }
  }

  console.log("✅ Database seeding completed!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
