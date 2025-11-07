import universalSearch from "@/lib/universalSearch";
import "dotenv/config";
require("dotenv").config();

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  let limit = searchParams.get("limit");
  if (!parseInt(limit)) {
    limit = 50;
  }
  if (limit > 50) {
    limit = 50;
  }
  const res = await universalSearch(query, Number(limit));

  return Response.json(res);
}
