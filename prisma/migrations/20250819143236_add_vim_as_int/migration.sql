/*
  Warnings:

  - The `vim` column on the `Vehicule` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "public"."Vehicule" DROP COLUMN "vim",
ADD COLUMN     "vim" INTEGER;
