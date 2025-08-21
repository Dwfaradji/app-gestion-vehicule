/*
  Warnings:

  - You are about to drop the column `type` on the `Depense` table. All the data in the column will be lost.
  - Added the required column `categorie` to the `Depense` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Depense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Depense" DROP COLUMN "type",
ADD COLUMN     "categorie" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "date" DROP DEFAULT;
