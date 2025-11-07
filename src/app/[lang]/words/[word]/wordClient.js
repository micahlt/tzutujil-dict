"use client";

/**
 * @typedef { import("@prisma/client").Words } Word
 * @typedef { import("@prisma/client").Sources } Source
 * @typedef { import("@prisma/client").Senses } Sense
 * @typedef { import("@prisma/client").Examples } Example
 */

import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Edit2,
  ExternalLink,
  Loader,
  Plus,
  Save,
  Trash,
  X,
} from "react-feather";
import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import PartOfSpeechBadge from "@/components/PartOfSpeechBadge";
import { PARTS_COLORS, PARTS_OF_SPEECH } from "@/lib/partsOfSpeech";
import Link from "next/link";
import React from "react";

export default function WordClient({
  wordId,
  wordData,
  source,
  locale,
  defaultView = "view",
}) {
  const [spellings, setSpellings] = useState(
    wordData.Spellings?.map((s) => s.spelling).join(", ") || ""
  );

  /**
 * @type {ReturnType<typeof useState<Word>>}
 */
  const [wordInfo, setWordInfo] = useState(wordData);
  console.log(wordInfo);
  const [password, setPassword] = useState();
  const [editMode, setEditMode] = useState(defaultView == "new");
  /**
 * @type {ReturnType<typeof useState<Source[]>>}
 */
  const [sources, setSources] = useState([]);
  const [tab, setTab] = useState(
    wordData?.Senses?.find(s => s.language === "EN")?.translation
      ? locale._code
      : "es"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nav = useRouter();
  useEffect(() => {
    setPassword(window.localStorage.getItem("pwd"));
  }, []);
  useEffect(() => {
    if (editMode && sources.length == 0) {
      fetch(`/api/getAll?type=sources`)
        .then((res) => res.json())
        .then((json) => setSources(json))
        .catch((err) => {
          setError({
            code: err.code || err.reason || "Failed to fetch sources",
          });
        });
    }
  }, [editMode]);

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
            setError({ code: json.error || json.code, existing_id: json.existing_id });
          }
          setLoading(false);
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
            nav.refresh();
          } else {
            setError({ code: json.error, existing_id: json.existing_id });
          }
          setLoading(false);
        });
    }
  };

  const deleteItem = () => {
    setLoading(true);
    if (window.confirm(locale.confirmDelete)) {
      fetch(`/api/word`, {
        method: "DELETE",
        body: JSON.stringify({
          id: wordId.length == 36 ? wordId : wordInfo.id,
        }),
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

  const handleDefChange = (locale, property, index, event) => {
    if (property === "translation") {
      // Handle sense translation changes
      const newSenses = [...wordInfo.Senses];
      const senseIndex = newSenses.findIndex(s => s.language === locale.toUpperCase());
      if (senseIndex >= 0) {
        newSenses[senseIndex].translation = event.target.value;
        setWordInfo({ ...wordInfo, Senses: newSenses });
      }
    }
  };

  const handleExampleChange = (languageCode, index, event) => {
    const newExamples = [...wordInfo.Examples];
    const fieldName = `text_${languageCode.toLowerCase()}`;
    if (newExamples[index]) {
      newExamples[index][fieldName] = event.target.value;
      setWordInfo({ ...wordInfo, Examples: newExamples });
    }
  };

  const addNewSense = (language) => {
    const newSense = {
      id: Math.random(), // temporary ID for new senses
      word_id: wordInfo.id,
      translation: "",
      language: language
    };
    setWordInfo({
      ...wordInfo,
      Senses: [...wordInfo.Senses, newSense]
    });
  };

  const addNewExample = () => {
    const newExample = {
      id: Math.random(), // temporary ID for new examples
      word_id: wordInfo.id,
      text_tz: "",
      text_es: "",
      text_en: ""
    };
    setWordInfo({
      ...wordInfo,
      Examples: [...wordInfo.Examples, newExample]
    });
  };

  if (!window) {
    return null;
  }

  return (
    <>
      <Navbar locale={locale} />
      {wordInfo ? (
        <main className={styles.main}>
          <div className={styles.headerFlex}>
            <Link href={window.localStorage.getItem("previous") || "/"} onClick={() => window.localStorage.removeItem("previous")} className={styles.goBack}>
              <ArrowLeft size={24}></ArrowLeft> {window.localStorage.getItem("previous") ? locale.goBack : locale.goHome}
            </Link>
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
                {locale.edit}
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
                {locale.delete}
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
                      setWordInfo(wordData);
                      setSpellings(
                        wordData.Spellings.map((spelling) => spelling.spelling).join(", ")
                      );
                      setEditMode(false);
                    }}
                  >
                    <X size={16} />
                    {locale.cancel}
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
                  {wordId == "new" ? locale.saveWord : locale.saveChanges}
                </a>
              </>
            )}
          </div>
          {error && error.code && (
            <div className={styles.error}>
              <AlertTriangle size={24} />
              <p>
                {locale.errorRecieved}: <pre>{error.code}</pre> {error.existing_id ? <Link href={`/words/${error.existing_id}`}>{error.existing_id}</Link> : <></>}
              </p>
            </div>
          )}
          <p className={styles.smallTitle}>{locale.word}</p>
          <TextareaAutosize
            className={styles.tzWord}
            placeholder={locale.notProvided}
            disabled={!editMode}
            onChange={(e) => setSpellings(e.target.value)}
            value={
              spellings.length > 0
                ? spellings[0].toUpperCase() + spellings.slice(1)
                : ""
            }
            onBlur={() => {
              const spellingsArray = (spellings[0].toLowerCase() + spellings.slice(1))
                .split(",")
                .map((v) => v.trim());

              const newSpellings = spellingsArray.map((spelling, index) => ({
                spelling: spelling,
                is_primary: index === 0
              }));

              setWordInfo({
                ...wordInfo,
                Spellings: newSpellings
              });
              console.log("WORDINFO UPDATE", wordInfo)
            }}
          ></TextareaAutosize>
          <div style={{ display: "flex", alignItems: "center" }}>
            {editMode ? (
              <>
                <br />
                <select
                  className={styles.speechPartPicker}
                  style={{ backgroundColor: PARTS_COLORS[wordInfo.part_of_speech] }}
                  value={wordInfo.part_of_speech}
                  onChange={(e) => {
                    setWordInfo({ ...wordInfo, part_of_speech: e.target.value });
                  }}
                >
                  <option value={0} style={{ color: "gray" }}>
                    {locale.select}
                  </option>
                  <optgroup label={locale.options}>
                    {Object.keys(PARTS_OF_SPEECH).map((key, i) => (
                      <option
                        key={i}
                        value={PARTS_OF_SPEECH[key].en}
                        style={{ backgroundColor: PARTS_COLORS[key] }}
                      >
                        {PARTS_OF_SPEECH[key][locale._code]}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </>
            ) : (
              <>
                {!!wordInfo.part_of_speech && (
                  <PartOfSpeechBadge
                    partCode={wordInfo.part_of_speech}
                    locale={locale._code}
                  />
                )}
              </>
            )}
            {false && <input type="text"></input>}
          </div>
          <div className={styles.tabs}>
            <div
              className={styles.tab}
              aria-expanded={tab == "es"}
              role="button"
              onClick={() => setTab("es")}
            >
              {locale.spanish}
            </div>
            <div
              className={styles.tab}
              aria-expanded={tab == "en"}
              role="button"
              onClick={() => setTab("en")}
            >
              {locale.english}
            </div>
            <div
              className={styles.tab}
              aria-expanded={tab == "examples"}
              role="button"
              onClick={() => setTab("examples")}
            >
              {locale.examples}
            </div>
          </div>
          <div className={styles.tabContent}>
            {tab == "en" &&
              wordInfo.Senses
                .filter(s => s.language == "EN")
                .map((/** @type {Sense} */ sense, i) =>
                  <React.Fragment key={i}>

                    <div className={styles.definition}>
                      <p className={styles.defNumber}>{i + 1}</p>
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        <div className={styles.defFlexChild}>
                          <p className={styles.smallTitle}>
                            {locale.englishTranslation}
                          </p>
                          <TextareaAutosize
                            rows={1}
                            placeholder={locale.notProvided}
                            disabled={!editMode}
                            onChange={(e) =>
                              handleDefChange("en", "translation", i, e)
                            }
                            value={sense.translation || ""}
                          ></TextareaAutosize>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )}
            {tab == "es" &&
              wordInfo.Senses
                .filter(s => s.language == "ES")
                .map((/** @type {Sense} */ sense, i) =>
                  <React.Fragment key={i}>
                    <div className={styles.definition}>
                      <p className={styles.defNumber}>{i + 1}</p>
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        <div className={styles.defFlexChild}>
                          <p className={styles.smallTitle}>
                            {locale.spanishTranslation}
                          </p>
                          <TextareaAutosize
                            rows={1}
                            placeholder={locale.notProvided}
                            disabled={!editMode}
                            onChange={(e) =>
                              handleDefChange("es", "translation", i, e)
                            }
                            value={sense.translation || ""}
                          ></TextareaAutosize>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )}
            {tab == "examples" &&
              wordInfo.Examples
                .map((/** @type {Example} */ ex, i) =>
                  <React.Fragment key={i}>
                    <div className={styles.definition}>
                      <p className={styles.defNumber}>{i + 1}</p>
                      <div>
                        <p className={styles.smallTitle}>{locale.tzExample}</p>
                        <TextareaAutosize
                          placeholder={locale.notProvided}
                          disabled={!editMode}
                          onChange={(e) => handleExampleChange("tz", i, e)}
                          value={ex.text_tz || ""}
                          style={{ width: "100%" }}
                        ></TextareaAutosize>
                      </div>
                      <div>
                        <p className={styles.smallTitle}>{locale.esExample}</p>
                        <TextareaAutosize
                          placeholder={locale.notProvided}
                          disabled={!editMode}
                          onChange={(e) => handleExampleChange("es", i, e)}
                          value={ex.text_es || ""}
                          style={{ width: "100%" }}
                        ></TextareaAutosize>
                      </div>
                      <div>
                        <p className={styles.smallTitle}>{locale.enExample}</p>
                        <TextareaAutosize
                          placeholder={locale.notProvided}
                          disabled={!editMode}
                          onChange={(e) => handleExampleChange("en", i, e)}
                          value={ex.text_en || ""}
                          style={{ width: "100%" }}
                        ></TextareaAutosize>
                      </div>
                    </div>
                  </React.Fragment>
                )}
            {editMode && tab === "en" && <a className={styles.button} href="#" style={{ width: "max-content", marginTop: 10, backgroundColor: "rgb(0, 146, 98)" }} onClick={(e) => {
              e.preventDefault();
              addNewSense("EN");
            }}><Plus size={16} />Add English translation</a>}
            {editMode && tab === "es" && <a className={styles.button} href="#" style={{ width: "max-content", marginTop: 10, backgroundColor: "rgb(0, 146, 98)" }} onClick={(e) => {
              e.preventDefault();
              addNewSense("ES");
            }}><Plus size={16} />Add Spanish translation</a>}
            {editMode && tab === "examples" && <a className={styles.button} href="#" style={{ width: "max-content", marginTop: 10, backgroundColor: "rgb(0, 146, 98)" }} onClick={(e) => {
              e.preventDefault();
              addNewExample();
            }}><Plus size={16} />Add example</a>}
          </div>

          <div className={styles.card}>
            <div className={styles.definitionGrid}>
              {wordInfo?.related?.length > 0 && (
                <div>
                  <p className={styles.smallTitle}>{locale.seeAlso}</p>
                  <h3>
                    {wordInfo?.related?.map((w, i) => `${w}`)?.join(", ") || ""}
                  </h3>
                </div>
              )}
              <div>
                <p className={styles.smallTitle}>{locale.wordId}</p>
                <h3>{wordInfo.id}</h3>
              </div>
              {wordId != "new" && (
                <div>
                  <p className={styles.smallTitle}>{locale.lastModified}</p>
                  <h3>
                    {new Date(wordInfo.last_modified).toLocaleString(undefined, {
                      month: "numeric",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </h3>
                </div>
              )}
              <div>
                <p className={styles.smallTitle}>{locale.source}</p>
                {editMode ? (
                  <select
                    className={styles.sourcePicker}
                    value={wordInfo.source_id}
                    onChange={(e) => {
                      setWordInfo({
                        ...wordInfo,
                        source_id: e.target.value,
                      });
                    }}
                  >
                    <option style={{ color: "gray" }} value="unset">
                      - {locale.selectSource} -
                    </option>
                    <optgroup label="Sources">
                      {sources.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                ) : (
                  <h3>
                    <a
                      href={`/sources/${source?.id}`}
                      className={styles.source}
                      target="_blank"
                      title="Open this source in a new tab"
                    >
                      {source?.name || locale.unknownSource}
                      {source?.name && <ExternalLink size={16} />}
                    </a>
                  </h3>
                )}
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <p className={styles.smallTitle}>{locale.notes}</p>
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
                {locale.openOn} Linguee
              </a>
              <a
                className={styles.button}
                href={`https://www.spanishdict.com/translate/${encodeURIComponent(
                  wordInfo.esWord
                )}`}
                target="_blank"
                style={{ backgroundColor: "#c9710e" }}
              >
                {locale.openOn} SpanishDict
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
