"use client";
import local, { swapLang } from "@/app/i18n";
import { Globe } from "react-feather";
import style from "./Navbar.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Navbar() {
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [backdropFilter, setBackdropFilter] = useState("none");
  const [loggedIn, setLoggedIn] = useState();
  useEffect(() => {
    setLoggedIn(window.localStorage.getItem("pwd"));
    window.addEventListener("scroll", () => {
      if (window.scrollY > 90) {
        setBackgroundColor("rgba(0,0,0,0.5)");
        setBackdropFilter("blur(5px)");
      } else {
        setBackgroundColor("transparent");
        setBackdropFilter("none");
      }
    });
  }, []);
  return (
    <nav
      className={style.nav}
      style={{
        backgroundColor,
        backdropFilter,
      }}
    >
      <a
        href="#"
        className={style.langSwitch}
        onClick={swapLang}
        title={local.t("switchLanguages")}
      >
        <Globe size={16} /> <span>{local.t("langSwitch")}</span>
      </a>
      <div className={style.flexSpacer}></div>
      <Link href="/words" className={style.link}>
        {local.t("allWords")}
      </Link>
      <Link href="/resources" className={style.link}>
        {local.t("resources")}
      </Link>
      {loggedIn && (
        <Link href="/words/new" className={style.link}>
          {local.t("newWord")}
        </Link>
      )}
    </nav>
  );
}
