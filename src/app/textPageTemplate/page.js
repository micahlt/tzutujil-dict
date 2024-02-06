"use client";
import { ArrowLeft } from "react-feather";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import local from "@/app/i18n";

export default function TextPageTemplate() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Link href="/" className={styles.goBack}>
          <ArrowLeft size={24}></ArrowLeft> {local.t("goBack")}
        </Link>
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
            Tz’utujil/Spanish/English — Vocabulary and Basic Phrases —. (n.d.).
          </p>
          <p className={styles.citation}>
            Wyner, G. (2023, August 21). The Most Awesome Word List You Have
            Ever Seen. Fluent Forever.
            https://method.fluent-forever.com/base-vocabulary-list/
          </p>
        </div>
      </main>
    </>
  );
}
