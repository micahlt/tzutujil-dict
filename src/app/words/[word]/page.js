"use client";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Edit2,
  Loader,
  Save,
  Trash,
  X,
} from "react-feather";
import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";

export default function Word({ params: { word: wordId } }) {
  const [wordInfo, setWordInfo] = useState();
  const [password, setPassword] = useState();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useRouter();
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
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setEditMode(false);
          } else {
            setError({ code: json.code });
          }
          setLoading(false);
        });
    }
  };
  const deleteItem = () => {
    setLoading(true);
    if (
      window.confirm(
        "Are you sure you want to delete this word from the database?"
      )
    ) {
      fetch(`/api/word`, {
        method: "DELETE",
        body: JSON.stringify({ id: wordId }),
        headers: {
          "x-pwd": password,
        },
      }).then((res) => {
        setLoading(false);
        if (res.ok) {
          nav.push("/");
        }
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
            {password && !editMode && (
              <a
                className={styles.button}
                href="#"
                style={{ backgroundColor: "#c9a70e" }}
                onClick={() => setEditMode(true)}
              >
                <Edit2 size={16} />
                Edit
              </a>
            )}
            {password && !editMode && (
              <a
                className={styles.button}
                href="#"
                style={{ backgroundColor: "#c10e0e" }}
                onClick={deleteItem}
              >
                {loading ? (
                  <Loader size={16} className={styles.rotate} />
                ) : (
                  <Trash size={16} />
                )}
                Delete
              </a>
            )}
            {password && editMode && (
              <>
                <a
                  className={styles.button}
                  href="#"
                  style={{ backgroundColor: "#c10e0e" }}
                  onClick={() => setEditMode(false)}
                >
                  <X size={16} />
                  Cancel
                </a>
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
              </>
            )}
          </div>
          {error && error.code && (
            <div className={styles.error}>
              <AlertTriangle size={24} />
              <p>
                Got an error while updating this word: <pre>{error.code}</pre>
              </p>
            </div>
          )}
          <p className={styles.smallTitle}>WORD</p>
          <input
            className={styles.tzWord}
            placeholder="not provided"
            disabled={!editMode}
            onChange={(e) => {
              setWordInfo({ ...wordInfo, tzWord: e.target.value });
            }}
            value={wordInfo.tzWord || ""}
          ></input>
          <div className={styles.divider}></div>
          <div className={styles.definitionGrid}>
            <div>
              <p className={styles.smallTitle}>SPANISH TRANSLATION</p>
              <TextareaAutosize
                rows={1}
                placeholder="not provided"
                disabled={!editMode}
                onChange={(e) => {
                  setWordInfo({ ...wordInfo, esWord: e.target.value });
                }}
                value={wordInfo.esWord || ""}
              ></TextareaAutosize>
              <p className={styles.smallTitle}>TZ'UTUJIL EXAMPLE</p>
              <TextareaAutosize
                placeholder="not provided"
                disabled={!editMode}
                onChange={(e) => {
                  setWordInfo({
                    ...wordInfo,
                    tzExampleSentence: e.target.value,
                  });
                }}
                value={wordInfo.tzExampleSentence || ""}
              ></TextareaAutosize>
              <p className={styles.smallTitle}>ENGLISH EXAMPLE</p>
              <TextareaAutosize
                placeholder="not provided"
                disabled={!editMode}
                onChange={(e) => {
                  setWordInfo({
                    ...wordInfo,
                    enExampleSentence: e.target.value,
                  });
                }}
                value={wordInfo.enExampleSentence || ""}
              ></TextareaAutosize>
            </div>
            <div>
              <p className={styles.smallTitle}>ENGLISH TRANSLATION</p>
              <TextareaAutosize
                rows={1}
                placeholder="not provided"
                disabled={!editMode}
                onChange={(e) => {
                  setWordInfo({ ...wordInfo, enWord: e.target.value });
                }}
                value={wordInfo.enWord || ""}
              ></TextareaAutosize>
              <p className={styles.smallTitle}>SPANISH EXAMPLE</p>
              <TextareaAutosize
                placeholder="not provided"
                disabled={!editMode}
                onChange={(e) => {
                  setWordInfo({
                    ...wordInfo,
                    esExampleSentence: e.target.value,
                  });
                }}
                value={wordInfo.esExampleSentence || ""}
              ></TextareaAutosize>
            </div>
          </div>
          <div className={styles.divider}></div>
          <div>
            <p className={styles.smallTitle}>NOTES</p>
            <TextareaAutosize
              placeholder="no notes yet..."
              className={styles.notes}
              disabled={!editMode}
              onChange={(e) => {
                setWordInfo({
                  ...wordInfo,
                  notes: e.target.value,
                });
              }}
              value={wordInfo.notes || ""}
            ></TextareaAutosize>
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
            <a
              className={styles.button}
              href={`https://www.spanishdict.com/translate/${encodeURIComponent(
                wordInfo.esWord
              )}`}
              target="_blank"
              style={{ backgroundColor: "#c9710e" }}
            >
              Open on SpanishDict
            </a>
          </div>
        </main>
      ) : (
        <div className="loader" style={{ marginTop: "7rem" }}></div>
      )}
    </>
  );
}
