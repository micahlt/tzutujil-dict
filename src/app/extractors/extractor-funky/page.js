"use client";
import { useEffect, useState } from "react";
import styles from "../page.module.css";

export default function ExtractorFunky() {
  const [lines, setLines] = useState("");
  const [extracted, setExtracted] = useState("");
  const [wordData, setWordData] = useState([]);
  const extractInfo = (testString) => {
    const tzWord = testString.split("[")[0].trim();
    const esPronounce = testString.split("[")[1].split("]")[0].trim();
    const esWord = testString.split("] = ")[1].split(" =")[0].trim();
    const enWord = testString
      .split("] = ")[1]
      .split(" = ")[1]
      .split("[")[0]
      .trim();
    return {
      tzWord,
      esPronounce,
      esWord,
      enWord,
    };
  };
  const performExtraction = () => {
    console.log("\nPERFORMING EXTRACTION\n");
    const splitLines = lines.split("\n");
    let newLines = "";
    let data = [];
    splitLines.forEach((line) => {
      let info = extractInfo(line.replaceAll("", "").trim());
      fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify(info),
      });
      data.push(info);
      let lineText = `| TZ WORD: ${info.tzWord}\n| ES PRONOUNCE: ${info.esPronounce}\n| ES WORD: ${info.esWord}\n| EN WORD: ${info.enWord}\n---------------------------`;
      newLines += lineText + "\n";
    });
    setExtracted(newLines);
  };
  useEffect(() => {}, [lines]);
  return (
    <main className={styles.exgrid}>
      <textarea
        className={styles.input}
        onChange={(e) => setLines(e.target.value)}
        placeholder="Aab’aj [ab aw] = piedra, roca = stone, rock [stōōn, rawk]"
      ></textarea>
      <button className={styles.extractor} onClick={performExtraction}>
        Extract Info
      </button>
      <textarea
        readOnly
        className={styles.output}
        value={extracted}
        placeholder="Aab’aj [ab aw] = piedra, roca = stone, rock [stōōn, rawk]"
      ></textarea>
    </main>
  );
}
