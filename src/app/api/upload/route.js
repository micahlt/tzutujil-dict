import "dotenv/config";
require("dotenv").config();

const mysql = require("mysql2");

export async function POST(req) {
  // Create the connection to the database
  const connection = mysql.createConnection(process.env.PLANET_URL);

  const json = await req.json();

  // // simple query
  // connection.query("select * from words", function (err, results, fields) {
  //   console.log(results); // results contains rows returned by server
  // });

  connection.execute(
    `insert into words (tzWord, esPronounce, enWord, esWord, tzExampleSentence, esExampleSentence) values (?, ?, ?, ?, ?, ?)`,
    [
      json.tzWord,
      json.esPronounce || null,
      json.enWord || null,
      json.esWord || null,
      json.tzExampleSentence || null,
      json.esExampleSentence || null,
    ],
    (err, res, fields) => {
      console.log(res);
    }
  );

  connection.end();
  return Response.json({});
}
