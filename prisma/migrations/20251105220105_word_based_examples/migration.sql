/*
  Warnings:

  - You are about to drop the column `example_translated` on the `Examples` table. All the data in the column will be lost.
  - You are about to drop the column `example_tz` on the `Examples` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Examples` table. All the data in the column will be lost.
  - You are about to drop the column `sense_id` on the `Examples` table. All the data in the column will be lost.
  - Added the required column `word_id` to the `Examples` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Examples" DROP CONSTRAINT "sense_id";

-- AlterTable
ALTER TABLE "Examples" DROP COLUMN "example_translated",
DROP COLUMN "example_tz",
DROP COLUMN "language",
DROP COLUMN "sense_id",
ADD COLUMN     "text_en" TEXT,
ADD COLUMN     "text_es" TEXT,
ADD COLUMN     "text_tz" TEXT,
ADD COLUMN     "word_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Examples" ADD CONSTRAINT "word_id" FOREIGN KEY ("word_id") REFERENCES "Words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
