"use server";
import Link from "next/link";
import styles from "./DefinitionCard.module.css";

export default async function DefinitionCard({ wordId, word }) {
  return (
    <Link className={styles.def} href={`/words/${word._id}`}>
      <h3>{word.variants[0]}</h3>
      <div className={styles.translations}>
        <div className={styles.es}>{word.definitions[0].es.translation}</div>
        <div className={styles.en}>{word.definitions[0].en.translation}</div>
      </div>
    </Link>
  );
}
