const MongoClient = require("mongodb").MongoClient;
const uri = "FILL IN!";

// Function to convert the first letter of a string to lowercase
const toLowerCaseFirstLetter = (str) => {
  if (!str) return str;
  return str.charAt(0).toLowerCase() + str.slice(1);
};

async function updateTranslations() {
  const client = new MongoClient(uri, {});

  try {
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db("tzdb");
    const collection = db.collection("words");

    // Find all documents
    const documents = await collection.find({}).toArray();

    // Update each document
    for (let doc of documents) {
      console.log("DOCUMENT", doc._id);
      let updated = false;

      // Update English translation if it exists
      if (doc.definitions[0].en && doc.definitions[0].en.translation) {
        doc.definitions[0].en.translation = toLowerCaseFirstLetter(
          doc.definitions[0].en.translation
        );
        updated = true;
      }

      // Update Spanish translation if it exists
      if (doc.definitions[0].es && doc.definitions[0].es.translation) {
        doc.definitions[0].es.translation = toLowerCaseFirstLetter(
          doc.definitions[0].es.translation
        );
        updated = true;
      }

      // Update the document in the database if any field was updated
      if (updated) {
        await collection.updateOne(
          { _id: doc._id },
          { $set: { definitions: doc.definitions } }
        );
      }
    }

    console.log("Translations updated successfully");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

updateTranslations();
