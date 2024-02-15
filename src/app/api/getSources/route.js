import "dotenv/config";
require("dotenv").config();

import mysql from "mysql2";

export async function GET(req) {
  // Create the connection to the database
  const connection = mysql.createConnection(process.env.PLANET_URL);
  const searchParams = req.nextUrl.searchParams;
  const limit = searchParams.get("limit");
  const offset = searchParams.get("offset");

  // simple query
  const results = await connection
    .promise()
    .query(
      `SELECT * FROM sources${limit ? " LIMIT " + limit : ""}${
        offset ? " OFFSET " + offset : ""
      }`
    );
  return Response.json(results[0]);
}
