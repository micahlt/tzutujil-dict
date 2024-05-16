"use server";
import { getDict } from "../../i18n";
import WordClient from "./wordClient";

async function getData(wordId) {
  const res = await fetch(
    `https://tzdb.micahlindley.com/api/word?id=${wordId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return await res.json();
}

async function getSource(sourceId) {
  const res = await fetch(
    `https://tzdb.micahlindley.com/api/source?id=${sourceId}`
  );

  return await res.json();
}

export default async function Word({ params: { word: wordId, lang } }) {
  const locale = await getDict(lang);
  const wordData = await getData(wordId);
  const source =
    wordData.sourceId != null ? await getSource(wordData.sourceId) : null;

  return (
    <>
      <WordClient
        wordId={wordId}
        wordData={wordData}
        source={source || null}
        locale={locale}
      />
    </>
  );
}

export async function generateMetadata({ params: { word: wordId } }) {
  // read route params
  const wordData = await getData(wordId);

  return {
    title: `${wordData.tzWord} | Tz'utujil.org Dictionary`,
    description: `Definition of ${wordData.tzWord} on the world's largest, most comprehensive Tz'utujil dictionary and translator.`,
    openGraph: {
      images: [`https://tzdb.micahlindley.com/api/og?word=${wordData.tzWord}`],
    },
  };
}
