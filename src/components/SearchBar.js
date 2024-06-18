"use client";
import { useState } from "react";
import { CornerDownLeft } from "react-feather";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";

export default function SearchBar({ locale }) {
  const nav = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const searchChange = (e) => {
    setQuery(e.target.value);
    fetch(`/api/autocomplete?q=${e.target.value}&ac=true`)
      .then((res) => res.json())
      .then((json) => {
        setResults(json);
      });
  };
  return (
    <div className={styles.heroSearchWrapper}>
      <input
        type="search"
        className={styles.heroSearch}
        placeholder={`${locale.searchPlaceholder}...`}
        onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
        onFocus={() => setSearchFocused(true)}
        onChange={searchChange}
        onKeyUp={(e) => {
          if (e.key == "Enter") nav.push(`/search?q=${e.target.value}`);
        }}
      ></input>
      {searchFocused && (
        <div className={styles.searchSuggestions}>
          {results.map((res) => (
            <Link
              href={`/words/${res.id}`}
              key={res.id}
              className={styles.suggestion}
            >
              <h3>{res.variants[0]}</h3>
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
          <div className={styles.suggestion} style={{ textAlign: "center" }}>
            {query.length > 0 ? (
              <>
                {locale.pressEnter}
                <CornerDownLeft size={20} color="white" />
              </>
            ) : (
              <>{locale.startTyping}</>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
