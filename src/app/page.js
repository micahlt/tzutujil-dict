"use client";
import { useEffect, useState } from "react";
import styles from "@/app/home.module.css";
import local from "@/app/i18n";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [count, setCount] = useState(1);
  const [words, setWords] = useState([]);
  useEffect(() => {
    fetch("/api/getCount")
      .then((res) => res.text())
      .then((text) => setCount(text));
    fetch("/api/getAll")
      .then((res) => res.json())
      .then((json) => setWords(json));
  }, []);
  return (
    <>
      <Navbar />
      <main>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <p>{local.t("heroSubtitle")}</p>
            <h2>
              {local.t("moreThan")} <span>{count - 1}</span>{" "}
              {local.t("translatedWords")}
            </h2>
          </div>
        </div>
        <div className={styles.allWords}>
          <ul>
            {words.map((word) => (
              <li key={word.id}>{word.tzWord}</li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
