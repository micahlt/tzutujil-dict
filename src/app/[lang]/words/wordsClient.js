"use client";

/**
 * @typedef { import("@prisma/client").Words } Word
 * @typedef { import("@prisma/client").Sources } Source
 * @typedef { import("@prisma/client").Senses } Sense
 * @typedef { import("@prisma/client").Examples } Example
 * @typedef { import("@prisma/client").Spellings } Spelling
 * 
 * @typedef {Object} WordExtras
 * @property {Source} Source
 * @property {Sense[]} Senses
 * @property {Example[]} Examples
 * @property {Spelling[]} Spellings
 * 
 * @typedef { Word & WordExtras } FullWord
 */

import { ArrowLeft, ArrowRightCircle, ArrowLeftCircle } from "react-feather";
import styles from "./page.module.css";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sortDirections } from "@/lib/sort";
import { PARTS_COLORS, PARTS_OF_SPEECH } from "@/lib/partsOfSpeech";
import PartOfSpeechBadge from "@/components/PartOfSpeechBadge";

export default function Words({ locale, sources }) {
  const nav = useRouter();
  const params = useSearchParams();
  const [page, setPage] = useState();
  const [perPage, setPerPage] = useState();

  /** @type {ReturnType<typeof useState<FullWord[]>>} */
  const [listData, setListData] = useState(null);
  const [hasFetchedParams, setHasFetchedParams] = useState(false);
  const pageNumRef = useRef();
  const perPageRef = useRef();
  const [sort, setSort] = useState({
    by: "last_modified",
    dir: sortDirections.DESC,
  });
  const [filter, setFilter] = useState({
    partOfSpeech: "",
    source: ""
  });

  useEffect(() => {
    if (hasFetchedParams && page && perPage) {
      nav.push(
        `/words?perPage=${perPage}&page=${page}&sortBy=${sort.by}&sortDir=${sort.dir}&part=${filter.partOfSpeech}&source=${filter.source}`
      );
      fetch(
        `/api/getAll?limit=${perPage}&offset=${(page - 1) * perPage}&sortBy=${sort.by
        }&sortDir=${sort.dir}&part=${filter.partOfSpeech}&source=${filter.source}`
      )
        .then((res) => res.json())
        .then((json) => {
          setListData(json);
        });
    }
    if (perPageRef.current) {
      perPageRef.current.value = perPage;
    }
    if (pageNumRef.current) {
      pageNumRef.current.value = page;
    }
  }, [page, perPage, sort, filter]);
  useEffect(() => {
    if (params && !hasFetchedParams) {
      setPage(Number(params.get("page") || 1));
      setPerPage(Number(params.get("perPage") || 50));
      setSort({
        by: params.get("sortBy") || "last_modified",
        dir: params.get("sortDir") || sortDirections.DESC,
      });
      setFilter({
        partOfSpeech: params.get("part") || "",
        source: params.get("source") || "",
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
              <option value="last_modified">{locale.lastModified}</option>
            </select>
            <select
              className={styles.sortPicker}
              value={sort.dir}
              onChange={(e) => setSort({ ...sort, dir: e.target.value })}
            >
              <option value={sortDirections.ASC}>{locale.ascending}</option>
              <option value={sortDirections.DESC}>{locale.descending}</option>
            </select>
          </div>
          <div className={styles.sortOptions} style={{ marginBottom: "1em" }}>
            <h4>Filter by</h4>
            <select
              className={styles.sortPicker}
              style={{ backgroundColor: PARTS_COLORS[filter.partOfSpeech] }}
              value={filter.partOfSpeech}
              onChange={(e) => {
                setFilter({ ...filter, partOfSpeech: e.target.value });
              }}
            >
              <option value="" style={{ color: "gray" }}>
                {locale.anyPartOfSpeech}
              </option>
              {Object.keys(PARTS_OF_SPEECH).map((key) => (
                <option
                  key={key}
                  value={PARTS_OF_SPEECH[key].en}
                  style={{ backgroundColor: PARTS_COLORS[PARTS_OF_SPEECH[key].en] }}
                >
                  {PARTS_OF_SPEECH[key][locale._code].toLowerCase()}
                </option>
              ))}
              <option value={0}>unset</option>
            </select>
            <select
              className={styles.sortPicker}
              value={filter.source}
              onChange={(e) => {
                setFilter({
                  ...filter,
                  source: e.target.value
                })
              }}
            >
              <option style={{ color: "gray" }} value="">
                any source
              </option>
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          {listData && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Tz'utujil</th>
                  <th>{locale.spanish}</th>
                  <th>{locale.english}</th>
                  <th>{locale.part}</th>
                  <th>{locale.lastModified}</th>
                </tr>
              </thead>
              <tbody>
                {listData.map((word) => (
                  <tr key={word.id} onClick={() => nav.push(`/words/${word.id}`)}>
                    <td>
                      <Link href={`/words/${word.id}`} onClick={() => window.localStorage.setItem("previous", window.location.pathname)}>
                        {word.Spellings.find(s => s.is_primary)?.spelling || ""}
                      </Link>
                    </td>
                    <td>
                      <Link href={`/words/${word.id}`}>
                        {word.Senses.find(s => s.language == "ES")?.translation || ""}
                      </Link>
                    </td>
                    <td>
                      <Link href={`/words/${word.id}`}>
                        {word.Senses.find(s => s.language == "EN")?.translation || ""}
                      </Link>
                    </td>
                    <td>
                      <Link href={`/words/${word.id}`}>
                        <PartOfSpeechBadge partCode={word.part_of_speech} locale={locale._code} context="search" />
                      </Link>
                    </td>
                    <td>
                      <Link href={`/words/${word.id}`}>
                        {new Date(word.last_modified).toLocaleDateString(
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
                  ref={pageNumRef}
                  type="text"
                  defaultValue={page}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      setPage(e.target.value)
                    }
                  }}
                  onBlur={(e) => setPage(e.target.value)}
                  suppressHydrationWarning={true}
                />
                {"  "}showing{"  "}
                <input
                  ref={perPageRef}
                  type="text"
                  defaultValue={perPage}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") {
                      setPerPage(e.target.value)
                    }
                  }}
                  onBlur={(e) => setPerPage(e.target.value)}
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
