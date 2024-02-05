"use client";
import { ArrowLeft, ArrowRightCircle, ArrowLeftCircle } from "react-feather";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import local from "@/app/i18n";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Words() {
  const nav = useRouter();
  const params = useSearchParams();
  const [page, setPage] = useState();
  const [perPage, setPerPage] = useState();
  const [listData, setListData] = useState(null);
  const [hasFetchedParams, setHasFetchedParams] = useState(false);
  useEffect(() => {
    if (hasFetchedParams && page && perPage) {
      nav.push(`/words?perPage=${perPage}&page=${page}`);
      fetch(`/api/getAll?limit=${perPage}&offset=${(page - 1) * perPage}`)
        .then((res) => res.json())
        .then((json) => {
          setListData(json);
        });
    }
  }, [page, perPage]);
  useEffect(() => {
    if (params && !hasFetchedParams) {
      setPage(Number(params.get("page") || 1));
      setPerPage(Number(params.get("perPage") || 50));
      setHasFetchedParams(true);
    }
  }, [params]);
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
                  <tr key={word.id}>
                    <td>
                      <Link href={`/words/${word.id}`}>{word.tzWord}</Link>
                    </td>
                    <td>
                      <Link href={`/words/${word.id}`}>{word.esWord}</Link>
                    </td>
                    <td>
                      <Link href={`/words/${word.id}`}>{word.enWord}</Link>
                    </td>
                    <td>
                      <Link href={`/words/${word.id}`}>{word.id}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className={styles.divider}></div>
          {page && perPage && (
            <footer className={styles.footer}>
              <div className={styles.pageNav}>
                Page{" "}
                <input
                  type="text"
                  value={page}
                  onChange={(e) => setPage(e.target.value)}
                  suppressHydrationWarning={true}
                />
                {"  "}showing{"  "}
                <input
                  type="text"
                  value={perPage}
                  onChange={(e) => setPerPage(e.target.value)}
                  suppressHydrationWarning={true}
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
          )}
        </div>
      </main>
    </>
  );
}
