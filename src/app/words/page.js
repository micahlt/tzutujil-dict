"use server";
import WordsClient from "./wordsClient";

export default async function Word() {
  return (
    <>
      <WordsClient />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: `Words | TzDB`,
    description: `Complete word list on the world's largest, most comprehensive Tz'utujil dictionary and translator.`,
    openGraph: {
      images: [`https://tzdb.micahlindley.com/api/og?word=Word%20List`],
    },
  };
}
