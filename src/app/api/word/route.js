import "dotenv/config";
require("dotenv").config();

import mysql from "mysql2";

export async function GET(req) {
  // Create the connection to the database
  const connection = mysql.createConnection(process.env.PLANET_URL);
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  // simple query
  const results = await connection
    .promise()
    .execute(`SELECT * FROM words WHERE id=?`, [id]);
  return Response.json(results[0][0]);
}
