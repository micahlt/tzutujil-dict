"use client";
import { ArrowLeft, ArrowRightCircle, ArrowLeftCircle } from "react-feather";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sortDirections } from "@/lib/sort";
import { PARTS_COLORS, PARTS_OF_SPEECH } from "@/lib/partsOfSpeech";

export default function Words({ locale }) {
  const nav = useRouter();
  const params = useSearchParams();
  const [page, setPage] = useState();
  const [perPage, setPerPage] = useState();
  const [listData, setListData] = useState(null);
  const [hasFetchedParams, setHasFetchedParams] = useState(false);
  const [sort, setSort] = useState({
    by: "lastModifed",
    dir: sortDirections.DESC,
  });
  const [filter, setFilter] = useState({
    partOfSpeech: 0,
  });
  useEffect(() => {
    if (hasFetchedParams && page && perPage) {
      nav.push(
        `/words?perPage=${perPage}&page=${page}&sortBy=${sort.by}&sortDir=${sort.dir}&partOfSpeech=${filter.partOfSpeech === 0 ? "" : filter.partOfSpeech}`
      );
      fetch(
        `/api/getAll?limit=${perPage}&offset=${(page - 1) * perPage}&sortBy=${sort.by
        }&sortDir=${sort.dir}&partOfSpeech=${filter.partOfSpeech === 0 ? "" : filter.partOfSpeech}`
      )
        .then((res) => res.json())
        .then((json) => {
          setListData(json);
        });
    }
  }, [page, perPage, sort, filter]);
  useEffect(() => {
    if (params && !hasFetchedParams) {
      setPage(Number(params.get("page") || 1));
      setPerPage(Number(params.get("perPage") || 50));
      setSort({
        by: params.get("sortBy") || "lastModified",
        dir: params.get("sortDir") || sortDirections.DESC,
      });
      setFilter({
        partOfSpeech: params.get("partOfSpeech") || "",
      })
      setHasFetchedParams(true);
    }
  }, [params]);
  return (
    <>
      <Navbar locale={locale} />
      <main className={styles.main}>
        <Link href="/" className={styles.goBack}>
          <ArrowLeft size={24}></ArrowLeft> {locale.goBack}
        </Link>
        <div>
          <h1 style={{ marginBottom: 10 }}>{locale.allWords}</h1>
          <div className={styles.sortOptions}>
            <h4>Sort by</h4>
            <select
              className={styles.sortPicker}
              value={sort.by}
              onChange={(e) => setSort({ ...sort, by: e.target.value })}
            >
              <option value="lastModified">{locale.lastModified}</option>
            </select>
            <select
              className={styles.sortPicker}
              value={sort.dir}
              onChange={(e) => setSort({ ...sort, dir: e.target.value })}
            >
              <option value={sortDirections.ASC}>{locale.ascending}</option>
              <option value={sortDirections.DESC}>{locale.descending}</option>
            </select>
            <h4 style={{ marginLeft: 15 }}>Filter by</h4>
            <select
              className={styles.sortPicker}
              style={{ backgroundColor: PARTS_COLORS[filter.partOfSpeech] }}
              value={filter.partOfSpeech}
              onChange={(e) => {
                setFilter({ partOfSpeech: Number(e.target.value) });
              }}
            >
              <option value={0} style={{ color: "gray" }}>
                {locale.anyPartOfSpeech}
              </option>
              <optgroup label={locale.options}>
                {Object.keys(PARTS_OF_SPEECH).map((key, i) => (
                  <option
                    key={i}
                    value={key}
                    style={{ backgroundColor: PARTS_COLORS[key] }}
                  >
                    {PARTS_OF_SPEECH[key][locale._code]}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          {listData && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tz'utujil</th>
                  <th>{locale.spanish}</th>
                  <th>{locale.english}</th>
                  <th>{locale.lastModified}</th>
                </tr>
              </thead>
              <tbody>
                {listData.map((word) => (
                  <tr key={word.id}>
                    <td>
                      <Link href={`/words/${word._id}`}>
                        {word.variants[0]}
                      </Link>
                    </td>
                    <td>
                      <Link href={`/words/${word._id}`}>
                        {word.definitions[0].es?.translation || ""}
                      </Link>
                    </td>
                    <td>
                      <Link href={`/words/${word._id}`}>
                        {word.definitions[0].en?.translation || ""}
                      </Link>
                    </td>
                    <td>
                      <Link href={`/words/${word._id}`}>
                        {new Date(word.lastModified).toLocaleDateString(
                          undefined,
                          {
                            month: "numeric",
                            day: "numeric",
                            year: "2-digit",
                          }
                        )}
                      </Link>
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
