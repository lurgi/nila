-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isEmailAgreed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPushAgreed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pushToken" TEXT;
