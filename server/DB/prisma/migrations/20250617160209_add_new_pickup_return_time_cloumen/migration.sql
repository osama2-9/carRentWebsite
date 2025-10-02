/*
  Warnings:

  - Added the required column `pickupTime` to the `Rental` table without a default value. This is not possible if the table is not empty.
  - Added the required column `returnTime` to the `Rental` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Rental" ADD COLUMN     "pickupTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "returnTime" TIMESTAMP(3) NOT NULL;
