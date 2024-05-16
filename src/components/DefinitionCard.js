"use server";
import styles from "./DefinitionCard.module.css";

export default async function DefinitionCard(wordId) {
  const wordFetch = await fetch(
    `https://dictionary.tzutujil.org/api/word?id=${wordId}`
  );
  const wordData = await wordFetch.json();
  return (
    <div className={styles.def}>
      <h2>{wordData.tzWord}</h2>
    </div>
  );
}
