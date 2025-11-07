"use server";
import { Suspense } from "react";
import WordsClient from "./wordsClient";
import { getDict } from "../i18n";
import { getSources } from "@/lib/getSources";

export default async function Word(props) {
  const params = await props.params;

  const {
    lang
  } = params;

  const locale = await getDict(lang);
  const sources = await getSources();
  return (
    <Suspense>
      <WordsClient locale={locale} sources={sources} />
    </Suspense>
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
