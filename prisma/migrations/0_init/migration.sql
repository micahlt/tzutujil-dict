-- CreateEnum
CREATE TYPE "lang" AS ENUM ('EN', 'ES', 'TZ');

-- CreateTable
CREATE TABLE "Examples" (
    "id" SERIAL NOT NULL,
    "sense_id" INTEGER,
    "example_tz" TEXT,
    "example_translated" TEXT,
    "language" "lang",

    CONSTRAINT "Examples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Senses" (
    "id" SERIAL NOT NULL,
    "word_id" UUID NOT NULL,
    "translation" TEXT NOT NULL,
    "language" "lang" NOT NULL,

    CONSTRAINT "Senses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sources" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "last_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spellings" (
    "id" SERIAL NOT NULL,
    "word_id" UUID,
    "spelling" TEXT,
    "is_primary" BOOLEAN,

    CONSTRAINT "Spellings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Words" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "last_modified" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "source_id" UUID NOT NULL,

    CONSTRAINT "Words_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Examples" ADD CONSTRAINT "sense_id" FOREIGN KEY ("sense_id") REFERENCES "Senses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Senses" ADD CONSTRAINT "word_id" FOREIGN KEY ("word_id") REFERENCES "Words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Spellings" ADD CONSTRAINT "word_id" FOREIGN KEY ("word_id") REFERENCES "Words"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Words" ADD CONSTRAINT "source_id" FOREIGN KEY ("source_id") REFERENCES "Sources"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

