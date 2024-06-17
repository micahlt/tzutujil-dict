import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  // Create the connection to the database
  const client = await clientPromise;
  const db = client.db("tzdb");
  const words = db.collection("words");
  const searchParams = req.nextUrl.searchParams;
  const limit = searchParams.get("limit") || 50;
  const offset = searchParams.get("offset");
  const type = searchParams.get("type") == "sources" ? "sources" : "words";

  // simple query
  const results = words.find({}, { limit: limit > 100 ? 100 : limit });
  return Response.json(Array.from(results));
}
