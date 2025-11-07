/*
  Warnings:

  - You are about to drop the column `mongoId` on the `Words` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mongo_id]` on the table `Sources` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[mongo_id]` on the table `Words` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Words_mongoId_key";

-- AlterTable
ALTER TABLE "Sources" ADD COLUMN     "author" TEXT,
ADD COLUMN     "mongo_id" TEXT;

-- AlterTable
ALTER TABLE "Words" DROP COLUMN "mongoId",
ADD COLUMN     "mongo_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sources_mongo_id_key" ON "Sources"("mongo_id");

-- CreateIndex
CREATE UNIQUE INDEX "Words_mongo_id_key" ON "Words"("mongo_id");
