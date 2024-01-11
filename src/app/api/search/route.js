import "dotenv/config";
require("dotenv").config();

import mysql from "mysql2";

export async function GET(req) {
  // Create the connection to the database
  const connection = mysql.createConnection(process.env.PLANET_URL);
  connection.config.namedPlaceholders = true;
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q").replace("'", "’");
  const wildcardQuery = `${query}*`;
  const results = await connection
    .promise()
    .execute(
      `(SELECT  *, MATCH (tzWord, esWord, enWord) AGAINST (:wildcardQuery IN BOOLEAN MODE) AS score FROM words WHERE MATCH (tzWord, esWord, enWord) AGAINST (:wildcardQuery IN BOOLEAN MODE) ORDER BY SCORE DESC, tzWord = :query DESC, enWord = :query DESC, esWord = :query DESC) UNION (SELECT  *, MATCH (tzWord, esWord, enWord) AGAINST (:query IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) AS score FROM words WHERE MATCH (tzWord, esWord, enWord) AGAINST (:query IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) ORDER BY SCORE DESC, tzWord = :query DESC, enWord = :query DESC, esWord = :query DESC) LIMIT 50`,
      { wildcardQuery: wildcardQuery, query: query }
    );
  return Response.json(results[0]);
}
