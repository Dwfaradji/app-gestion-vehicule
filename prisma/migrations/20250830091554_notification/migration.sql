/*
  Warnings:

  - A unique constraint covering the columns `[vehicleId,type,message]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Notification_vehicleId_type_message_key" ON "public"."Notification"("vehicleId", "type", "message");
