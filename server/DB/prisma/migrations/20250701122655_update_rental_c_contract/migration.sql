/*
  Warnings:

  - You are about to drop the column `signedContract` on the `RentalContract` table. All the data in the column will be lost.
  - The `contractConditionsAccept` column on the `RentalContract` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "RentalContract" DROP COLUMN "signedContract",
DROP COLUMN "contractConditionsAccept",
ADD COLUMN     "contractConditionsAccept" BOOLEAN NOT NULL DEFAULT false;
