/*
  Warnings:

  - A unique constraint covering the columns `[vehiculeId,conducteurId,kmArrivee]` on the table `Trajet` will be added. If there are existing duplicate values, this will fail.
  - Made the column `conducteurId` on table `Trajet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Planification" ADD COLUMN     "nbreTranches" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Trajet" ALTER COLUMN "conducteurId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Trajet_vehiculeId_conducteurId_kmArrivee_key" ON "Trajet"("vehiculeId", "conducteurId", "kmArrivee");
