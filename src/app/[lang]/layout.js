import { Inter } from "next/font/google";
import "../globals.css";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://tzdb.micahlindley.com"),
  title: "TzDB | Tz'utujil Language Database",

  description:
    "The world's largest, most comprehensive Tz'utujil dictionary and translator.",

  keywords:
    "Tzutujil dictionary,Tz'utujil dictionary,Tz'utujil diccionario,Tzutujil diccionario,Guatemala,translate Tzutujil,translate Tz'utujil,Tz'utujil translator,Tzutujil translator,learn Tzutujil,,Tzutujil language,Tzutujil database,Tz'utujil database",

  openGraph: {
    images: ["https://tzdb.micahlindley.com/api/og"],
  },

  images: ["https://tzdb.micahlindley.com/api/og"],

  twitter: {
    card: "summary_large_image",
    title: "TzDB | Tz'utujil Language Database",
    description:
      "The world's largest, most comprehensive Tz'utujil dictionary and translator.",
    siteId: "1561359226819198976",
    creator: "@micahtlindley",
    creatorId: "1561359226819198976",
    images: ["https://tzdb.micahlindley.com/api/og"], // Must be an absolute URL
  },
};

export default function RootLayout({ children, params }) {
  return (
    <html lang={params.lang}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
