"use server";
import SearchClient from "./searchClient";
import { getDict } from "../i18n";
import { Suspense } from "react";

export default async function Login(props) {
  const params = await props.params;

  const {
    lang
  } = params;

  const locale = await getDict(lang);
  return (
    <>
      <Suspense>
        <SearchClient locale={locale} />
      </Suspense>
    </>
  );
}

export async function generateMetadata(props) {
  const params = await props.params;

  const {
    lang
  } = params;

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
