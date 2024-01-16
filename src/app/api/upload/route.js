import "dotenv/config";
require("dotenv").config();

import { headers } from "next/headers";
const mysql = require("mysql2");

export async function POST(req) {
  const headersList = headers();
  const password = headersList.get("x-pwd");
  // Create the connection to the database
  if (password == process.env.ADMIN_PASSWORD) {
    const connection = mysql.createConnection(process.env.PLANET_URL);

    const json = await req.json();
    Object.keys(json).forEach((key) => {
      json[key] = json[key].replaceAll("’", "'");
    });
    connection.execute(
      `insert into words (tzWord, esPronounce, enWord, esWord, tzExampleSentence, esExampleSentence, enExampleSentence) values (?, ?, ?, ?, ?, ?, ?)`,
      [
        json.tzWord,
        json.esPronounce || null,
        json.enWord || null,
        json.esWord || null,
        json.tzExampleSentence || null,
        json.esExampleSentence || null,
        json.enExampleSentence || null,
      ],
      (err, res, fields) => {
        console.log(res);
      }
    );

    connection.end();
    return Response.json({
      success: true,
      warning: "This endpoint is depreciated.  Please switch to PUT /api/word",
    });
  } else {
    return new Response(
      JSON.stringify({ success: false, reason: "Unauthorized" }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
