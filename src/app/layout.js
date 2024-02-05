import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  metadataBase: new URL("https://tzdb.micahlindley.com"),
  title: "TzDB | Tz'utujil Language Database",
  description:
    "The world's largest, most comprehensive Tz'utujil dictionary and translator.",
  keywords:
    "Tzutujil dictionary,Tz'utujil dictionary,Tz'utujil diccionario,Tzutujil diccionario,Guatemala,translate Tzutujil,translate Tz'utujil,Tz'utujil translator,Tzutujil translator,learn Tzutujil,,Tzutujil language,Tzutujil database,Tz'utujil database",
  openGraph: {
    image: ["https://tzdb.micahlindley.com/api/og"],
  },
  image: ["https://tzdb.micahlindley.com/api/og"],
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
