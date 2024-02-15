import "dotenv/config";
require("dotenv").config();

import mysql from "mysql2/promise";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function GET(req) {
  // Create the connection to the database
  const connection = await mysql.createConnection(process.env.PLANET_URL);
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");

  // simple query
  const results = await connection.execute(`SELECT * FROM words WHERE id=?`, [
    id,
  ]);
  return Response.json(results[0][0]);
}

export async function PUT(req) {
  const headersList = headers();
  const password = headersList.get("x-pwd");
  // Create the connection to the database
  if (password == process.env.ADMIN_PASSWORD) {
    const connection = await mysql.createConnection(process.env.PLANET_URL);

    const json = await req.json();

    if (!json) {
      return new Response(
        JSON.stringify({ success: false, reason: "Missing content" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } else {
      Object.keys(json).forEach((key) => {
        json[key] = json[key].replaceAll("’", "'");
      });
      try {
        const [res] = await connection.execute(
          `INSERT INTO words (tzWord, esPronounce, enWord, esWord, tzExampleSentence, esExampleSentence, enExampleSentence, notes, sourceId) VALUES (?,?,?,?,?,?,?,?,?)`,
          [
            json.tzWord,
            json.esPronounce || null,
            json.enWord || null,
            json.esWord || null,
            json.tzExampleSentence || null,
            json.esExampleSentence || null,
            json.enExampleSentence || null,
            json.notes || null,
            json.sourceId || null,
          ]
        );
        connection.end();
        if (res.err) {
          return new Response(
            JSON.stringify({ success: false, code: res.err }),
            {
              status: 400,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          return Response.json({ success: true, id: res.insertId });
        }
      } catch (err) {
        return new Response(
          JSON.stringify({
            success: false,
            code: err.code == "ER_DUP_ENTRY" ? "ALREADY_EXISTS" : err.code,
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
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

export async function PATCH(req) {
  const headersList = headers();
  const password = headersList.get("x-pwd");
  // Create the connection to the database
  if (password == process.env.ADMIN_PASSWORD) {
    const connection = await mysql.createConnection(process.env.PLANET_URL);

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
      try {
        const { err, res } = await connection.execute(
          `UPDATE words SET tzWord=?, esPronounce=?, enWord=?, esWord=?, tzExampleSentence=?, esExampleSentence=?, enExampleSentence=?, notes=?, sourceId=? WHERE id=?`,
          [
            json.tzWord,
            json.esPronounce || null,
            json.enWord || null,
            json.esWord || null,
            json.tzExampleSentence || null,
            json.esExampleSentence || null,
            json.enExampleSentence || null,
            json.notes || null,
            json.sourceId || null,
            json.id,
          ]
        );
        connection.end();
        if (err) {
          return new Response(JSON.stringify({ success: false, reason: err }), {
            status: 400,
            headers: {
              "Content-Type": "application/json",
            },
          });
        } else {
          revalidatePath(`/words/${json.id}`);
          return Response.json({ success: true });
        }
      } catch (err) {
        return new Response(
          JSON.stringify({
            success: false,
            code: err.code == "ER_DUP_ENTRY" ? "ALREADY_EXISTS" : err.code,
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
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
    const connection = await mysql.createConnection(process.env.PLANET_URL);

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
      await connection.execute(`DELETE FROM words WHERE id=?`, [json.id]);
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
