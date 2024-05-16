"use client";
import { ArrowLeft } from "react-feather";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login({ locale }) {
  const nav = useRouter();
  const logIn = (pass) => {
    window.localStorage.setItem("pwd", pass);
    nav.push("/");
  };
  return (
    <>
      <Navbar locale={locale} />
      <main className={styles.main}>
        <Link href="/" className={styles.goBack}>
          <ArrowLeft size={24}></ArrowLeft> {locale.goBack}
        </Link>
        <div>
          <h1 style={{ marginBottom: 10 }}>{locale.logIn}</h1>
          <div className={styles.divider}></div>
          <input
            type="password"
            placeholder={locale.password}
            className={styles.input}
            onKeyUp={(e) => {
              if (e.key == "Enter") logIn(e.target.value);
            }}
            autoComplete="current-password"
          ></input>
        </div>
      </main>
    </>
  );
}
