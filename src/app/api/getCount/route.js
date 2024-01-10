import "dotenv/config";
require("dotenv").config();

import mysql from "mysql2";

export async function GET() {
  // Create the connection to the database
  const connection = mysql.createConnection(process.env.PLANET_URL);

  // simple query
  const results = await connection
    .promise()
    .query("select count (*) from words");
  return Response.json(results[0][0]["count(*)"]);
}
