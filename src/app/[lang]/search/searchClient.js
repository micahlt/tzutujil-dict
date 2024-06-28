"use client";
import { ArrowLeft } from "react-feather";
import "@/lib/types";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PartOfSpeechBadge from "@/components/PartOfSpeechBadge";

export default function SearchClient({ locale }) {
  const searchParams = useSearchParams();
  const [loadState, setLoadState] = useState("loading");
  const [results, setResults] = useState(/** @type {Word[]} */ ([]));
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
      <Navbar locale={locale} />
      <main className={styles.main}>
        <Link href="/" className={styles.goBack}>
          <ArrowLeft size={24}></ArrowLeft> {locale.goBack}
        </Link>
        <div>
          <h1>{locale.searchResults}</h1>
          {query && (
            <p style={{ opacity: 0.8 }}>
              {locale.for} <b>{query}</b>
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
                <div className={styles.headingWrapper}>
                  <h3>{res.variants.map((v) => v).join(", ")}</h3>
                  <PartOfSpeechBadge
                    partCode={res.part}
                    locale={locale._code}
                    context="search"
                  />
                </div>
                <p>
                  {res.definitions[0]?.es?.translation && (
                    <>
                      <b>ES</b> <span>{res.definitions[0].es.translation}</span>
                    </>
                  )}
                  {res.definitions[0]?.es?.translation &&
                    res.definitions[0]?.en?.translation &&
                    " | "}
                  {res.definitions[0]?.en?.translation && (
                    <>
                      <b>EN</b> <span>{res.definitions[0].en.translation}</span>
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
