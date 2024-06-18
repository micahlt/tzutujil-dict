"use client";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { useRouter } from "next/navigation";
import WordRow from "@/components/WordRow";
import { AlertTriangle } from "react-feather";

export default function NewClient({ locale, sources }) {
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [words, setWords] = useState([]);
  const [defaultSource, setDefaultSource] = useState(sources[0]._id);
  const nav = useRouter();
  useEffect(() => {
    setPassword(window.localStorage.getItem("pwd"));
  }, []);
  const saveWord = (id, word) => {
    setLoading(true);
    if (id == "new") {
      fetch(`/api/word`, {
        method: "PUT",
        body: JSON.stringify(word),
        headers: {
          "x-pwd": password,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setError(null);
            setWords([...words, { ...word, _id: json.id }]);
          } else {
            setError({ code: json.error, url: json.url });
          }
          setLoading(false);
        });
    } else {
      fetch(`/api/word`, {
        method: "PATCH",
        body: JSON.stringify({ ...word, _id: id }),
        headers: {
          "x-pwd": password,
        },
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.success) {
            setError(null);
            const i = words.findIndex((w) => w._id == id);
            const newWords = [...words];
            newWords[i] = json.word;
            setWords(newWords);
          } else {
            setError({ code: json.error, url: json.url });
          }
          setLoading(false);
        });
    }
  };
  return (
    <>
      <Navbar locale={locale} />
      <main className={styles.main}>
        <div className={styles.headerFlex}>
          <a href="#" className={styles.goBack} onClick={() => nav.back()}>
            <ArrowLeft size={24}></ArrowLeft> {locale.goBack}
          </a>
          <div className={styles.spacer}></div>
          <p
            style={{
              opacity: 0.6,
              fontSize: "0.8em",
              marginTop: "0.4em",
              marginRight: "0.5em",
            }}
          >
            Default Source
          </p>
          <select
            className={styles.sourcePicker}
            value={defaultSource}
            onChange={(e) => setDefaultSource(e.target.value)}
          >
            {sources.map((opt) => (
              <option value={opt._id} key={opt._id}>
                {opt.name}
              </option>
            ))}
          </select>
        </div>
        {error && error.code && (
          <div className={styles.error}>
            <AlertTriangle size={24} />
            <p>
              {locale.errorRecieved}: <pre>{error.code}</pre>
              <br />
              <a href={error.url} target="_blank">
                More information here.
              </a>
            </p>
          </div>
        )}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Spelling(s)</th>
              <th>ES Definition(s)</th>
              <th>EN Definition(s)</th>
              <th>Part of Speech</th>
              <th>Source</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {words.map((w) => (
              <WordRow
                key={w._id}
                onSave={(word, wordId) => saveWord(wordId, word)}
                wordObj={w}
                wordId={w._id}
                sourceOpts={sources}
                locale={locale}
              />
            ))}
            {!loading && (
              <WordRow
                onSave={(word, wordId) => saveWord(wordId, word)}
                sourceOpts={sources}
                defaultSource={defaultSource}
                locale={locale}
              />
            )}
          </tbody>
        </table>
        {loading && (
          <div className="loader" style={{ marginTop: "7rem" }}></div>
        )}
      </main>
      <div className={styles.main} style={{ marginTop: 0 }}>
        <h2 style={{ color: "#00f0a0", marginBottom: "0.5em" }}>How to use</h2>
        <p>
          Use the <b>Tab</b> key to progress move to the next field, and the{" "}
          <b>Enter</b> key to add new spellings or definitions. When you're
          ready to save, press <b>Ctrl + Enter</b>. This view is designed to
          enable fast word entry in bulk. For more detailed editing, use
          individual word pages that can be found at their links in the
          rightmost column.
        </p>
      </div>
    </>
  );
}
