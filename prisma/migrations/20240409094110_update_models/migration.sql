/*
  Warnings:

  - You are about to drop the `otp` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "otpToken" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "otp";
