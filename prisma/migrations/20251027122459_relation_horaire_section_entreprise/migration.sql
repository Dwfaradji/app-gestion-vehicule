-- DropForeignKey
ALTER TABLE "public"."entreprises" DROP CONSTRAINT "entreprises_horaireId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sections" DROP CONSTRAINT "sections_horaireId_fkey";

-- AddForeignKey
ALTER TABLE "entreprises" ADD CONSTRAINT "entreprises_horaireId_fkey" FOREIGN KEY ("horaireId") REFERENCES "horaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sections" ADD CONSTRAINT "sections_horaireId_fkey" FOREIGN KEY ("horaireId") REFERENCES "horaires"("id") ON DELETE CASCADE ON UPDATE CASCADE;
