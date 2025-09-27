/*
  Warnings:

  - The `anomalies` column on the `Trajet` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Trajet" DROP COLUMN "anomalies",
ADD COLUMN     "anomalies" JSONB;
