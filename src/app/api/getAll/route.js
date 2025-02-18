import clientPromise from "@/lib/mongodb";
import { sortDirections } from "@/lib/sort";

export async function GET(req) {
  // Create the connection to the database
  const client = await clientPromise;
  const db = client.db("tzdb");
  const searchParams = req.nextUrl.searchParams;
  const limit = searchParams.get("limit") || 50;
  const offset = searchParams.get("offset");
  const type = searchParams.get("type") == "sources" ? "sources" : "words";
  const sortBy = searchParams.get("sortBy") || "lastModified";
  const sortDir = searchParams.get("sortDir") || sortDirections.DESC;
  const partOfSpeech = searchParams.get("partOfSpeech") || false;

  const collection = db.collection(type);
  const results = await collection
    .find(
      partOfSpeech ?
        {
          part: Number(partOfSpeech),
        } : {}
    )
    .skip(Number(offset))
    .limit(Number(limit) < 100 ? Number(limit) : 100)
    .sort([[sortBy, Number(sortDir)]])
    .toArray();
  return Response.json(results);
}
