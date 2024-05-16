"use server";
import WordsClient from "./wordsClient";
import { getDict } from "../i18n";

export default async function Word({ params: { lang } }) {
  const locale = await getDict(lang);
  return (
    <>
      <WordsClient locale={locale} />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: `Words | Tz'utujil.org Dictionary`,
    description: `Complete word list on the world's largest, most comprehensive Tz'utujil dictionary and translator.`,
    openGraph: {
      images: [`https://dictionary.tzutujil.org/api/og?word=Word%20List`],
    },
  };
}
