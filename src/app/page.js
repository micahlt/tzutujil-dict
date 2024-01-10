"use client";
import { useEffect, useState } from "react";
import styles from "./home.module.css";

export default function Home() {
  const [count, setCount] = useState(1);
  useEffect(() => {
    fetch("/api/getCount")
      .then((res) => res.text())
      .then((text) => setCount(text));
  });
  return (
    <main>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <p>Tz'utujil DB</p>
          <h2>
            Over <span>{count - 1}</span> translated words
          </h2>
        </div>
      </div>
    </main>
  );
}
