import Link from "next/link";
import styles from "./page.module.css";

export default function Extractors() {
  return (
    <main className={styles.main}>
      <div>
        <h2>Extractors</h2>
        <div className={styles.buttons}>
          <Link
            href="/extractors/extractor-funky"
            title="Weird formatting (do not use)"
          >
            Funky Extractor
          </Link>
          <Link
            href="/extractors/extractor-tzes"
            title="TZ to ES with no metadata"
          >
            TZ-ES Extractor
          </Link>
        </div>
      </div>
    </main>
  );
}
