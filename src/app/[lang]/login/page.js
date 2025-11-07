"use server";
import LoginClient from "./loginClient";
import { getDict } from "../i18n";

export default async function Login(props) {
  const params = await props.params;

  const {
    lang
  } = params;

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
      images: [`https://dictionary.tzutujil.org/api/og?word=Login`],
    },
  };
}
