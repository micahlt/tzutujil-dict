import "dotenv/config";
require("dotenv").config();

import mysql from "mysql2";

export async function GET(req) {
  // Create the connection to the database
  const connection = mysql.createConnection(process.env.PLANET_URL);
  const searchParams = req.nextUrl.searchParams;
  const query = `${searchParams.get("q")}`.replace("'", "’");

  if (!query) {
    return Response.json([]);
  } else {
    const results = await connection
      .promise()
      .execute(
        `SELECT  *, MATCH (tzWord, esWord, enWord) AGAINST ('*${
          query || ""
        }*' IN BOOLEAN MODE) AS SCORE FROM words WHERE MATCH (tzWord, esWord, enWord) AGAINST ('*${query}*' IN BOOLEAN MODE) ORDER BY SCORE LIMIT 5`
      );
    return Response.json(results[0]);
  }
}
