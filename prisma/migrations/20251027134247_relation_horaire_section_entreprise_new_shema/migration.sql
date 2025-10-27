/*
  Warnings:

  - You are about to drop the column `horaireId` on the `entreprises` table. All the data in the column will be lost.
  - You are about to drop the column `horaireId` on the `sections` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[entrepriseId]` on the table `horaires` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sectionId]` on the table `horaires` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."entreprises" DROP CONSTRAINT "entreprises_horaireId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sections" DROP CONSTRAINT "sections_horaireId_fkey";

-- DropIndex
DROP INDEX "public"."entreprises_horaireId_key";

-- DropIndex
DROP INDEX "public"."sections_horaireId_key";

-- AlterTable
ALTER TABLE "entreprises" DROP COLUMN "horaireId";

-- AlterTable
ALTER TABLE "horaires" ADD COLUMN     "entrepriseId" INTEGER,
ADD COLUMN     "sectionId" INTEGER;

-- AlterTable
ALTER TABLE "sections" DROP COLUMN "horaireId",
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "horaires_entrepriseId_key" ON "horaires"("entrepriseId");

-- CreateIndex
CREATE UNIQUE INDEX "horaires_sectionId_key" ON "horaires"("sectionId");

-- AddForeignKey
ALTER TABLE "horaires" ADD CONSTRAINT "horaires_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "entreprises"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "horaires" ADD CONSTRAINT "horaires_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
