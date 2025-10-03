/*
  Warnings:

  - A unique constraint covering the columns `[googleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('LOCAL_PROVIDER', 'GOOGLE_PROVIDER');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "googleId" TEXT,
ADD COLUMN     "provider" "public"."Provider" NOT NULL DEFAULT 'LOCAL_PROVIDER',
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_googleId_key" ON "public"."User"("googleId");
