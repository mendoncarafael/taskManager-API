-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_assigned_to_fkey";

-- AlterTable
ALTER TABLE "Tasks" ALTER COLUMN "assigned_to" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
