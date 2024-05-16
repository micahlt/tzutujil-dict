"use server";
import { getDict } from "../../i18n";
import WordClient from "./wordClient";

async function getData(wordId) {
  const res = await fetch(
    `https://dictionary.tzutujil.org/api/word?id=${wordId}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return await res.json();
}

async function getSource(sourceId) {
  const res = await fetch(
    `https://dictionary.tzutujil.org/api/source?id=${sourceId}`
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

export async function generateMetadata({ params: { word: wordId, lang } }) {
  const wordData = await getData(wordId);
  const locale = await getDict(lang);

  return {
    title: `${wordData.tzWord} | ${locale.siteName}`,
    description: `${wordData.tzWord} on the world's largest, most comprehensive Tz'utujil dictionary and translator.`,
    openGraph: {
      images: [
        `https://dictionary.tzutujil.org/api/og?word=${wordData.tzWord}&lang=${locale._code}`,
      ],
    },
  };
}
