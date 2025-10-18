/*
  Warnings:

  - A unique constraint covering the columns `[vim]` on the table `Vehicule` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PlanifType" AS ENUM ('HEBDO', 'MENSUEL', 'ANNUEL');

-- CreateTable
CREATE TABLE "Planification" (
    "id" SERIAL NOT NULL,
    "vehiculeId" INTEGER NOT NULL,
    "conducteurId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "type" "PlanifType" NOT NULL DEFAULT 'HEBDO',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Planification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Planification_vehiculeId_idx" ON "Planification"("vehiculeId");

-- CreateIndex
CREATE INDEX "Planification_conducteurId_idx" ON "Planification"("conducteurId");

-- CreateIndex
CREATE INDEX "Planification_startDate_endDate_idx" ON "Planification"("startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicule_vim_key" ON "Vehicule"("vim");

-- AddForeignKey
ALTER TABLE "Planification" ADD CONSTRAINT "Planification_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "Vehicule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Planification" ADD CONSTRAINT "Planification_conducteurId_fkey" FOREIGN KEY ("conducteurId") REFERENCES "Conducteur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
