-- AlterTable
ALTER TABLE "RentalContract" ADD COLUMN     "contractConditionsAccept" TEXT,
ADD COLUMN     "signedContract" TEXT;

-- CreateIndex
CREATE INDEX "Car_available_idx" ON "Car"("available");

-- CreateIndex
CREATE INDEX "Car_make_idx" ON "Car"("make");

-- CreateIndex
CREATE INDEX "Car_model_idx" ON "Car"("model");

-- CreateIndex
CREATE INDEX "Car_locationId_idx" ON "Car"("locationId");

-- CreateIndex
CREATE INDEX "Car_categoryId_idx" ON "Car"("categoryId");

-- CreateIndex
CREATE INDEX "Location_city_idx" ON "Location"("city");

-- CreateIndex
CREATE INDEX "Location_country_idx" ON "Location"("country");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_method_idx" ON "Payment"("method");

-- CreateIndex
CREATE INDEX "Rental_userId_idx" ON "Rental"("userId");

-- CreateIndex
CREATE INDEX "Rental_carId_idx" ON "Rental"("carId");

-- CreateIndex
CREATE INDEX "Rental_status_idx" ON "Rental"("status");

-- CreateIndex
CREATE INDEX "Rental_startDate_idx" ON "Rental"("startDate");

-- CreateIndex
CREATE INDEX "Rental_endDate_idx" ON "Rental"("endDate");

-- CreateIndex
CREATE INDEX "Review_carId_idx" ON "Review"("carId");

-- CreateIndex
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_emailVerificationToken_idx" ON "User"("emailVerificationToken");

-- CreateIndex
CREATE INDEX "User_passwordResetToken_idx" ON "User"("passwordResetToken");
