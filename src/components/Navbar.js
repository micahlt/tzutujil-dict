"use client";
import { Globe } from "react-feather";
import { usePathname } from "next/navigation";
import style from "./Navbar.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
export default function Navbar({ locale }) {
  const nav = useRouter();
  const pathName = usePathname();
  const redirectedPathName = (l) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = l;
    return segments.join("/");
  };

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
        onClick={(e) => {
          e.preventDefault();
          const newLocale = locale._code == "en" ? "es" : "en";
          document.cookie = `NEXT_LOCALE=${newLocale}; max-age=31536000; path=/`;
          nav.push(redirectedPathName(newLocale));
        }}
        className={style.langSwitch}
        title={locale.switchLanguages}
      >
        <Globe size={16} /> <span>{locale.langSwitch}</span>
      </a>
      <div className={style.flexSpacer}></div>
      <Link href={`/${locale._code}/words`} className={style.link}>
        {locale.allWords}
      </Link>
      <Link
        href="https://tzutujil.notion.site/Resource-Database-51b8931bedff4f1a862835479a65d38e"
        className={style.link}
      >
        {locale.resources}
      </Link>
      {loggedIn && (
        <div href="#" className={style.link}>
          <p>{locale.new}</p>
          <div className={style.dropdown}>
            <Link href={`/${locale._code}/words/new`} className={style.link}>
              {locale.newWord}
            </Link>
            <Link href={`/${locale._code}/sources/new`} className={style.link}>
              {locale.newSource}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
