/*
  Warnings:

  - The primary key for the `Reservation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Reservation` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Showtime` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Showtime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `showtimeId` on the `Reservation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `showtimeId` on the `Seat` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_showtimeId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_showtimeId_fkey";

-- AlterTable
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "showtimeId",
ADD COLUMN     "showtimeId" INTEGER NOT NULL,
ADD CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "showtimeId",
ADD COLUMN     "showtimeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Showtime" DROP CONSTRAINT "Showtime_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Showtime_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_seatNumber_showtimeId_key" ON "Seat"("seatNumber", "showtimeId");

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
