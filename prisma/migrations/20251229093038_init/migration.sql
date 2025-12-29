/*
  Warnings:

  - The primary key for the `Movie` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Movie` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `movieId` on the `Showtime` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Showtime" DROP CONSTRAINT "Showtime_movieId_fkey";

-- AlterTable
ALTER TABLE "Movie" DROP CONSTRAINT "Movie_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Movie_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Showtime" DROP COLUMN "movieId",
ADD COLUMN     "movieId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
