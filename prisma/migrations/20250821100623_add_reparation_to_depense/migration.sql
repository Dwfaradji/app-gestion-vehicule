/*
  Warnings:

  - Added the required column `km` to the `Depense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Depense" ADD COLUMN     "km" INTEGER NOT NULL,
ADD COLUMN     "reparation" TEXT;
