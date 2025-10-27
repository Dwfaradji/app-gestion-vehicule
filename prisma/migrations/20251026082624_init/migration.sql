/*
  Warnings:

  - You are about to drop the `Entreprise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Section` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vacances` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VacancesEntreprise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Section" DROP CONSTRAINT "Section_entrepriseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Vacances" DROP CONSTRAINT "Vacances_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."VacancesEntreprise" DROP CONSTRAINT "VacancesEntreprise_entrepriseId_fkey";

-- DropTable
DROP TABLE "public"."Entreprise";

-- DropTable
DROP TABLE "public"."Section";

-- DropTable
DROP TABLE "public"."Vacances";

-- DropTable
DROP TABLE "public"."VacancesEntreprise";

-- CreateTable
CREATE TABLE "entreprises" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT,
    "ville" TEXT,
    "codePostal" TEXT,
    "pays" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "siret" TEXT,
    "horaireId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "entreprises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sections" (
    "id" SERIAL NOT NULL,
    "entrepriseId" INTEGER NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT,
    "ville" TEXT,
    "codePostal" TEXT,
    "pays" TEXT,
    "email" TEXT,
    "telephone" TEXT,
    "horaireId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "horaires" (
    "id" SERIAL NOT NULL,
    "ouverture" TEXT NOT NULL DEFAULT '07:00',
    "fermeture" TEXT NOT NULL DEFAULT '18:00',

    CONSTRAINT "horaires_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vacances" (
    "id" SERIAL NOT NULL,
    "entrepriseId" INTEGER,
    "sectionId" INTEGER,
    "debut" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "vacances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entreprises_siret_key" ON "entreprises"("siret");

-- CreateIndex
CREATE INDEX "sections_entrepriseId_idx" ON "sections"("entrepriseId");

-- CreateIndex
CREATE UNIQUE INDEX "sections_entrepriseId_nom_key" ON "sections"("entrepriseId", "nom");

-- CreateIndex
CREATE INDEX "vacances_entrepriseId_idx" ON "vacances"("entrepriseId");

-- CreateIndex
CREATE INDEX "vacances_sectionId_idx" ON "vacances"("sectionId");

-- CreateIndex
CREATE UNIQUE INDEX "vacances_sectionId_debut_fin_key" ON "vacances"("sectionId", "debut", "fin");

-- AddForeignKey
ALTER TABLE "entreprises" ADD CONSTRAINT "entreprises_horaireId_fkey" FOREIGN KEY ("horaireId") REFERENCES "horaires"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_horaireId_fkey" FOREIGN KEY ("horaireId") REFERENCES "horaires"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacances" ADD CONSTRAINT "vacances_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vacances" ADD CONSTRAINT "vacances_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
