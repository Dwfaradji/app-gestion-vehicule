-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "date" TIMESTAMP(3),
    "km" INTEGER,
    "seen" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_vehicleId_idx" ON "public"."Notification"("vehicleId");
