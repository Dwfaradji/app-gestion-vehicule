-- CreateTable
CREATE TABLE "public"."Trajet" (
    "id" SERIAL NOT NULL,
    "vehiculeId" INTEGER NOT NULL,
    "conducteurId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "km" INTEGER NOT NULL,
    "heure" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "carburant" INTEGER NOT NULL,
    "anomalie" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conducteur" TEXT NOT NULL,

    CONSTRAINT "Trajet_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Trajet" ADD CONSTRAINT "Trajet_vehiculeId_fkey" FOREIGN KEY ("vehiculeId") REFERENCES "public"."Vehicule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
