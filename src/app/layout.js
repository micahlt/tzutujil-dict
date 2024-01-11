import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TzDB | Tz'utujil Language Database",
  description:
    "The world's largest, most comprehensive Tz'utujil dictionary and translator.",
  keywords:
    "Tzutujil dictionary,Tz'utujil dictionary,Tz'utujil diccionario,Tzutujil diccionario,Guatemala,translate Tzutujil,translate Tz'utujil,Tz'utujil translator,Tzutujil translator,learn Tzutujil,,Tzutujil language,Tzutujil database,Tz'utujil database",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
