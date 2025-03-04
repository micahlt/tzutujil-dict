import { configDotenv } from "dotenv";
import "../src/lib/types.js";
configDotenv({ path: '../.env.local' })
import { MongoClient, ObjectId } from "mongodb";
const uri = process.env.MONGODB_URL;

async function main() {
    const client = new MongoClient(uri);
    const db = client.db("tzdb");
    const tzdb = db.collection("words");
    const w = await tzdb.find({
        variants: {
            $size: 2
        }
    })
    /** @type {Word[]} */
    const words = await w.toArray();
    words.forEach((word) => {
        let uniqueDefs = [];
        let uniqueVariants = [];
        word.definitions.forEach((def) => {
            const index = uniqueDefs.findIndex((w) => w.es.translation == def.es.translation);
            if (index == -1) {
                uniqueDefs.push(def);
            }
        });
        word.definitions = uniqueDefs;
        word.variants.forEach((variant) => {
            const index = uniqueVariants.findIndex((v) => v.toLowerCase().replaceAll("’", "'") == variant.toLowerCase().replaceAll("’", "'"));
            if (index == -1) {
                uniqueVariants.push(variant.toLowerCase().replaceAll("’", "'"));
            }
        });
        word.variants = uniqueVariants;
    });
    words.forEach(async (word) => {
        console.log(word.variants);
        console.log(word.definitions);
        // await tzdb.updateOne({ _id: new ObjectId(word._id) }, { $set: { definitions: word.definitions, variants: word.variants } });
    });
}

main();