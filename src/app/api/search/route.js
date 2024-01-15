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
  const results = await connection.promise().execute(
    `(
        SELECT tzword, enword, esword, id
        FROM (
        SELECT *,
        MATCH (tzword, esword, enword) against ("metal*" IN boolean mode) AS score
        FROM words
        WHERE MATCH (tzword, esword, enword) against ("metal*" IN boolean mode)
        ORDER BY score DESC,
        tzword = "metal" DESC,
        enword = "metal" DESC,
        esword = "metal" DESC) AS alias1)
       UNION
        (
        SELECT tzword, enword, esword, id
        FROM (
        SELECT *,
        MATCH (tzword, esword, enword) against ("metal" IN NATURAL language mode WITH query expansion) AS score
        FROM words
        WHERE MATCH (tzword, esword, enword) against ("metal" IN NATURAL language mode WITH query expansion)
        ORDER BY score DESC,
        tzword = "metal" DESC,
        enword = "metal" DESC,
        esword = "metal" DESC) AS alias2)
       LIMIT 50;`,
    { wildcardQuery: wildcardQuery, query: query }
  );
  return Response.json(results[0]);
}
