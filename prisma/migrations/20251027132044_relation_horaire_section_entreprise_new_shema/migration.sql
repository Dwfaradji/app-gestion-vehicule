/*
  Warnings:

  - A unique constraint covering the columns `[horaireId]` on the table `entreprises` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[horaireId]` on the table `sections` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."entreprises" DROP CONSTRAINT "entreprises_horaireId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sections" DROP CONSTRAINT "sections_horaireId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "entreprises_horaireId_key" ON "entreprises"("horaireId");

-- CreateIndex
CREATE UNIQUE INDEX "sections_horaireId_key" ON "sections"("horaireId");

-- AddForeignKey
ALTER TABLE "entreprises" ADD CONSTRAINT "entreprises_horaireId_fkey" FOREIGN KEY ("horaireId") REFERENCES "horaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_horaireId_fkey" FOREIGN KEY ("horaireId") REFERENCES "horaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;
