import clientPromise from "@/lib/mongodb";

export async function GET() {
  // Create the connection to the database
  const client = await clientPromise;
  const db = client.db("tzdb");
  const words = db.collection("words");

  const results = await words.countDocuments({});
  await client.close();
  return new Response(results);
}
