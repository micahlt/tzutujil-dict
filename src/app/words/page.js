"use client";
import { ArrowLeft, ArrowRightCircle, ArrowLeftCircle } from "react-feather";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import local from "@/app/i18n";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Words() {
  const nav = useRouter();
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [listData, setListData] = useState(null);
  useEffect(() => {
    fetch(`/api/getAll?limit=${perPage}&offset=${(page - 1) * 25}`)
      .then((res) => res.json())
      .then((json) => {
        setListData(json);
      });
  }, [page, perPage]);
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <Link href="/" className={styles.goBack}>
          <ArrowLeft size={24}></ArrowLeft> {local.t("goBack")}
        </Link>
        <div>
          <h1 style={{ marginBottom: 10 }}>{local.t("allWords")}</h1>
          {listData && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tz'utujil</th>
                  <th>Spanish</th>
                  <th>English</th>
                  <th>ID</th>
                </tr>
              </thead>
              <tbody>
                {listData.map((word) => (
                  <tr onClick={() => nav.push(`/words/${word.id}`)}>
                    <td>{word.tzWord}</td>
                    <td>{word.esWord}</td>
                    <td>{word.enWord}</td>
                    <td>{word.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className={styles.divider}></div>
          <footer className={styles.footer}>
            <div className={styles.pageNav}>
              Page{" "}
              <input
                type="text"
                value={page}
                onChange={(e) => setPage(e.target.value)}
              />
              {"  "}showing{"  "}
              <input
                type="text"
                value={perPage}
                onChange={(e) => setPerPage(e.target.value)}
              />{" "}
              per page
            </div>
            <div className={styles.navButtons}>
              <ArrowLeftCircle
                size={24}
                onClick={() => {
                  if (page > 1) setPage(page - 1);
                }}
                opacity={page > 1 ? 1 : 0.3}
                cursor={page > 1 ? "default" : "pointer"}
              ></ArrowLeftCircle>
              <ArrowRightCircle
                size={24}
                onClick={() => setPage(page + 1)}
                cursor="pointer"
              ></ArrowRightCircle>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
