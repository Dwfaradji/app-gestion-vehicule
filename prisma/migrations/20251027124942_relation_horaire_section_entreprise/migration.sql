/*
  Warnings:

  - Made the column `horaireId` on table `entreprises` required. This step will fail if there are existing NULL values in that column.
  - Made the column `horaireId` on table `sections` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "entreprises" ALTER COLUMN "horaireId" SET NOT NULL;

-- AlterTable
ALTER TABLE "sections" ALTER COLUMN "horaireId" SET NOT NULL;
