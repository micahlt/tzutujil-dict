/*
  Warnings:

  - Added the required column `part_of_speech` to the `Words` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "part" AS ENUM ('Pronoun', 'Verb', 'Noun', 'Adjective', 'Adverb', 'Particle', 'Interjection', 'Other');

-- AlterTable
ALTER TABLE "Words" ADD COLUMN     "part_of_speech" "part" NOT NULL;
