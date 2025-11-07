-- DropForeignKey
ALTER TABLE "Words" DROP CONSTRAINT "source_id";

-- AddForeignKey
ALTER TABLE "Words" ADD CONSTRAINT "source_id" FOREIGN KEY ("source_id") REFERENCES "Sources"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
