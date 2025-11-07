/*
  Warnings:

  - A unique constraint covering the columns `[mongoId]` on the table `Words` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Words" ADD COLUMN     "mongoId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Words_mongoId_key" ON "Words"("mongoId");
