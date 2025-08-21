-- CreateEnum
CREATE TYPE "public"."DepenseType" AS ENUM ('MECANIQUE', 'CARROSSERIE', 'REVISION');

-- CreateTable
CREATE TABLE "public"."Depense" (
    "id" SERIAL NOT NULL,
    "vehiculeId" INTEGER NOT NULL,
    "type" "public"."DepenseType" NOT NULL,
    "montant" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Depense_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Depense" ADD CONSTRAINT "Depense_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "public"."Vehicule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
