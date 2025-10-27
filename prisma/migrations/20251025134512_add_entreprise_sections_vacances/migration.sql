-- AlterTable
ALTER TABLE "Entreprise" ADD COLUMN     "fermeture" TEXT,
ADD COLUMN     "ouverture" TEXT;

-- CreateTable
CREATE TABLE "VacancesEntreprise" (
    "id" SERIAL NOT NULL,
    "entrepriseId" INTEGER NOT NULL,
    "debut" TIMESTAMP(3) NOT NULL,
    "fin" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "VacancesEntreprise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VacancesEntreprise_entrepriseId_idx" ON "VacancesEntreprise"("entrepriseId");

-- AddForeignKey
ALTER TABLE "VacancesEntreprise" ADD CONSTRAINT "VacancesEntreprise_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;
