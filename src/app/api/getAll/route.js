import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  // Create the connection to the database
  const client = await clientPromise;
  const db = client.db("tzdb");
  const searchParams = req.nextUrl.searchParams;
  const limit = searchParams.get("limit") || 50;
  const offset = searchParams.get("offset");
  const type = searchParams.get("type") == "sources" ? "sources" : "words";

  const collection = db.collection("words");
  const results = await collection
    .find({}, { limit: limit < 100 ? limit : 100, skip: offset })
    .toArray();
  return Response.json(results);
}
