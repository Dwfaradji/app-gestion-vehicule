/*
  Warnings:

  - You are about to drop the column `description` on the `Depense` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Depense" DROP COLUMN "description",
ADD COLUMN     "intervenant" TEXT,
ADD COLUMN     "note" TEXT;

-- AlterTable
ALTER TABLE "public"."Vehicule" ALTER COLUMN "statut" DROP NOT NULL;
