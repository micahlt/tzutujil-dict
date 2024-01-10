"use client";
import { useState } from "react";
import styles from "../page.module.css";

export default function ExtractorTzEs() {
  const [lines, setLines] = useState("");
  const [extracted, setExtracted] = useState("");
  const [words, setWords] = useState([]);
  const extractInfo = (testString) => {
    const tzWord = testString.split("—")[0].trim();
    const esWord = testString.split("—")[1].trim();
    return {
      tzWord,
      esWord,
    };
  };
  const performExtraction = () => {
    console.log("\nPERFORMING EXTRACTION\n");
    const splitLines = lines.split("\n");
    let newLines = "";
    let data = [];
    splitLines.forEach((line) => {
      if (line.includes("—")) {
        let info = extractInfo(line.replaceAll("", "").trim());
        data.push(info);
        let lineText = `| TZ WORD: ${info.tzWord}\n| ES WORD: ${info.esWord}\n---------------------------`;
        newLines += lineText + "\n";
      }
    });
    setWords(data);
    setExtracted(newLines);
  };
  const performUpload = () => {
    words.forEach((word) => {
      fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify(word),
      });
    });
  };
  return (
    <main className={styles.exgrid}>
      <textarea
        className={styles.input}
        onChange={(e) => setLines(e.target.value)}
        placeholder="Aab’aj — piedra, roca"
      ></textarea>
      <button className={styles.extractor} onClick={performExtraction}>
        Preview Extraction Data
      </button>
      <button className={styles.uploader} onClick={performUpload}>
        Upload to TzDB
      </button>
      <textarea
        readOnly
        className={styles.output}
        value={extracted}
        placeholder="Preview"
      ></textarea>
    </main>
  );
}
