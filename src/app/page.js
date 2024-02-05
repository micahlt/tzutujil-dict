"use server";
import HomeClient from "./homeClient";

async function getData(wordId) {
  const countRes = await fetch(
    `https://tzdb.micahlindley.com/api/getCount?id=${wordId}`
  );

  const wordsRes = await fetch(
    `https://tzdb.micahlindley.com/api/getAll?limit=15`
  );

  if (!countRes.ok || !wordsRes.ok) {
    throw new Error("Failed to fetch data");
  }

  const count = await countRes.json();
  const words = await wordsRes.json();
  return { count, words };
}

export default async function Home() {
  const { count, words } = await getData();

  return (
    <>
      <HomeClient count={count} words={words} />
    </>
  );
}

export async function generateMetadata() {
  return {
    title: `TzDB | Tz'utujil Language Database`,
    description: `The world's largest, most comprehensive Tz'utujil dictionary and translator.`,
    openGraph: {
      images: [`https://tzdb.micahlindley.com/api/og`],
    },
  };
}
