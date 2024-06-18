import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

export async function getSource(id) {
  if (!id) {
    return false;
  }

  const client = await clientPromise;
  const sources = client.db("tzdb").collection("sources");

  let result = await sources.findOne({ _id: ObjectId.createFromHexString(id) });

  if (result != null) {
    return JSON.stringify(result);
  } else {
    return false;
  }
}
