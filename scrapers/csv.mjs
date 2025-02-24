import { configDotenv } from "dotenv";
configDotenv({ path: '../.env.local' })
import { csv2json, json2csv } from "json-2-csv";
import fs from "fs";
import path from "path";
let __dirname = path.resolve(path.dirname(''));
const input = fs.readFileSync("input.csv", {
    encoding: "utf-8"
})
let parsed = csv2json(input, {
    headerFields: ["tzWord", "esWord"],
    trimFieldValues: true,
    parseValue: (v) => v.trim().replaceAll("\r", '').replaceAll("\n", '').replaceAll("’", "'"),
    delimiter: {
        field: "	",
    }
});

console.log(parsed.length, "words to upload");

for (const i in parsed) {
    // if (i > 0) {
    //     break;
    // }
    const d = parsed[i];
    const variants = d.tzWord.split(",").map((v) => v.trim().toLowerCase());
    const def = {
        sourceId: "66713f70e33053ebab5fe944",
        variants: variants,
        definitions: [
            {
                en: {
                    translation: "",
                    example: ""
                },
                es: {
                    translation: d.esWord,
                    example: ""
                },
                tz: {
                    example: ""
                }
            }
        ],
        part: 0
    };
    const req = await fetch(`https://v2.dictionary.tzutujil.org/api/word`, {
        method: "PUT",
        headers: {
            "x-pwd": process.env.ADMIN_PASSWORD
        },
        body: JSON.stringify(def)
    });
    if ([200, 201, 409].includes(req.status)) {
        const j = await req.json();
        parsed[i].url = "https://v2.dictionary.tzutujil.org" + j.url;
        if (req.status === 201) {
            parsed[i].status = "Created";
        } else if (req.status === 409) {
            parsed[i].status = "Conflict";
        } else if (req.status === 200) {
            parsed[i].status = "Merged";
        }
        console.log(`Uploaded ${i} of ${parsed.length}`);
    } else {
        console.error(req.status);
        console.error(await req.text());
        parsed[i].url = "ERROR"
    }
}

fs.writeFile(path.join(__dirname, "output.csv"), json2csv(parsed), () => {
    console.log("Dictionary terms have been uploaded and written to output.csv");
});