"use client";
import { ArrowLeft } from "react-feather";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import local from "@/app/i18n";
import { useRouter } from "next/navigation";

export default function Resources() {
  const nav = useRouter();
  const logIn = (pass) => {
    window.localStorage.setItem("pwd", pass);
    nav.push("/");
  };
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Link href="/" className={styles.goHome}>
          <ArrowLeft size={24}></ArrowLeft> {local.t("goHome")}
        </Link>
        <div>
          <h1 style={{ marginBottom: 10 }}>{local.t("logIn")}</h1>
          <div className={styles.divider}></div>
          <input
            type="password"
            placeholder={local.t("password")}
            className={styles.input}
            onKeyUp={(e) => {
              if (e.key == "Enter") logIn(e.target.value);
            }}
          ></input>
        </div>
      </main>
    </>
  );
}
