/*
  Warnings:

  - A unique constraint covering the columns `[vehicleId,type,itemId]` on the table `Notification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Notification_vehicleId_type_message_key";

-- AlterTable
ALTER TABLE "public"."Notification" ADD COLUMN     "itemId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Notification_vehicleId_type_itemId_key" ON "public"."Notification"("vehicleId", "type", "itemId");
