/*
  Warnings:

  - You are about to drop the column `anomalie` on the `Trajet` table. All the data in the column will be lost.
  - You are about to drop the column `heure` on the `Trajet` table. All the data in the column will be lost.
  - You are about to drop the column `km` on the `Trajet` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Trajet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Trajet" DROP COLUMN "anomalie",
DROP COLUMN "heure",
DROP COLUMN "km",
DROP COLUMN "type",
ADD COLUMN     "anomalies" TEXT,
ADD COLUMN     "heureArrivee" TEXT,
ADD COLUMN     "heureDepart" TEXT,
ADD COLUMN     "kmArrivee" INTEGER,
ADD COLUMN     "kmDepart" INTEGER,
ALTER COLUMN "conducteurId" DROP NOT NULL,
ALTER COLUMN "destination" DROP NOT NULL;
