import "dotenv/config";
require("dotenv").config();

import mysql from "mysql2";
import { headers } from "next/headers";

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

export async function PATCH(req) {
  const headersList = headers();
  const password = headersList.get("x-pwd");
  // Create the connection to the database
  if (password == process.env.ADMIN_PASSWORD) {
    const connection = mysql.createConnection(process.env.PLANET_URL);

    const json = await req.json();

    if (!json || !json.id) {
      return new Response(
        JSON.stringify({ success: false, reason: "Missing content or ID" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      connection.execute(
        `UPDATE words SET tzWord=?, esPronounce=?, enWord=?, esWord=?, tzExampleSentence=?, esExampleSentence=?, enExampleSentence=?, notes=? WHERE id=?`,
        [
          json.tzWord,
          json.esPronounce || null,
          json.enWord || null,
          json.esWord || null,
          json.tzExampleSentence || null,
          json.esExampleSentence || null,
          json.enExampleSentence || null,
          json.notes || null,
          json.id,
        ],
        (err, res, fields) => {
          console.log(res);
        }
      );

      connection.end();
      return Response.json({ success: true });
    }
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

export async function DELETE(req) {
  const headersList = headers();
  const password = headersList.get("x-pwd");
  // Create the connection to the database
  if (password == process.env.ADMIN_PASSWORD) {
    const connection = mysql.createConnection(process.env.PLANET_URL);

    const json = await req.json();

    if (!json || !json.id) {
      return new Response(
        JSON.stringify({ success: false, reason: "Missing ID" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      connection.execute(
        `DELETE FROM words WHERE id=?`,
        [json.id],
        (err, res, fields) => {
          console.log(res);
        }
      );

      connection.end();
      return Response.json({ success: true });
    }
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
