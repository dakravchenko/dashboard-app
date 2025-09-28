/*
  Warnings:

  - A unique constraint covering the columns `[projectId,number]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `level` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "level" INTEGER NOT NULL,
ADD COLUMN     "number" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Task_projectId_number_key" ON "public"."Task"("projectId", "number");
