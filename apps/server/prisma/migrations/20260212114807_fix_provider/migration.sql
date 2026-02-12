/*
  Warnings:

  - The values [NAVER] on the enum `AuthProvider` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PRIVATE', 'FRIENDS');

-- CreateEnum
CREATE TYPE "FeelingStatus" AS ENUM ('Pending', 'Completed', 'Failed');

-- CreateEnum
CREATE TYPE "Emotion" AS ENUM ('Joy', 'Excitement', 'Gratitude', 'Hope', 'Pride', 'Love', 'Peace', 'Contentment', 'Relief', 'Serenity', 'Anxiety', 'Fear', 'Anger', 'Panic', 'Frustration', 'Sadness', 'Guilt', 'Shame', 'Loneliness', 'Depression', 'Hopelessness', 'Boredom');

-- AlterEnum
BEGIN;
CREATE TYPE "AuthProvider_new" AS ENUM ('GOOGLE', 'APPLE');
ALTER TABLE "User" ALTER COLUMN "provider" TYPE "AuthProvider_new" USING ("provider"::text::"AuthProvider_new");
ALTER TYPE "AuthProvider" RENAME TO "AuthProvider_old";
ALTER TYPE "AuthProvider_new" RENAME TO "AuthProvider";
DROP TYPE "public"."AuthProvider_old";
COMMIT;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'FRIENDS';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT,
ALTER COLUMN "email" DROP NOT NULL;

-- CreateTable
CREATE TABLE "feelings" (
    "id" TEXT NOT NULL,
    "noteId" TEXT NOT NULL,
    "status" "FeelingStatus" NOT NULL DEFAULT 'Pending',
    "errorMessage" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "primaryEmotion" "Emotion",
    "primaryIntensity" DOUBLE PRECISION,
    "secondary1Emotion" "Emotion",
    "secondary1Intensity" DOUBLE PRECISION,
    "secondary2Emotion" "Emotion",
    "secondary2Intensity" DOUBLE PRECISION,
    "analyzedAt" TIMESTAMP(3),
    "modelVersion" TEXT,

    CONSTRAINT "feelings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feelings_noteId_key" ON "feelings"("noteId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");

-- AddForeignKey
ALTER TABLE "feelings" ADD CONSTRAINT "feelings_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
