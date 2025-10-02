-- CreateTable
CREATE TABLE "CarLocation" (
    "id" SERIAL NOT NULL,
    "rentalId" INTEGER NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CarLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CarLocation_rentalId_idx" ON "CarLocation"("rentalId");

-- AddForeignKey
ALTER TABLE "CarLocation" ADD CONSTRAINT "CarLocation_rentalId_fkey" FOREIGN KEY ("rentalId") REFERENCES "Rental"("id") ON DELETE CASCADE ON UPDATE CASCADE;
