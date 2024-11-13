import { configDotenv } from "dotenv";
configDotenv({ path: '../.env.local' })
import Crawler from "crawler";
import scrapeIt from "scrape-it";
import { json2csv } from "json-2-csv";
import fs from 'fs';
import path from "path";
let __dirname = path.resolve(path.dirname(''));

const PARTS_OF_SPEECH = {
    // 1-indexed because 0 represents undefined
    "pronombre": 1,
    "verbo": 2,
    "sustantivo": 3,
    "adjectivo": 4,
    "adjetivo": 4,
    "adverbio": 5,
    "partículo": 6,
    "interjección": 7,
    "otro": 8,
    "número": 8
};

const partOfSpeechConvert = (es) => {
    if (!es) return undefined;
    const esArr = es.split(' ');
    for (const w of esArr) {
        if (!!PARTS_OF_SPEECH[w]) {
            return PARTS_OF_SPEECH[w];
        }
    }
    return undefined;
}

let final = [];

const c = new Crawler({
    maxConnections: 5,
    // This will be called for each crawled page
    callback: (error, res, done) => {
        if (error) {
            console.log(error);
        } else {
            const d = scrapeIt.scrapeHTML(res.$, {
                Tzutujil: {
                    selector: ".entry h3",
                    convert: (v) => {
                        return v.replaceAll("’", "'")
                    }
                },
                English: ".entry .insides .gloss",
                Spanish: {
                    texteq: 0,
                    selector: ".entry .insides [lang=es]",
                    "convert": (v) => {
                        return v.split(",", 1)[0]
                    }
                },
                Part: {
                    selector: ".entry .insides .pos",
                    convert: partOfSpeechConvert
                }

            });
            final.push(d);
            console.log("Uploaded", d.Tzutujil)
        }
        done();
    },
});

c.on("drain", async () => {
    for (const i in final) {
        const d = final[i];
        const def = {
            sourceId: "66714565ee1a78472269fd9a",
            variants: [
                d.Tzutujil
            ],
            definitions: [
                {
                    en: {
                        translation: d.English,
                        example: ""
                    },
                    es: {
                        translation: d.Spanish,
                        example: ""
                    },
                    tz: {
                        example: ""
                    }
                }
            ],
            part: d.Part
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
            final[i].URL = "https://v2.dictionary.tzutujil.org" + j.url;
        } else {
            console.error(req.status);
            console.error(await req.text());
            final[i].URL = "ERROR"
        }
    }
    const csv = json2csv(final);
    fs.writeFile(path.join(__dirname, "talkingdictionary.csv"), csv, () => {
        console.log("Dictionary terms have been uploaded and written to talkingdictionary.csv");
    });
})

for (let i = 1; i < 482; i++) {
    c.add([
        {
            url: `http://talkingdictionary.swarthmore.edu/tzutujil/?entry=${i}`
        }
    ]);
}