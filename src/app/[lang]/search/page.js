"use server";
import SearchClient from "./searchClient";
import { getDict } from "../i18n";
import { Suspense } from "react";

export default async function Login({ params: { lang } }) {
  const locale = await getDict(lang);
  return (
    <>
      <Suspense>
        <SearchClient locale={locale} />
      </Suspense>
    </>
  );
}

export async function generateMetadata({ params: { lang } }) {
  const locale = await getDict(lang);
  return {
    title: `${locale.search} | ${locale.siteName}`,
    description: locale.searchPlaceholder,
    openGraph: {
      images: [
        `https://dictionary.tzutujil.org/api/og?word=${encodeURIComponent(
          locale.search
        )}&lang=${locale._code}`,
      ],
    },
  };
}
