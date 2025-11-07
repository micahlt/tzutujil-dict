-- This is an empty migration.
-- full-text search index on the tsvector
CREATE INDEX IF NOT EXISTS word_search_tsv_idx ON word_search USING GIN (tsv);

-- trigram index on spellings_text for fuzzy matching (requires pg_trgm)
CREATE INDEX IF NOT EXISTS word_search_spellings_trgm_idx ON word_search USING GIN (spellings_text gin_trgm_ops);

-- optional trigram indexes for senses/examples
CREATE INDEX IF NOT EXISTS word_search_senses_trgm_idx ON word_search USING GIN (senses_text gin_trgm_ops);
CREATE INDEX IF NOT EXISTS word_search_examples_trgm_idx ON word_search USING GIN (examples_text gin_trgm_ops);

TRUNCATE word_search;
INSERT INTO word_search (word_id, spellings_text, senses_text, examples_text, tsv, updated_at)
SELECT
  w.id AS word_id,
  string_agg(DISTINCT s.spelling, ' ') FILTER (WHERE s.spelling IS NOT NULL),
  string_agg(DISTINCT se.translation, ' ') FILTER (WHERE se.translation IS NOT NULL),
  string_agg(DISTINCT coalesce(ex.text_tz,'') || ' ' || coalesce(ex.text_en,'') || ' ' || coalesce(ex.text_es,''), ' ') FILTER (WHERE ex.text_tz IS NOT NULL OR ex.text_en IS NOT NULL OR ex.text_es IS NOT NULL),
  setweight(to_tsvector('simple', coalesce(string_agg(DISTINCT s.spelling, ' '), '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(string_agg(DISTINCT se.translation, ' '), '')), 'B') ||
  setweight(to_tsvector('simple', coalesce(string_agg(DISTINCT coalesce(ex.text_tz,'') || ' ' || coalesce(ex.text_en,''), ' '), '')), 'C'),
  now()
FROM "Words" w
LEFT JOIN "Spellings" s ON s.word_id = w.id
LEFT JOIN "Senses" se ON se.word_id = w.id
LEFT JOIN "Examples" ex ON ex.word_id = w.id
GROUP BY w.id;
