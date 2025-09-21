/*
  Warnings:

  - The `dueDate` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ResourceLog" DROP CONSTRAINT "ResourceLog_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_projectId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProjectMembers" DROP CONSTRAINT "_ProjectMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_ProjectMembers" DROP CONSTRAINT "_ProjectMembers_B_fkey";

-- AlterTable
ALTER TABLE "public"."Task" DROP COLUMN "dueDate",
ADD COLUMN     "dueDate" TIMESTAMP(3);

-- DropTable
DROP TABLE "public"."Project";

-- DropTable
DROP TABLE "public"."_ProjectMembers";
