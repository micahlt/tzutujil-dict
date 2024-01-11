"use client";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "react-feather";

export default function Word({ params: { word: wordId } }) {
  const [wordInfo, setWordInfo] = useState();
  useEffect(() => {
    fetch(`/api/word?id=${wordId}`)
      .then((res) => res.json())
      .then((json) => setWordInfo(json));
  }, []);
  return (
    <>
      <Navbar />
      {wordInfo ? (
        <main className={styles.main}>
          <Link href="/" className={styles.goHome}>
            <ArrowLeft size={24}></ArrowLeft> Go Home
          </Link>
          <p className={styles.smallTitle}>WORD</p>
          <h1>{wordInfo.tzWord}</h1>
          <div className={styles.divider}></div>
          <div className={styles.definitionGrid}>
            <div>
              <p className={styles.smallTitle}>SPANISH TRANSLATION</p>
              <h2>{wordInfo.esWord || ""}</h2>
            </div>
            <div>
              <p className={styles.smallTitle}>ENGLISH TRANSLATION</p>
              <h2>{wordInfo.enWord || ""}</h2>
            </div>
            <div>
              <p className={styles.smallTitle}>TZ'UTUJIL EXAMPLE</p>
              <h2>{wordInfo.tzExampleSentence || ""}</h2>
            </div>
            <div>
              <p className={styles.smallTitle}>SPANISH EXAMPLE</p>
              <h2>{wordInfo.esExampleSentence || ""}</h2>
            </div>
          </div>
        </main>
      ) : (
        <div className="loader" style={{ marginTop: "7rem" }}></div>
      )}
    </>
  );
}
