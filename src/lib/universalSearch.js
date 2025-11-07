import prisma from "./prisma";

export default async function universalSearch(q, limit = 50) {
  const rows = await prisma.$queryRaw`
    WITH params AS (
      SELECT unaccent(trim(${q}::text)) AS raw,
             plainto_tsquery('simple', unaccent(trim(${q}::text))) AS tsq
    )
    SELECT w.id AS word_id, s.spelling, w.part_of_speech, ws.spellings_text, ws.senses_text, ws.examples_text,
           sense_en.translation AS sense_en,
           sense_es.translation AS sense_es,
           COALESCE(similarity(ws.spellings_text, params.raw),0) AS sim_spell,
           COALESCE(similarity(ws.senses_text, params.raw),0) AS sim_sense,
           COALESCE(similarity(ws.examples_text, params.raw),0) AS sim_example,
           COALESCE(ts_rank_cd(ws.tsv, params.tsq, 32),0) AS fts_rank,
           (
             (COALESCE(similarity(ws.spellings_text, params.raw),0) * 5.0) +
             (COALESCE(ts_rank_cd(ws.tsv, params.tsq, 32),0) * 3.0) +
             (COALESCE(similarity(ws.senses_text, params.raw),0) * 1.0) +
             (COALESCE(similarity(ws.examples_text, params.raw),0) * 0.5)
           ) AS score
    FROM params, word_search ws
    JOIN "Words" w ON w.id = ws.word_id
    JOIN "Spellings" s ON s.word_id = w.id AND s.is_primary = true
    LEFT JOIN (
      SELECT DISTINCT ON (word_id) word_id, translation
      FROM "Senses"
      WHERE language = 'EN'
      ORDER BY word_id, id ASC
    ) sense_en ON sense_en.word_id = w.id
    LEFT JOIN (
      SELECT DISTINCT ON (word_id) word_id, translation
      FROM "Senses"
      WHERE language = 'ES'
      ORDER BY word_id, id ASC
    ) sense_es ON sense_es.word_id = w.id
    WHERE
      (ws.tsv @@ params.tsq)
      OR (ws.spellings_text ILIKE '%' || params.raw || '%')
      OR (similarity(ws.spellings_text, params.raw) > 0.15)
      OR (similarity(ws.senses_text, params.raw) > 0.12)
      OR (similarity(ws.examples_text, params.raw) > 0.12)
    ORDER BY score DESC
    LIMIT ${limit};
  `;
  return rows;
}
