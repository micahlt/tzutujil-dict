import "dotenv/config";
require("dotenv").config();

import mysql from "mysql2";

export async function GET(req) {
  // Create the connection to the database
  const connection = mysql.createConnection(process.env.PLANET_URL);
  const searchParams = req.nextUrl.searchParams;
  const query = `${searchParams.get("q")}`.replace("'", "’");

  const results = await connection
    .promise()
    .execute(
      `SELECT * FROM words WHERE MATCH(tzWord, esWord, enWord) AGAINST (? IN NATURAL LANGUAGE MODE WITH QUERY EXPANSION) LIMIT 50`,
      [query]
    );
  return Response.json(results[0]);
}
