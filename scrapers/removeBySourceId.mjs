import { configDotenv } from "dotenv";
configDotenv({ path: '../.env.local' })
import { MongoClient, ObjectId } from "mongodb";
const uri = process.env.MONGODB_URL;

async function main() {
    const client = new MongoClient(uri);
    const db = client.db("tzdb");
    const tzdb = db.collection("words");
    const d = await tzdb.deleteMany({
        sourceId: "66713f70e33053ebab5fe944"
    });
    console.log(d);
}

main();