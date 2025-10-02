-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_rentalId_fkey";

-- DropForeignKey
ALTER TABLE "RentalContract" DROP CONSTRAINT "RentalContract_rentalId_fkey";

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RentalContract" ADD CONSTRAINT "RentalContract_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;
