"use client";
import { ArrowLeft } from "react-feather";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import local from "@/app/[lang]/i18n";
import { useEffect, useState } from "react";

export default function Search() {
  const searchParams = useSearchParams();
  const [loadState, setLoadState] = useState("loading");
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const localQuery = searchParams.get("q");
    if (localQuery) {
      setQuery(localQuery);
      fetch(`/api/search?q=${localQuery}`)
        .then((res) => res.json())
        .then((json) => {
          setResults(json);
          setLoadState("loaded");
        });
    }
  }, [searchParams]);
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Link href="/" className={styles.goBack}>
          <ArrowLeft size={24}></ArrowLeft> {local.t("goBack")}
        </Link>
        <div>
          <h1>{local.t("searchResults")}</h1>
          {query && (
            <p style={{ opacity: 0.8 }}>
              {local.t("for")} <b>{query}</b>
            </p>
          )}
          <div
            className={styles.divider}
            style={{ marginTop: 20, marginBottom: 0 }}
          ></div>
          <div className={styles.searchResults}>
            {results.map((res) => (
              <Link
                href={`/words/${res.id}`}
                key={res.id}
                className={styles.result}
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
              </Link>
            ))}
          </div>
          {loadState == "loaded" && results.length < 1 && (
            <p>No words found.</p>
          )}
          {loadState == "loading" && <div className="loader"></div>}
        </div>
      </main>
    </>
  );
}
