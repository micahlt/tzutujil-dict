import "dotenv/config";
require("dotenv").config();
import { Client } from "@elastic/elasticsearch";

export async function GET(req) {
  // Create the connection to the database
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.length < 3) {
    return Response.json([]);
  } else {
    const client = new Client({
      node: process.env.ELASTIC_URL,
      auth: {
        apiKey: process.env.ELASTIC_APIKEY,
      },
    });
    const searchResult = await client.search({
      index: process.env.ELASTIC_WORD_INDEX,
      q: query,
      suggest: {
        suggest0: {
          prefix: query,
          completion: {
            field: "variants",
            size: 5,
            skip_duplicates: true,
          },
        },
        suggest1: {
          prefix: query,
          completion: {
            field: "definitions.en.translation",
            size: 5,
            skip_duplicates: true,
          },
        },
        suggest2: {
          prefix: query,
          completion: {
            field: "definitions.es.translation",
            size: 5,
            skip_duplicates: true,
          },
        },
      },
    });

    let suggs = [];
    Object.keys(searchResult.suggest).forEach((sugKey) => {
      const opts = searchResult.suggest[sugKey][0].options;
      if (opts.length == 0) {
        return;
      } else {
        opts.forEach((opt) => {
          suggs.push(opt._source);
        });
      }
    });

    console.log(suggs);
    return Response.json(
      suggs.filter(
        (obj1, i, arr) => arr.findIndex((obj2) => obj2.id === obj1.id) === i
      )
    );
  }
}
