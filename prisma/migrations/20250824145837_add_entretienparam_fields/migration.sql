/*
  Warnings:

  - Added the required column `category` to the `EntretienParam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `EntretienParam` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."EntretienParam" ADD COLUMN     "alertKmBefore" INTEGER,
ADD COLUMN     "applicableTo" TEXT,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "subCategory" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
