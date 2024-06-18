"use server";
import styles from "@/app/home.module.css";
import Navbar from "@/components/Navbar";
import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getDict } from "./i18n";

async function getData() {
  const client = await clientPromise;
  const db = client.db("tzdb");
  const wordsCollection = db.collection("words");

  const count = await wordsCollection.countDocuments({});

  const words = await wordsCollection.find({}, { limit: 15 }).toArray();

  if (!words || !count) {
    throw new Error("Failed to fetch data");
  }

  return { count, words };
}

export default async function Home({ params: { lang } }) {
  const { count, words } = await getData();

  const locale = await getDict(lang);
  return (
    <>
      <Navbar locale={locale} lang={lang} />

      <main>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <p>{locale.heroSubtitle}</p>
            <h2>
              {locale.moreThan} <span>{(count - 1).toLocaleString()}</span>{" "}
              {locale.translatedWords}
            </h2>
            <SearchBar locale={locale} />
          </div>
        </div>
        <div className={styles.allWords}>
          <p
            style={{
              width: "100%",
              textAlign: "center",
              marginBottom: "2em",
              fontWeight: "bold",
            }}
          >
            {locale.previewEntryBelow}
          </p>
          <ul>
            {words.map((word) => (
              <li key={word._id}>
                <Link href={`/words/${word._id}`}>{word.variants[0]}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.aboutWrapper}>
          <div>
            <h1 style={{ marginBottom: 10 }}>{locale.about}</h1>
            <h2>{locale.aboutHeader}</h2>
            <div className={styles.divider} style={{ marginTop: 20 }}></div>
            <p
              className={styles.about}
              dangerouslySetInnerHTML={{ __html: locale.aboutProject }}
            ></p>
            <p className={styles.about}>{locale.freeUse}</p>
            <div className={styles.divider} style={{ marginTop: 20 }}></div>
            <p className={styles.smallTitle} style={{ opacity: 1 }}>
              {locale.citations}
            </p>
            <p className={styles.citation}>
              Cholb’al Tziij pa Tz’utujil. (2019). Academia de Lenguas Mayas de
              Guatemala.
            </p>
            <p className={styles.citation}>
              kingDragon. (n.d.). Glosario de tz’utujil.
              https://chefsitoernesto.blogspot.com/2019/06/glosario-de-tzutujil.html
            </p>
            <p className={styles.citation}>
              NEOLOGISMO TZ’UTUJIL CREADO POR GASPAR, ENCARGADO DE TRADUCCION.
              (n.d.).
              https://www.almg.org.gt/wp-content/uploads/2020/10/NEOLOGISMO-TZ_UTUJIL.pdf
            </p>
            <p className={styles.citation}>
              OpenAI. (2024). ChatGPT (Jan 10 version) [Large language model].
              https://chat.openai.com
            </p>
            <p className={styles.citation}>
              Sonia_Lorainos. (n.d.). Palabras básicas en tz’utujil. Scribd.
              https://es.scribd.com/document/412504778/Palabras-basicas-en-tz-utujil
            </p>
            <p className={styles.citation}>
              Tz’utujil/Spanish/English — Vocabulary and Basic Phrases —.
              (n.d.).
            </p>
            <p className={styles.citation}>
              Wyner, G. (2023, August 21). The Most Awesome Word List You Have
              Ever Seen. Fluent Forever.
              https://method.fluent-forever.com/base-vocabulary-list/
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export async function generateMetadata({ params: { lang } }) {
  const locale = await getDict(lang);
  return {
    title: locale.siteName,
    description: `${locale.tagline}.`,
    openGraph: {
      images: [`https://dictionary.tzutujil.org/api/og&lang=${locale._code}`],
    },
  };
}
