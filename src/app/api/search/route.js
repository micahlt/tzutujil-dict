import "dotenv/config";
require("dotenv").config();

import { Client } from "@elastic/elasticsearch";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const query = "*" + searchParams.get("q") + "*";
  const client = new Client({
    node: process.env.ELASTIC_URL,
    auth: {
      apiKey: process.env.ELASTIC_APIKEY,
    },
  });
  const results = await client.search({
    query: {
      multi_match: {
        query: query.replaceAll("'", "*").replaceAll("’", "*"),
        fields: ["variants^2", "definitions.*"],
        max_expansions: 100,
      },
    },
    collapse: {
      field: "id",
    },
  });
  const suggestions = await client.search({
    index: process.env.ELASTIC_WORD_INDEX,
    q: query,
    suggest: {
      suggest0: {
        prefix: query,
        completion: {
          field: "variants",
          size: 10,
          skip_duplicates: true,
        },
      },
      suggest1: {
        prefix: query,
        completion: {
          field: "definitions.en.translation",
          size: 10,
          skip_duplicates: true,
        },
      },
      suggest2: {
        prefix: query,
        completion: {
          field: "definitions.es.translation",
          size: 10,
          skip_duplicates: true,
        },
      },
    },
  });
  let suggs = [];
  Object.keys(suggestions.suggest).forEach((sugKey) => {
    const opts = suggestions.suggest[sugKey][0].options;
    if (opts.length == 0) {
      return;
    } else {
      opts.forEach((opt) => {
        suggs.push(opt._source);
      });
    }
  });
  const suggsResults = suggs.filter(
    (obj1, i, arr) => arr.findIndex((obj2) => obj2.id === obj1.id) === i
  );
  const searchResults = results.hits.hits.flatMap((v) => v._source);
  let finalArr = [];
  console.log(suggsResults);
  searchResults.forEach((result) => {
    if (!finalArr.some((r) => r.id === result.id)) {
      finalArr.push(result);
    }
  });
  suggsResults.forEach((result) => {
    if (!finalArr.some((r) => r.id === result.id)) {
      finalArr.push(result);
    }
  });

  return Response.json(finalArr);
}
