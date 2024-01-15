import "dotenv/config";
require("dotenv").config();

import mysql from "mysql2";

export async function GET(req) {
  // Create the connection to the database
  const connection = mysql.createConnection(process.env.PLANET_URL);
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return Response.json([]);
  } else {
    const results = await connection
      .promise()
      .execute(
        `SELECT  *, MATCH (tzWord, esWord, enWord) AGAINST (? IN BOOLEAN MODE) AS score FROM words WHERE MATCH (tzWord, esWord, enWord) AGAINST (? IN BOOLEAN MODE) ORDER BY SCORE DESC, tzWord = ? DESC, enWord = ? DESC, esWord = ? DESC LIMIT 5`,
        [`${query}*`, `${query}*`, query, query, query]
      );
    return Response.json(results[0]);
  }
}
