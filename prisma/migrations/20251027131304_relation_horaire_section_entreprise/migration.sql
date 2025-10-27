/*
  Warnings:

  - You are about to drop the column `entrepriseId` on the `horaires` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `horaires` table. All the data in the column will be lost.
  - You are about to drop the `_EntrepriseHoraires` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SectionHoraires` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_EntrepriseHoraires" DROP CONSTRAINT "_EntrepriseHoraires_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_EntrepriseHoraires" DROP CONSTRAINT "_EntrepriseHoraires_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_SectionHoraires" DROP CONSTRAINT "_SectionHoraires_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_SectionHoraires" DROP CONSTRAINT "_SectionHoraires_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."horaires" DROP CONSTRAINT "horaires_entrepriseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."horaires" DROP CONSTRAINT "horaires_sectionId_fkey";

-- DropIndex
DROP INDEX "public"."horaires_entrepriseId_idx";

-- DropIndex
DROP INDEX "public"."horaires_sectionId_idx";

-- AlterTable
ALTER TABLE "horaires" DROP COLUMN "entrepriseId",
DROP COLUMN "sectionId";

-- DropTable
DROP TABLE "public"."_EntrepriseHoraires";

-- DropTable
DROP TABLE "public"."_SectionHoraires";

-- AddForeignKey
ALTER TABLE "entreprises" ADD CONSTRAINT "entreprises_horaireId_fkey" FOREIGN KEY ("horaireId") REFERENCES "horaires"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_horaireId_fkey" FOREIGN KEY ("horaireId") REFERENCES "horaires"("id") ON DELETE SET NULL ON UPDATE CASCADE;
