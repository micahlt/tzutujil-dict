import "dotenv/config";
require("dotenv").config();

import mysql from "mysql2";

export async function GET(req) {
  // Create the connection to the database
  const connection = mysql.createConnection(process.env.PLANET_URL);
  connection.config.namedPlaceholders = true;
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  const wildcardQuery = `${query}*`;

  if (!query) {
    return Response.json([]);
  } else {
    const results = await connection.promise().execute(
      `(
        SELECT 
          tzWord, 
          enWord, 
          esWord, 
          id
        FROM 
          words 
        WHERE 
          tzWord = :query
          OR enWord = :query
          OR esWord = :query
      ) 
      UNION
      (
        SELECT
        tzWord, 
        enWord, 
        esWord, 
        id
        FROM
        (
        SELECT 
          tzWord, 
          enWord, 
          esWord, 
          id, 
          MATCH (tzWord, esWord, enWord) AGAINST (:wildcardQuery IN BOOLEAN MODE) AS score 
        FROM 
          words 
        WHERE 
          MATCH (tzWord, esWord, enWord) AGAINST (:wildcardQuery IN BOOLEAN MODE)
        ORDER BY 
          SCORE DESC, 
          tzWord = :query DESC, 
          enWord = :query DESC, 
          esWord = :query DESC 
        LIMIT 
          5
      ) AS derivedTable)
      `,
      { wildcardQuery: wildcardQuery, query: query }
    );
    return Response.json(results[0]);
  }
}
