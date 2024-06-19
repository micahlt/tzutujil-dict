"use client";
import { useState } from "react";
import styles from "../page.module.css";

export default function ExtractorJson() {
  const [json, setJson] = useState("");
  const [extracted, setExtracted] = useState("");
  const [words, setWords] = useState([]);
  const [uploaded, setUploaded] = useState(0);
  const extractInfo = (json) => {
    console.log(json);
    let dict = [];
    const esDefs = json.espaniol.split(", ");
    const esExs = [json.exes];
    const tzExs = [json.extzu];
    const generateDefs = () => {
      for (let i = 0; i < esDefs.length; i++) {
        dict.push({
          en: {
            translation: "",
            example: "",
          },
          es: {
            translation: esDefs[i] || "",
            example: esExs[i] || "",
          },
          tz: {
            example: tzExs[i] || "",
          },
        });
      }
    };
    generateDefs();
    return {
      variants: json.tzutujil.split(", "),
      notes: "",
      part: 0,
      related: [],
      roots: [],
      definitions: dict,
      sourceId: "6670bde88c1c1d4981e2138d",
    };
  };
  const performExtraction = () => {
    setUploaded(0);
    console.log("\nPERFORMING EXTRACTION\n");
    let parsed = JSON.parse(json);
    let data = [];
    parsed.forEach((item) => {
      data.push(extractInfo(item));
    });
    setWords(data);
    setExtracted(JSON.stringify(data));
  };

  const performUpload = async () => {
    for (let i = 0; i < words.length; i++) {
      await fetch("/api/word", {
        method: "PUT",
        body: JSON.stringify(words[i]),
        headers: {
          "x-pwd": window.localStorage.getItem("pwd"),
        },
      });
      setUploaded((prevState) => prevState + 1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  return (
    <main className={styles.exgrid}>
      <textarea
        className={styles.input}
        onChange={(e) => setJson(e.target.value)}
        placeholder="Enter JSON here"
      ></textarea>
      <button className={styles.extractor} onClick={performExtraction}>
        Preview Extraction Data
      </button>
      <div className={styles.uploader}>
        <button onClick={performUpload} className={styles.uploaderBtn}>
          Upload to TzDB
        </button>
        <progress value={uploaded} max={words.length} />
      </div>
      <textarea
        readOnly
        className={styles.output}
        value={extracted}
        placeholder="Preview"
      ></textarea>
    </main>
  );
}
