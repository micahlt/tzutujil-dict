"use client";
import styles from "@/app/home.module.css";
import local from "@/app/i18n";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { useEffect, useState } from "react";

export default function Home({ count, words }) {
  const [warning, setWarning] = useState(null);
  useEffect(() => {
    setWarning(localStorage.getItem("underConstructionSummer24") || "yes");
  }, []);
  return (
    <>
      <Navbar />
      {warning == "yes" && (
        <div className={styles.warning}>
          <h2>
            ⚠️
            <br />
            Under construction
          </h2>
          <p>
            This summer, TzDB will be rebranding as{" "}
            <b>Tz'utujil.org Dictionary</b> and will also go through some major
            structural changes regarding the word database itself. In the
            meantime, data on the site may be inaccurate or misleading. Please
            proceed with caution.
          </p>
          <button
            onClick={() => {
              localStorage.setItem("underConstructionSummer24", "no");
              location.reload();
            }}
          >
            I understand
          </button>
        </div>
      )}
      <main>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <p>{local.t("heroSubtitle")}</p>
            <h2>
              {local.t("moreThan")} <span>{(count - 1).toLocaleString()}</span>{" "}
              {local.t("translatedWords")}
            </h2>
            <SearchBar />
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
            {local.t("previewEntryBelow")}
          </p>
          <ul>
            {words.map((word) => (
              <li key={word.id}>
                <Link href={`/words/${word.id}`}>
                  {word.tzWord.replace(/\s+/g, " ").trim()}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.aboutWrapper}>
          <div>
            <h1 style={{ marginBottom: 10 }}>{local.t("about")}</h1>
            <h2>{local.t("aboutHeader")}</h2>
            <div className={styles.divider} style={{ marginTop: 20 }}></div>
            <p
              className={styles.about}
              dangerouslySetInnerHTML={{ __html: local.t("aboutProject") }}
            ></p>
            <p className={styles.about}>{local.t("freeUse")}</p>
            <div className={styles.divider} style={{ marginTop: 20 }}></div>
            <p className={styles.smallTitle} style={{ opacity: 1 }}>
              {local.t("citations")}
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
