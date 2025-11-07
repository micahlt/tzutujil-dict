"use client";
import { useState, useEffect } from "react";
import { CornerDownLeft } from "react-feather";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";

export default function SearchBar({ locale }) {
  const nav = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [debounceTimer, setDebounceTimer] = useState(null);

  const searchChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for 300ms delay
    const newTimer = setTimeout(() => {
      if (value.trim()) {
        fetch(`/api/search?q=${value}&limit=5`)
          .then((res) => res.json())
          .then((json) => {
            setResults(json);
          });
      } else {
        setResults([]);
      }
    }, 500);

    setDebounceTimer(newTimer);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

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
              href={`/words/${res.word_id}`}
              key={res.word_id}
              className={styles.suggestion}
            >
              <h3>{res.spelling}</h3>
              <p>
                {res.sense_es && (
                  <>
                    <b>ES</b> <span>{res.sense_es}</span>
                  </>
                )}
                {res.sense_es &&
                  res.sense_en &&
                  " | "}
                {res.sense_en && (
                  <>
                    <b>EN</b> <span>{res.sense_en}</span>
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
