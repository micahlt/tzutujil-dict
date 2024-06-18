"use client";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Edit2,
  ExternalLink,
  Loader,
  Save,
  Trash,
  X,
} from "react-feather";
import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import PartOfSpeechBadge from "@/components/PartOfSpeechBadge";
import { PARTS_COLORS, PARTS_OF_SPEECH } from "@/lib/partsOfSpeech";

export default function WordClient({ wordId, wordData, source, locale }) {
  const [spellings, setSpellings] = useState(
    wordData.variants.map((spelling) => spelling).join(", ")
  );
  const [wordInfo, setWordInfo] = useState(wordData);
  const [password, setPassword] = useState();
  const [editMode, setEditMode] = useState(false);
  const [sources, setSources] = useState([]);
  const [tab, setTab] = useState(locale._code);
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
            setError({ code: json.code || json.error });
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
            nav.refresh();
          } else {
            setError({ code: json.code });
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

  const handleDefChange = (locale, property, index, event) => {
    const newDefs = [...wordInfo.definitions];
    newDefs[index][locale][property] = event.target.value;
    setWordInfo({ ...wordInfo, definitions: newDefs });
  };

  return (
    <>
      <Navbar locale={locale} />
      {wordInfo ? (
        <main className={styles.main}>
          <div className={styles.headerFlex}>
            <a href="#" className={styles.goBack} onClick={() => nav.back()}>
              <ArrowLeft size={24}></ArrowLeft> {locale.goBack}
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
                        wordData.variants.map((spelling) => spelling).join(", ")
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
                {locale.errorRecieved}: <pre>{error.code}</pre>
              </p>
            </div>
          )}
          <p className={styles.smallTitle}>{locale.word}</p>
          <TextareaAutosize
            className={styles.tzWord}
            placeholder={locale.notProvided}
            disabled={!editMode}
            onChange={(e) => setSpellings(e.target.value)}
            value={spellings}
            onBlur={() =>
              setWordInfo({
                ...wordInfo,
                variants: spellings.split(",").map((v) => v.trim()),
              })
            }
          ></TextareaAutosize>
          <div style={{ display: "flex", alignItems: "center" }}>
            {editMode ? (
              <>
                <br />
                <select
                  className={styles.speechPartPicker}
                  style={{ backgroundColor: PARTS_COLORS[wordInfo.part] }}
                  value={wordInfo.part}
                  onChange={(e) => {
                    setWordInfo({ ...wordInfo, part: Number(e.target.value) });
                  }}
                >
                  {Object.keys(PARTS_OF_SPEECH).map((key, i) => (
                    <option key={i} value={key}>
                      {PARTS_OF_SPEECH[key][locale._code]}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                {(!!wordInfo.part || wordInfo.part == 0) && (
                  <PartOfSpeechBadge
                    partCode={wordInfo.part}
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
              aria-expanded={tab == "en"}
              role="button"
              onClick={() => setTab("en")}
            >
              {locale.english}
            </div>
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
              aria-expanded={tab == "tz"}
              role="button"
              onClick={() => setTab("tz")}
            >
              Tz'utujil
            </div>
          </div>
          <div className={styles.tabContent}>
            {tab == "en" &&
              wordInfo.definitions.map((def, i) =>
                def.en ? (
                  <div className={styles.definition} key={i}>
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
                          value={def.en.translation || ""}
                        ></TextareaAutosize>
                      </div>
                      <div className={styles.defFlexChild}>
                        <p className={styles.smallTitle}>{locale.enExample}</p>
                        <TextareaAutosize
                          placeholder={locale.notProvided}
                          disabled={!editMode}
                          onChange={(e) =>
                            handleDefChange("en", "example", i, e)
                          }
                          value={def.en.example || ""}
                        ></TextareaAutosize>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              )}
            {tab == "es" &&
              wordInfo.definitions.map((def, i) =>
                def.en ? (
                  <div className={styles.definition} key={i}>
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
                          value={def.es.translation || ""}
                        ></TextareaAutosize>
                      </div>
                      <div className={styles.defFlexChild}>
                        <p className={styles.smallTitle}>{locale.esExample}</p>
                        <TextareaAutosize
                          placeholder={locale.notProvided}
                          disabled={!editMode}
                          onChange={(e) =>
                            handleDefChange("es", "example", i, e)
                          }
                          value={def.es.example || ""}
                        ></TextareaAutosize>
                      </div>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              )}
            {tab == "tz" &&
              wordInfo.definitions.map((def, i) =>
                def.en ? (
                  <div className={styles.definition} key={i}>
                    <p className={styles.defNumber}>{i + 1}</p>
                    <div>
                      <p className={styles.smallTitle}>{locale.tzExample}</p>
                      <TextareaAutosize
                        placeholder={locale.notProvided}
                        disabled={!editMode}
                        onChange={(e) => handleDefChange("es", "example", i, e)}
                        value={def.tz.example || ""}
                        style={{ width: "100%" }}
                      ></TextareaAutosize>
                    </div>
                  </div>
                ) : (
                  <></>
                )
              )}
          </div>

          <div className={styles.card}>
            <div className={styles.definitionGrid}>
              {wordInfo?.related?.length > 0 && (
                <div>
                  <p className={styles.smallTitle}>See Also</p>
                  <h3>
                    {wordInfo?.related?.map((w, i) => `${w}`)?.join(", ") || ""}
                  </h3>
                </div>
              )}
              <div>
                <p className={styles.smallTitle}>{locale.wordId}</p>
                <h3>{wordInfo._id}</h3>
              </div>
              <div>
                <p className={styles.smallTitle}>{locale.source}</p>
                {editMode ? (
                  <select
                    className={styles.sourcePicker}
                    value={wordInfo.sourceId}
                    onChange={(e) => {
                      setWordInfo({
                        ...wordInfo,
                        sourceId: e.target.value,
                      });
                    }}
                  >
                    {sources.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <h3>
                    <a
                      href={source?.url || null}
                      className={styles.source}
                      target="_blank"
                      title="Open this source in a new tab"
                    >
                      {source?.name || locale.unknownSource}
                      <ExternalLink size={16} />
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
