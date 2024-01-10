import "dotenv/config";
require("dotenv").config();

import mysql from "mysql2";

export async function GET(req) {
  // Create the connection to the database
  const connection = mysql.createConnection(process.env.PLANET_URL);
  const searchParams = req.nextUrl.searchParams;
  const query = `%${searchParams.get("q")}%`.replace("'", "’");
  const autoComplete = searchParams.get("ac");

  // simple query
  const results = await connection
    .promise()
    .execute(
      `SELECT * FROM words WHERE tzWord LIKE ? OR esWord LIKE ? OR enWord LIKE ? ORDER BY tzWord ${
        autoComplete ? "LIMIT 5" : ""
      };`,
      [query, query, query]
    );
  return Response.json(results[0]);
}
