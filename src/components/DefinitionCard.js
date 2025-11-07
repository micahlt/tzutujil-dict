"use server";
import Link from "next/link";
import styles from "./DefinitionCard.module.css";

export default async function DefinitionCard({ wordId, word }) {
  return (
    <Link className={styles.def} href={`/words/${word._id}`}>
      <h3>{word.Spellings.find(s => s.is_primary).spelling}</h3>
      <div className={styles.translations}>
        <div className={styles.es}>{word.Senses.find(s => s.language == "ES").translation}</div>
        <div className={styles.en}>{word.Senses.find(s => s.language == "EN").translation}</div>
      </div>
    </Link>
  );
}
