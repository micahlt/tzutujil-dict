"use client";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
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
import local from "@/app/i18n";

export default function WordClient({ wordId, wordData }) {
  const [wordInfo, setWordInfo] = useState(wordData);
  const [password, setPassword] = useState();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useRouter();
  useEffect(() => {
    setPassword(window.localStorage.getItem("pwd"));
  }, []);
  const saveWord = (e) => {
    e.preventDefault();
    setLoading(true);
    if (wordId == "new") {
      fetch(`/api/word`, {
        method: "PUT",
        body: JSON.stringify(wordInfo),
        headers: {
          "x-pwd": password,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setEditMode(false);
            nav.push(`/words/${json.id}`);
          } else {
            setError({ code: json.code || json.reason });
          }
        });
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
    if (window.confirm(local.t("confirmDelete"))) {
      fetch(`/api/word`, {
        method: "DELETE",
        body: JSON.stringify({ id: wordId != "new" ? wordId : false }),
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
            <a href="#" className={styles.goBack} onClick={() => nav.back()}>
              <ArrowLeft size={24}></ArrowLeft> {local.t("goBack")}
            </a>
            <div className={styles.spacer}></div>
            {password && !editMode && (
              <a
                className={styles.button}
                href="#"
                style={{ backgroundColor: "#c9a70e" }}
                onClick={(e) => {
                  e.preventDefault();
                  setEditMode(true);
                }}
              >
                <Edit2 size={16} />
                {local.t("edit")}
              </a>
            )}
            {password && !editMode && wordId != "new" && (
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
                {local.t("delete")}
              </a>
            )}
            {password && editMode && (
              <>
                {wordId != "new" && (
                  <a
                    className={styles.button}
                    href="#"
                    style={{ backgroundColor: "#c10e0e" }}
                    onClick={(e) => {
                      e.preventDefault();
                      setEditMode(false);
                    }}
                  >
                    <X size={16} />
                    {local.t("cancel")}
                  </a>
                )}
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
                  {wordId == "new"
                    ? local.t("saveWord")
                    : local.t("saveChanges")}
                </a>
              </>
            )}
          </div>
          {error && error.code && (
            <div className={styles.error}>
              <AlertTriangle size={24} />
              <p>
                {local.t("errorRecieved")}: <pre>{error.code}</pre>
              </p>
            </div>
          )}
          <p className={styles.smallTitle}>{local.t("word")}</p>
          <TextareaAutosize
            className={styles.tzWord}
            placeholder={local.t("notProvided")}
            disabled={!editMode}
            onChange={(e) => {
              setWordInfo({ ...wordInfo, tzWord: e.target.value });
            }}
            value={wordInfo.tzWord || ""}
          ></TextareaAutosize>
          <div className={styles.divider}></div>
          <div className={styles.definitionGrid}>
            <div>
              <p className={styles.smallTitle}>
                {local.t("spanishTranslation")}
              </p>
              <TextareaAutosize
                rows={1}
                placeholder={local.t("notProvided")}
                disabled={!editMode}
                onChange={(e) => {
                  setWordInfo({ ...wordInfo, esWord: e.target.value });
                }}
                value={wordInfo.esWord || ""}
              ></TextareaAutosize>
              <p className={styles.smallTitle}>{local.t("tzExample")}</p>
              <TextareaAutosize
                placeholder={local.t("notProvided")}
                disabled={!editMode}
                onChange={(e) => {
                  setWordInfo({
                    ...wordInfo,
                    tzExampleSentence: e.target.value,
                  });
                }}
                value={wordInfo.tzExampleSentence || ""}
              ></TextareaAutosize>
              <p className={styles.smallTitle}>{local.t("enExample")}</p>
              <TextareaAutosize
                placeholder={local.t("notProvided")}
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
              <p className={styles.smallTitle}>
                {local.t("englishTranslation")}
              </p>
              <TextareaAutosize
                rows={1}
                placeholder={local.t("notProvided")}
                disabled={!editMode}
                onChange={(e) => {
                  setWordInfo({ ...wordInfo, enWord: e.target.value });
                }}
                value={wordInfo.enWord || ""}
              ></TextareaAutosize>
              <p className={styles.smallTitle}>{local.t("esExample")}</p>
              <TextareaAutosize
                placeholder={local.t("notProvided")}
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
          {wordInfo.esWord && (
            <div className={styles.buttons}>
              {!wordInfo.enWord && (
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
                {local.t("openOn")} Linguee
              </a>
              <a
                className={styles.button}
                href={`https://www.spanishdict.com/translate/${encodeURIComponent(
                  wordInfo.esWord
                )}`}
                target="_blank"
                style={{ backgroundColor: "#c9710e" }}
              >
                {local.t("openOn")} SpanishDict
              </a>
            </div>
          )}
        </main>
      ) : (
        <div className="loader" style={{ marginTop: "7rem" }}></div>
      )}
    </>
  );
}
