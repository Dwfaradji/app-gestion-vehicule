-- CreateTable
CREATE TABLE "public"."Vehicule" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "immat" TEXT NOT NULL,
    "modele" TEXT NOT NULL,
    "conducteur" TEXT,
    "km" INTEGER NOT NULL,
    "statut" TEXT NOT NULL,
    "rdv" TIMESTAMP(3),
    "ctValidite" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "fonction" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EntretienParam" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "seuilKm" INTEGER NOT NULL,

    CONSTRAINT "EntretienParam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vehicule_immat_key" ON "public"."Vehicule"("immat");
