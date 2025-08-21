/*
  Warnings:

  - Added the required column `annee` to the `Vehicule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constructeur` to the `Vehicule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energie` to the `Vehicule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Vehicule" ADD COLUMN     "annee" INTEGER NOT NULL,
ADD COLUMN     "chevauxFiscaux" INTEGER,
ADD COLUMN     "constructeur" TEXT NOT NULL,
ADD COLUMN     "dateEntretien" TIMESTAMP(3),
ADD COLUMN     "energie" TEXT NOT NULL,
ADD COLUMN     "motorisation" TEXT,
ADD COLUMN     "places" INTEGER,
ADD COLUMN     "prixAchat" INTEGER,
ADD COLUMN     "prochaineRevision" TIMESTAMP(3),
ADD COLUMN     "vim" TEXT;
