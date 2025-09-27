/*
  Warnings:

  - You are about to drop the column `conducteur` on the `Trajet` table. All the data in the column will be lost.
  - You are about to drop the column `conducteur` on the `Vehicule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Trajet" DROP COLUMN "conducteur";

-- AlterTable
ALTER TABLE "public"."Vehicule" DROP COLUMN "conducteur",
ADD COLUMN     "conducteurId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Conducteur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conducteur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conducteur_code_key" ON "public"."Conducteur"("code");

-- AddForeignKey
ALTER TABLE "public"."Vehicule" ADD CONSTRAINT "Vehicule_conducteurId_fkey" FOREIGN KEY ("conducteurId") REFERENCES "public"."Conducteur"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Trajet" ADD CONSTRAINT "Trajet_conducteurId_fkey" FOREIGN KEY ("conducteurId") REFERENCES "public"."Conducteur"("id") ON DELETE CASCADE ON UPDATE CASCADE;
