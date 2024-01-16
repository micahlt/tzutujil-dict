import "dotenv/config";
require("dotenv").config();

import mysql from "mysql2";

export async function GET(req) {
  // Create the connection to the database
  const connection = mysql.createConnection(process.env.PLANET_URL);
  connection.config.namedPlaceholders = true;
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  const wildcardQuery = `${query.replaceAll("’", "'")}*`;
  const results = await connection.promise().execute(
    `
    (
      SELECT tzWord, enWord, esWord, id
      FROM words
      WHERE tzWord = :query OR enWord = :query OR esWord = :query
      ) UNION
      (SELECT tzWord, enWord, esWord, id
      FROM (
      SELECT *,
      MATCH (tzWord, esWord, enWord) against (:wildcardQuery IN boolean mode) AS score
      FROM words
      WHERE MATCH (tzWord, esWord, enWord) against (:wildcardQuery IN boolean mode)
      ORDER BY score DESC,
      tzWord = :query DESC,
      enWord = :query DESC,
      esWord = :query DESC) AS alias1)
     UNION
      (
      SELECT tzWord, enWord, esWord, id
      FROM (
      SELECT *,
      MATCH (tzWord, esWord, enWord) against (:query IN NATURAL language mode WITH query expansion) AS score
      FROM words
      WHERE MATCH (tzWord, esWord, enWord) against (:query IN NATURAL language mode WITH query expansion)
      ORDER BY score DESC,
      tzWord = :query DESC,
      enWord = :query DESC,
      esWord = :query DESC) AS alias2)
     LIMIT 50;`,
    { wildcardQuery: wildcardQuery, query: query.replaceAll("’", "'") }
  );
  return Response.json(results[0]);
}
