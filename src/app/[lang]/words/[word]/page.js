"use server";
import { getWord } from "@/lib/getWord";
import { getSource } from "@/lib/getSource";
import { getDict } from "../../i18n";
import WordClient from "./wordClient";
import { notFound } from "next/navigation";

async function getData(wordIdOrPrimaryVariant) {
  try {
    const res = getWord(wordIdOrPrimaryVariant);
    if (!res) {
      notFound();
    }
    return res;
  } catch (err) {
    notFound();
  }
}

export default async function Word({
  params: { word: wordIdOrPrimaryVariant, lang },
}) {
  const locale = await getDict(lang);
  const wordData = await getData(wordIdOrPrimaryVariant);
  const source =
    wordData?.source_id != null
      ? await JSON.parse(await getSource(wordData.source_id))
      : null;

  return (
    <>
      <WordClient
        wordId={wordIdOrPrimaryVariant}
        wordData={wordData}
        source={source || null}
        locale={locale}
        defaultView={wordIdOrPrimaryVariant == "new" ? "new" : "view"}
      />
    </>
  );
}

export async function generateMetadata({
  params: { word: wordIdOrPrimaryVariant, lang },
}) {
  const wordData = await getData(wordIdOrPrimaryVariant);
  const locale = await getDict(lang);

  return {
    title: `${wordData.Spellings[0].spelling} | ${locale.siteName}`,
    description: `${wordData.Spellings[0]} on the world's largest, most comprehensive Tz'utujil dictionary and translator.`,
    openGraph: {
      images: [
        `https://dictionary.tzutujil.org/api/og?word=${wordData.Spellings[0]}&lang=${locale._code}`,
      ],
    },
  };
}
