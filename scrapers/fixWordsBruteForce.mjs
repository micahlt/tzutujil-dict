import { configDotenv } from "dotenv";
configDotenv({ path: '../.env.local' })
import { MongoClient, ObjectId } from "mongodb";
const uri = process.env.MONGODB_URL;

async function main() {
    const client = new MongoClient(uri);
    const db = client.db("tzdb");
    const tzdb = db.collection("words");
    /** @type {Word[]} */
    const w = await tzdb.find({
        lastModified: {
            $gte: new Date("February 23, 2025")
        }
    }).toArray();
    // console.log(w[0]);
    for (let word of w) {
        if (word.definitions.length > 1) {
            // console.log(word.definitions);
            if (word.definitions[0].es.translation === word.definitions[1].es.translation) {
                console.log("Removing duplicate definitions");
                word.definitions = word.definitions.slice(1);
                await tzdb.updateOne({
                    _id: new ObjectId(word._id)
                }, {
                    $set: {
                        definitions: word.definitions
                    }
                });
            }
        }
    }
}

main();