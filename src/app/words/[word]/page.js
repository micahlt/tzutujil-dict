"use server";
import WordClient from "./wordClient";

async function getData(wordId) {
  const res = await fetch(
    `https://tzdb.micahlindley.com/api/word?id=${wordId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Word({ params: { word: wordId } }) {
  const wordData = await getData(wordId);

  return (
    <>
      <WordClient wordId={wordId} wordData={wordData} />
    </>
  );
}

export async function generateMetadata({ params: { word: wordId } }) {
  // read route params
  const wordData = await getData(wordId);

  return {
    title: `${wordData.tzWord} | TzDB`,
    description: `Definition of ${wordData.tzWord} on the world's largest, most comprehensive Tz'utujil dictionary and translator.`,
    openGraph: {
      images: [`https://tzdb.micahlindley.com/api/og?word=${wordData.tzWord}`],
    },
  };
}
