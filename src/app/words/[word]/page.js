"use client";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Edit2, Loader, Save } from "react-feather";

export default function Word({ params: { word: wordId } }) {
  const [wordInfo, setWordInfo] = useState();
  const [password, setPassword] = useState();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setPassword(localStorage.getItem("pwd"));
    fetch(`/api/word?id=${wordId}`)
      .then((res) => res.json())
      .then((json) => setWordInfo(json));
  }, []);
  const saveWord = () => {
    setLoading(true);
    if (wordId == "new") {
      return;
    } else {
      fetch(`/api/word`, {
        method: "PATCH",
        body: JSON.stringify(wordInfo),
        headers: {
          "x-pwd": password,
        },
      }).then((res) => {
        if (res.ok) {
          setEditMode(false);
        }
        setLoading(false);
      });
    }
  };
  return (
    <>
      <Navbar />
      {wordInfo ? (
        <main className={styles.main}>
          <div className={styles.headerFlex}>
            <Link href="/" className={styles.goHome}>
              <ArrowLeft size={24}></ArrowLeft> Go Home
            </Link>
            <div className={styles.spacer}></div>
            {password && (
              <a
                className={styles.button}
                href="#"
                style={{ backgroundColor: "#c9a70e" }}
                onClick={() => setEditMode(true)}
              >
                <Edit2 size={16} />
                Edit word
              </a>
            )}
            {password && editMode && (
              <a
                className={styles.button}
                href="#"
                style={{ backgroundColor: "#009262" }}
                onClick={saveWord}
              >
                {loading ? (
                  <Loader size={16} className={styles.rotate} />
                ) : (
                  <Save size={16} />
                )}
                Save changes
              </a>
            )}
          </div>
          <p className={styles.smallTitle}>WORD</p>
          <h1>{wordInfo.tzWord}</h1>
          <div className={styles.divider}></div>
          <div className={styles.definitionGrid}>
            <div>
              <p className={styles.smallTitle}>SPANISH TRANSLATION</p>
              <input
                disabled={!editMode}
                onChange={(e) => {
                  setWordInfo({ ...wordInfo, esWord: e.target.value });
                }}
                value={wordInfo.esWord || ""}
              ></input>
            </div>
            <div>
              <p className={styles.smallTitle}>ENGLISH TRANSLATION</p>
              <input
                disabled={!editMode}
                onChange={(e) => {
                  setWordInfo({ ...wordInfo, enWord: e.target.value });
                }}
                value={wordInfo.enWord || ""}
              ></input>
            </div>
            <div>
              <p className={styles.smallTitle}>TZ'UTUJIL EXAMPLE</p>
              <input
                disabled={!editMode}
                onChange={(e) => {
                  setWordInfo({
                    ...wordInfo,
                    tzExampleSentence: e.target.value,
                  });
                }}
                value={wordInfo.tzExampleSentence || ""}
              ></input>
            </div>
            <div>
              <p className={styles.smallTitle}>SPANISH EXAMPLE</p>
              <input
                disabled={!editMode}
                onChange={(e) => {
                  setWordInfo({
                    ...wordInfo,
                    esExampleSentence: e.target.value,
                  });
                }}
                value={wordInfo.esExampleSentence || ""}
              ></input>
            </div>
          </div>
          <div className={styles.buttons}>
            {!wordInfo.enWord && wordInfo.esWord && (
              <a
                className={styles.button}
                href={`https://translate.google.com/?sl=es&tl=en&text=${encodeURIComponent(
                  wordInfo.esWord
                )}&op=translate`}
                target="_blank"
                style={{ backgroundColor: "#007add" }}
              >
                Translate to English
              </a>
            )}
            <a
              className={styles.button}
              href={`https://www.linguee.com/english-spanish/search?query=${encodeURIComponent(
                wordInfo.esWord
              )}`}
              target="_blank"
              style={{ backgroundColor: "#5500dd" }}
            >
              Open on Linguee
            </a>
          </div>
        </main>
      ) : (
        <div className="loader" style={{ marginTop: "7rem" }}></div>
      )}
    </>
  );
}
