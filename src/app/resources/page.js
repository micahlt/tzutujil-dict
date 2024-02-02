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
        <Link href="/" className={styles.goBack}>
          <ArrowLeft size={24}></ArrowLeft> {local.t("goBack")}
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
                Tz'utujil Maya Grammar- Mateo Russo and Sandra Chigüela
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
                Tz'utujil Neologism by Gaspar
              </a>
            </li>
            <li>
              <a
                href="https://drive.google.com/file/d/1U-xEf1mdon3IE9cE8lAv2XpFjYn0gCUe/view"
                target="_blank"
              >
                Tz'utujil/Spanish/English Vocabulary and Basic Phrases by John
                J. McGraw
              </a>
            </li>
          </ul>
          <div className={styles.divider}></div>
          <p className={styles.smallTitle}>{local.t("videos")}</p>
          <ul className={styles.resourceList}>
            <li>
              <a
                href="https://www.youtube.com/playlist?list=PLZLlaR9qGuxq0DC5f3ecQhzmXh0ywvJCy"
                target="_blank"
              >
                Tz'utujil Youtube Playlist by Anna Robbins
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/c/PuebloapuebloOrg"
                target="_blank"
              >
                Pueblo a Pueblo - YouTube
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
                href="https://www.youtube.com/watch?v=D4WjsoS9RXo"
                target="_blank"
              >
                Learning Mayan Tz'utujil in San Pedro la Laguna
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/c/IsraelQuic/videos"
                target="_blank"
              >
                i Quic - YouTube
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/watch?v=WlNt9WhlHGU"
                target="_blank"
              >
                Ajpub' Pablo García: los nahuales y la engendración
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/c/Canal5TvMayaALMG/featured"
                target="_blank"
              >
                Canal 5 Tv Maya - YouTube
              </a>
            </li>
            <li>
              <a href="https://youtu.be/x9tuinCxAmA" target="_blank">
                La película Jesús - Tz'utujil / Tz'utujil Oriental Idioma The
                Jesus Film
              </a>
            </li>
            <li>
              <a
                href="https://www.jesusfilm.org/watch/jesus.html/tzutujil-eastern.html"
                target="_blank"
              >
                The Jesus Film - Tz'utujil Eastern
              </a>
            </li>
          </ul>
          <div className={styles.divider}></div>
          <p className={styles.smallTitle}>{local.t("read")}</p>
          <ul className={styles.resourceList}>
            <li>
              <a
                href="https://www.bible.com/bible/687/MAT.1.TZJW"
                target="_blank"
              >
                Mateo 1 | tzjW Bible | YouVersion
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Vida%20de%20Ancianos%20de%20Atitlan.pdf"
                target="_blank"
              >
                Vida de los Ancianos del Lago Atitlán
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Vida%20de%20las%20Mujeres%20de%20Atitlan.pdf"
                target="_blank"
              >
                Vida de las Mujeres del Lago Atitlán
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Vida%20de%20los%20Hombres%20de%20Atitlan.pdf"
                target="_blank"
              >
                Vida de los Hombres del Lago Atitlán
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Pueblos%20y%20Santos%20del%20Lago%20Atitlan.pdf"
                target="_blank"
              >
                Pueblos y Santos del Lago Atitlán
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Literatura%20Oral%20de%20Atitlan.pdf"
                target="_blank"
              >
                Literatura Oral de los Pueblos del Lago Atitlán
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Geografia%20de%20Atitlan.pdf"
                target="_blank"
              >
                Nuestra Geografía del Lago Atitlán
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Nuestro%20Maiz%20de%20Atitlan.pdf"
                target="_blank"
              >
                Nuestro Maíz del Lago Atitlán
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Tecnicas%20I.pdf"
                target="_blank"
              >
                Técnicas del Lago Atitlán
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Tecnicas%20II.pdf"
                target="_blank"
              >
                Técnicas en los pueblos del Lago Atitlán
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Historias%20de%20La%20Noche.pdf"
                target="_blank"
              >
                Historias de la Noche en el Lago Atitlán
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/La%20Abuela%20Luna.pdf"
                target="_blank"
              >
                La Abuela Luna y Otras Historias del Cielo
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Historias%20Historia%20de%20Atitlan.pdf"
                target="_blank"
              >
                Historias, Historia del Lago Atitlán
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Pintores%20del%20Lago%20Atitlan.pdf"
                target="_blank"
              >
                La Pintura del Lago Atitlán
              </a>
            </li>
            <li>
              <a
                href="https://www.palabrasatitlan.org/docs/Pintores%20del%20Lago%20Atitlan.pdf"
                target="_blank"
              >
                Guía Pedagógica
              </a>
            </li>
            <li>
              <a
                href="https://www.sil.org/system/files/reapdata/69/30/94/69309481678907613311725397186735092714/26938_withUPcover.pdf"
                target="_blank"
              >
                Texto sobre la historia
              </a>
            </li>
          </ul>
        </div>
      </main>
    </>
  );
}
