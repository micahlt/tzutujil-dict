"use client";
import styles from "@/app/home.module.css";
import local from "@/app/i18n";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function Home({ count, words }) {
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
            <SearchBar />
          </div>
        </div>
        <div className={styles.allWords}>
          <p
            style={{
              width: "100%",
              textAlign: "center",
              marginBottom: "2em",
              fontWeight: "bold",
            }}
          >
            {local.t("previewEntryBelow")}
          </p>
          <ul>
            {words.map((word) => (
              <li key={word.id}>
                <Link href={`/words/${word.id}`}>
                  {word.tzWord.replace(/\s+/g, " ").trim()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}
