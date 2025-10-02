/*
  Warnings:

  - A unique constraint covering the columns `[signingToken]` on the table `RentalContract` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RentalContract" ADD COLUMN     "agreementAccepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "signedAt" TIMESTAMP(3),
ADD COLUMN     "signerEmail" TEXT,
ADD COLUMN     "signerName" TEXT,
ADD COLUMN     "signingToken" TEXT,
ADD COLUMN     "signingTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "RentalContract_signingToken_key" ON "RentalContract"("signingToken");
