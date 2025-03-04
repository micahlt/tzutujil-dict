"use client";
import { useState } from "react";
import styles from "../page.module.css";
import { PARTS_COLORS, PARTS_OF_SPEECH } from "@/lib/partsOfSpeech";

export default function ExtractorFunky() {
  const [lines, setLines] = useState("");
  const [extracted, setExtracted] = useState("");
  const [words, setWords] = useState([]);
  const [uploaded, setUploaded] = useState(0);
  const [part, setPart] = useState(0);
  const extractInfo = (testString) => {
    const tzWord = testString.split("[")[0].trim().toLowerCase();
    const esPronounce = testString.split("[")[1].split("]")[0].trim().toLowerCase();
    const esWord = testString.split("] = ")[1].split(" =")[0].trim().toLowerCase();
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
      console.log(line);
      let info = extractInfo(line.replaceAll("", "").trim());
      console.log(info);
      data.push(info);
      let lineText = `| TZ WORD: ${info.tzWord}\n| PART OF SPEECH: ${PARTS_OF_SPEECH[part]?.en || "none"}\n| ES WORD: ${info.esWord}\n| EN WORD: ${info.enWord}\n---------------------------`;
      newLines += lineText + "\n";
    });
    setWords(data);
    setExtracted(newLines);
  };

  const performUpload = async () => {
    setUploaded(0);
    for (let i = 0; i < words.length; i++) {
      await fetch("/api/word", {
        method: "PUT",
        body: JSON.stringify({
          variants: [words[i].tzWord],
          definitions: [
            {
              en: {
                translation: words[i].enWord,
                example: "",
              },
              es: {
                translation: words[i].esWord,
                example: "",
              },
              tz: {
                example: "",
              },
            },
          ],
          part: part,
          sourceId: "66713fe6e33053ebab5fe945"
        }),
        headers: {
          "x-pwd": window.localStorage.getItem("pwd"),
        },
      });
      setUploaded((prevState) => prevState + 1);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  };

  return (
    <main className={styles.exgrid}>
      <textarea
        className={styles.input}
        onChange={(e) => setLines(e.target.value)}
        placeholder="Aab’aj [ab aw] = piedra, roca = stone, rock [stōōn, rawk]"
      ></textarea>
      <div className={styles.uploader} style={{ gridArea: "c" }}>
        <select
          className={styles.sortPicker}
          style={{ backgroundColor: PARTS_COLORS[part] }}
          value={part}
          onChange={(e) => {
            setPart(e.target.value);
          }}
        >
          {Object.keys(PARTS_OF_SPEECH).map((key, i) => (
            <option
              key={i}
              value={key}
              style={{ backgroundColor: PARTS_COLORS[key] }}
            >
              {PARTS_OF_SPEECH[key]["en"].toLowerCase()}
            </option>
          ))}
          <option value={0}>unset</option>
        </select>
        <button className={styles.extractor} onClick={performExtraction}>
          Preview Extraction Data
        </button>
      </div>
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
        placeholder="Aab’aj [ab aw] = piedra, roca = stone, rock [stōōn, rawk]"
      ></textarea>
    </main>
  );
}
