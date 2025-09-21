-- AlterTable
ALTER TABLE "public"."Project" ALTER COLUMN "startDate" SET DATA TYPE TEXT,
ALTER COLUMN "endDate" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "public"."Task" ALTER COLUMN "dueDate" SET DATA TYPE TEXT;
