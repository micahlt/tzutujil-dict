"use server";
import { getDict } from "../../i18n";
import NewClient from "./newClient";

export default async function NewWord({ params: { lang } }) {
  const locale = await getDict(lang);
  return (
    <>
      <NewClient locale={locale} />
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
