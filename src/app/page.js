"use client";
import { useEffect, useState } from "react";
import styles from "@/app/home.module.css";
import local from "@/app/i18n";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const nav = useRouter();
  const [count, setCount] = useState(1);
  const [words, setWords] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  useEffect(() => {
    fetch("/api/getCount")
      .then((res) => res.text())
      .then((text) => setCount(text));
    fetch("/api/getAll?limit=30")
      .then((res) => res.json())
      .then((json) => setWords(json));
  }, []);
  const searchChange = (e) => {
    setQuery(e.target.value);
    fetch(`/api/search?q=${e.target.value}&ac=true`)
      .then((res) => res.json())
      .then((json) => {
        setResults(json);
      });
  };
  return (
    <>
      <Navbar />
      <main>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <p>{local.t("heroSubtitle")}</p>
            <h2>
              {local.t("moreThan")} <span>{(count - 1).toLocaleString()}</span>{" "}
              {local.t("translatedWords")}
            </h2>
            <div className={styles.heroSearchWrapper}>
              <input
                type="search"
                className={styles.heroSearch}
                placeholder={local.t("searchPlaceholder")}
                onBlur={() => {
                  setTimeout(() => setSearchFocused(false), 150);
                }}
                onFocus={() => setSearchFocused(true)}
                onChange={searchChange}
              ></input>
              {searchFocused && (
                <div className={styles.searchSuggestions}>
                  {results.map((res) => (
                    <div
                      key={res.id}
                      className={styles.suggestion}
                      onClick={() => {
                        nav.push(`/words/${res.id}`);
                      }}
                    >
                      <h3>{res.tzWord}</h3>
                      <p>
                        {res.esWord && (
                          <>
                            <b>ES</b> <span>{res.esWord}</span>
                          </>
                        )}
                        {res.esWord && res.enWord && " | "}
                        {res.enWord && (
                          <>
                            <b>EN</b> <span>{res.enWord}</span>
                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.allWords}>
          <ul>
            {words.map((word) => (
              <li key={word.id}>
                <Link href={`/words/${word.id}`}>{word.tzWord}</Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
