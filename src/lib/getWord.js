import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";
import { notFound } from "next/navigation";

export async function getWord(idOrTzWord) {
  if (!idOrTzWord) {
    return notFound();
  }
  let mode = "id";
  try {
    ObjectId.createFromHexString(idOrTzWord);
  } catch {
    mode = "tzWord";
  }
  
  const client = await clientPromise;
  const words = client.db("tzdb").collection("words");

  let result;
  if (mode == "id") {
    result = await words.findOne({
      _id: ObjectId.createFromHexString(idOrTzWord),
    });
  } else if (mode == "tzWord") {
    result = await words.findOne({ "variants.0": idOrTzWord });
  }

  if (result != null) {
    return JSON.stringify(result);
  } else {
    return notFound();
  }
}
