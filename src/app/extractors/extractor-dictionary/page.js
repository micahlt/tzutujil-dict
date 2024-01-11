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
    let extractionPhase = 1;
    const splitData = lines
      .replace(/(Tz’utujil Tinaamitaal\n\d+)/g, "")
      .split(/[\?.]/g);
    let newLines = "";
    let data = [];
    let currentWord = {};
    splitData.forEach((d) => {
      switch (extractionPhase) {
        case 1: {
          currentWord.tzWord = d.replaceAll("\n", " ").trim();
          break;
        }
        case 2: {
          currentWord.esWord = d.replaceAll("\n", " ").trim();
          break;
        }
        case 3: {
          currentWord.tzExampleSentence = d.replaceAll("\n", " ").trim();
          break;
        }
        case 4: {
          currentWord.esExampleSentence = d.replaceAll("\n", " ").trim();
          extractionPhase = 0;
          newLines += `| TZ WORD: ${currentWord.tzWord}\n| ES WORD: ${currentWord.esWord}\n| TZ EXAMPLE: ${currentWord.tzExampleSentence}\n| ES EXAMPLE: ${currentWord.esExampleSentence}\n---------------------------\n`;
          data.push(currentWord);
          currentWord = {};
          break;
        }
        default: {
          break;
        }
      }
      extractionPhase++;
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
