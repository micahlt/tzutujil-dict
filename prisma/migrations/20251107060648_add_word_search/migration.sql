CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA pg_catalog;

-- CreateTable
CREATE TABLE "word_search" (
    "word_id" UUID NOT NULL,
    "spellings_text" TEXT,
    "senses_text" TEXT,
    "examples_text" TEXT,
    "tsv" tsvector,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "word_search_pkey" PRIMARY KEY ("word_id")
);

-- CreateIndex
CREATE INDEX "word_search_examples_trgm_idx" ON "word_search" USING GIN ("examples_text" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "word_search_senses_trgm_idx" ON "word_search" USING GIN ("senses_text" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "word_search_spellings_trgm_idx" ON "word_search" USING GIN ("spellings_text" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "word_search_tsv_idx" ON "word_search" USING GIN ("tsv");

CREATE OR REPLACE FUNCTION refresh_word_search_row_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  wid uuid;
  spellings_text text;
  senses_text text;
  examples_text text;
  combined_tsv tsvector;
BEGIN
  IF TG_OP = 'DELETE' THEN
    wid := OLD.id;
    DELETE FROM word_search WHERE word_id = wid;
    RETURN OLD;
  ELSE
    -- TG_OP is INSERT or UPDATE
    wid := NEW.id;

    -- Aggregate spellings
    SELECT string_agg(DISTINCT s.spelling, ' ')
      INTO spellings_text
      FROM "Spellings" s
     WHERE s.word_id = wid;

    -- Aggregate senses (translations)
    SELECT string_agg(DISTINCT se.translation, ' ')
      INTO senses_text
      FROM "Senses" se
     WHERE se.word_id = wid;

    -- Aggregate examples (combine tz + en + es)
    SELECT string_agg(DISTINCT (
             coalesce(ex.text_tz, '') || ' ' ||
             coalesce(ex.text_en, '') || ' ' ||
             coalesce(ex.text_es, '')
           ), ' ')
      INTO examples_text
      FROM "Examples" ex
     WHERE ex.word_id = wid;

    -- Build a weighted tsvector: A = spellings, B = senses, C = examples
    combined_tsv :=
      setweight(to_tsvector('simple', coalesce(spellings_text, '')), 'A') ||
      setweight(to_tsvector('simple', coalesce(senses_text, '')), 'B') ||
      setweight(to_tsvector('simple', coalesce(examples_text, '')), 'C');

    -- Upsert into word_search
    INSERT INTO word_search (word_id, spellings_text, senses_text, examples_text, tsv, updated_at)
    VALUES (wid, spellings_text, senses_text, examples_text, combined_tsv, now())
    ON CONFLICT (word_id) DO UPDATE
      SET spellings_text = EXCLUDED.spellings_text,
          senses_text   = EXCLUDED.senses_text,
          examples_text = EXCLUDED.examples_text,
          tsv           = EXCLUDED.tsv,
          updated_at    = EXCLUDED.updated_at;

    RETURN NEW;
  END IF;
END;
$$;

DROP TRIGGER IF EXISTS trg_refresh_word_search_row ON "Words";

CREATE TRIGGER trg_refresh_word_search_row
AFTER INSERT OR UPDATE OR DELETE ON "Words"
FOR EACH ROW
EXECUTE FUNCTION refresh_word_search_row_trigger();
