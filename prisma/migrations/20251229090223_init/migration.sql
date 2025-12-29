/*
  Warnings:

  - Added the required column `duration` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "rating" INTEGER,
ADD COLUMN     "releaseDate" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
