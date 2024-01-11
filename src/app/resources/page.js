"use client";
import { ArrowLeft } from "react-feather";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import local from "@/app/i18n";

export default function Resources() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Link href="/" className={styles.goHome}>
          <ArrowLeft size={24}></ArrowLeft> {local.t("goHome")}
        </Link>
        <div>
          <h1 style={{ marginBottom: 10 }}>{local.t("resources")}</h1>
          <div className={styles.divider}></div>
          <p className={styles.smallTitle}>Audio</p>
          <ul className={styles.resourceList}>
            <li>
              <a
                href="http://talkingdictionary.swarthmore.edu/tzutujil/?fields=ipa&semantic_ids=animal&q=*"
                target="_blank"
              >
                Diccionario Hablado
              </a>
            </li>
            <li>
              <a
                href="https://podcasts.apple.com/us/podcast/la-fe-viene-por-el-oir/id1516487313"
                target="_blank"
              >
                La Fe Viene Por El Oír podcast
              </a>
            </li>
            <li>
              <a
                href="https://globalrecordings.net/en/program/14190"
                target="_blank"
              >
                Words of Life - Tzutujil: Western
              </a>
            </li>
          </ul>
          <div className={styles.divider}></div>
          <p className={styles.smallTitle}>{local.t("grammar")}</p>
          <ul className={styles.resourceList}>
            <li>
              <a
                href="https://scholarworks.boisestate.edu/fac_books/359/"
                target="_blank"
              >
                "Tzutujil Grammar" by Jon P. Dayley
              </a>
            </li>
            <li>
              <a
                href="https://www.google.com/books/edition/Introducci%C3%B3n_a_la_gram%C3%A1tica_de_los_idi/MLCAhhvmWg0C"
                target="_blank"
              >
                Introducción a la gramática de los idiomas mayas by Nora C.
                England
              </a>
            </li>
            <li>
              <a
                href="https://www.thriftbooks.com/w/tzutujiil-maya-grammar-3rd-edition/20786105"
                target="_blank"
              >
                Tz’utujil Maya Grammar- Mateo Russo and Sandra Chigüela
              </a>
            </li>
            <li>
              <a
                href="https://www.almg.org.gt/wp-content/uploads/2020/10/GRAMATICA-NORMATIVA-VERSION-FINAL.pdf"
                target="_blank"
              >
                Gramática muy comprehensiva en español by ALMG
              </a>
            </li>
          </ul>
          <div className={styles.divider}></div>
          <p className={styles.smallTitle}>{local.t("vocabulary")}</p>
          <ul className={styles.resourceList}>
            <li>
              <a
                href="https://www.google.com/books/edition/Diccionario_Tz_utujil/7qPgzrBQ3TgC"
                target="_blank"
              >
                Diccionario Tz'utujil by Francisco Pérez Mendoza
              </a>
            </li>
            <li>
              <a
                href="https://method.fluent-forever.com/base-vocabulary-list/"
                target="_blank"
              >
                The Most Awesome Word List You Have Ever Seen by Gabriel Wyner
              </a>
            </li>
            <li>
              <a
                href="https://www.almg.org.gt/wp-content/uploads/2020/10/VOCABULARIO-9.pdf"
                target="_blank"
              >
                Diccionario TZ-ESP by ALMG
              </a>
            </li>
            <li>
              <a
                href="https://taltuisa.blogspot.com/2019/03/glosario-en-tzutujil.html"
                target="_blank"
              >
                Glosario en Tzutujil by Taltuisa
              </a>
            </li>
            <li>
              <a
                href="https://www.scribd.com/document/412504778/Palabras-basicas-en-tz-utujil"
                target="_blank"
              >
                Palabras Básicas en Tz'utujil by Sonia Lorainos
              </a>
            </li>
            <li>
              <a
                href="https://chefsitoernesto.blogspot.com/2019/06/glosario-de-tzutujil.html"
                target="_blank"
              >
                Publicaciones de Ernesto Ramirez: Glosario de Tz'utujil
              </a>
            </li>
            <li>
              <a
                href="https://www.almg.org.gt/wp-content/uploads/2020/10/NEOLOGISMO-TZ_UTUJIL.pdf"
                target="_blank"
              >
                Tz’utujil Neologism by Gaspar
              </a>
            </li>
            <li>
              <a
                href="https://drive.google.com/file/d/1U-xEf1mdon3IE9cE8lAv2XpFjYn0gCUe/view"
                target="_blank"
              >
                Tz’utujil/Spanish/English Vocabulary and Basic Phrases by John
                J. McGraw
              </a>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
