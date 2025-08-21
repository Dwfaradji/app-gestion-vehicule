-- DropForeignKey
ALTER TABLE "public"."Depense" DROP CONSTRAINT "Depense_vehiculeId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Depense" ADD CONSTRAINT "Depense_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "public"."Vehicule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
