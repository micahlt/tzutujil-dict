import clientPromise from "./mongodb";

export async function getSources() {
  const client = await clientPromise;
  const sources = client.db("tzdb").collection("sources");

  let result = await sources.find({}).toArray();

  if (result != null) {
    return JSON.stringify(result);
  } else {
    return false;
  }
}
