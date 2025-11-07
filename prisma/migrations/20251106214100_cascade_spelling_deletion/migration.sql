-- DropForeignKey
ALTER TABLE "Examples" DROP CONSTRAINT "word_id";

-- DropForeignKey
ALTER TABLE "Senses" DROP CONSTRAINT "word_id";

-- DropForeignKey
ALTER TABLE "Spellings" DROP CONSTRAINT "word_id";

-- DropForeignKey
ALTER TABLE "Words" DROP CONSTRAINT "source_id";

-- AddForeignKey
ALTER TABLE "Examples" ADD CONSTRAINT "word_id" FOREIGN KEY ("word_id") REFERENCES "Words"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Senses" ADD CONSTRAINT "word_id" FOREIGN KEY ("word_id") REFERENCES "Words"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Spellings" ADD CONSTRAINT "word_id" FOREIGN KEY ("word_id") REFERENCES "Words"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Words" ADD CONSTRAINT "source_id" FOREIGN KEY ("source_id") REFERENCES "Sources"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
