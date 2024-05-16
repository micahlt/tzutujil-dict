"use server";
import LoginClient from "./loginClient";
import { getDict } from "../i18n";

export default async function Login({ params: { lang } }) {
  const locale = await getDict(lang);
  return (
    <>
      <LoginClient locale={locale} />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: `Login | Tz'utujil.org Dictionary`,
    description: `Log in to Tz'utujil.org Dictionary`,
    openGraph: {
      images: [`https://tzdb.micahlindley.com/api/og?word=Login`],
    },
  };
}
