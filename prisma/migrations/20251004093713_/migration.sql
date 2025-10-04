/*
  Warnings:

  - A unique constraint covering the columns `[projectId,number]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Task_projectId_number_key" ON "public"."Task"("projectId", "number");
