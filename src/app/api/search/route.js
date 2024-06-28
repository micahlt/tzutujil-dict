import "dotenv/config";
require("dotenv").config();

import { Client } from "@elastic/elasticsearch";

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
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
  return Response.json(results.hits.hits.flatMap((v) => v._source));
}
