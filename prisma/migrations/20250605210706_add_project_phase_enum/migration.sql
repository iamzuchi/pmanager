-- CreateEnum
CREATE TYPE "ProjectPhase" AS ENUM ('OPEN', 'ON_HOLD', 'INVOICING', 'CLOSED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "phase" "ProjectPhase" NOT NULL DEFAULT 'OPEN';
