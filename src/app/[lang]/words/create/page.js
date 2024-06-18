"use server";
import { getSources } from "@/lib/getSources";
import { getDict } from "../../i18n";
import NewClient from "./createClient";

export default async function NewWord({ params: { lang } }) {
  const locale = await getDict(lang);
  const sourceRes = await getSources();
  const sources = JSON.parse(sourceRes);

  return (
    <>
      <NewClient locale={locale} sources={sources} />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: "New Word | TzDB",
    description:
      "Creating a new word on the world's largest, most comprehensive Tz'utujil dictionary and translator.",
  };
}
