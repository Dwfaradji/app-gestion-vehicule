-- DropForeignKey
ALTER TABLE "public"."entreprises" DROP CONSTRAINT "entreprises_horaireId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sections" DROP CONSTRAINT "sections_horaireId_fkey";

-- AlterTable
ALTER TABLE "horaires" ADD COLUMN     "entrepriseId" INTEGER,
ADD COLUMN     "sectionId" INTEGER;

-- CreateTable
CREATE TABLE "_EntrepriseHoraires" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EntrepriseHoraires_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_SectionHoraires" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SectionHoraires_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EntrepriseHoraires_B_index" ON "_EntrepriseHoraires"("B");

-- CreateIndex
CREATE INDEX "_SectionHoraires_B_index" ON "_SectionHoraires"("B");

-- CreateIndex
CREATE INDEX "horaires_entrepriseId_idx" ON "horaires"("entrepriseId");

-- CreateIndex
CREATE INDEX "horaires_sectionId_idx" ON "horaires"("sectionId");

-- AddForeignKey
ALTER TABLE "horaires" ADD CONSTRAINT "horaires_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horaires" ADD CONSTRAINT "horaires_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntrepriseHoraires" ADD CONSTRAINT "_EntrepriseHoraires_A_fkey" FOREIGN KEY ("A") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntrepriseHoraires" ADD CONSTRAINT "_EntrepriseHoraires_B_fkey" FOREIGN KEY ("B") REFERENCES "horaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SectionHoraires" ADD CONSTRAINT "_SectionHoraires_A_fkey" FOREIGN KEY ("A") REFERENCES "horaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SectionHoraires" ADD CONSTRAINT "_SectionHoraires_B_fkey" FOREIGN KEY ("B") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
