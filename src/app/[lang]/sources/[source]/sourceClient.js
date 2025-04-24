"use client";
import styles from "../../words/[word]/page.module.css";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import {
    AlertTriangle,
    ArrowLeft,
    Edit2,
    ExternalLink,
    Loader,
    Plus,
    Save,
    Trash,
    X,
} from "react-feather";
import { useRouter } from "next/navigation";
import TextareaAutosize from "react-textarea-autosize";
import Link from "next/link";
import React from "react";

export default function SourceClient({
    sourceId,
    sourceData,
    locale,
    defaultView = "view",
}) {
    const [sourceInfo, setSourceInfo] = useState(sourceData);
    const [password, setPassword] = useState();
    const [editMode, setEditMode] = useState(defaultView == "new");
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const nav = useRouter();
    useEffect(() => {
        setPassword(window.localStorage.getItem("pwd"));
    }, []);
    useEffect(() => {
        if (editMode && sources.length == 0) {
            fetch(`/api/getAll?type=sources`)
                .then((res) => res.json())
                .then((json) => setSources(json))
                .catch((err) => {
                    setError({
                        code: err.code || err.reason || "Failed to fetch sources",
                    });
                });
        }
    }, [editMode]);

    const deleteItem = () => { }

    const saveSource = (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(sourceInfo)
        if (sourceId == "new") {
            fetch(`/api/source`, {
                method: "PUT",
                body: JSON.stringify({ ...sourceInfo, id: sourceId }),
                headers: {
                    "x-pwd": password,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    if (json.success) {
                        setEditMode(false);
                        nav.push(`/sources/${json.id}`);
                    } else {
                        setError({ code: json.code || json.error });
                    }
                    setLoading(false);
                });
        } else {
            fetch(`/api/source`, {
                method: "PATCH",
                body: JSON.stringify({ ...sourceInfo, id: sourceId }),
                headers: {
                    "x-pwd": password,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    if (json.success) {
                        setEditMode(false);
                        nav.refresh();
                    } else {
                        setError({ code: json.code });
                    }
                    setLoading(false);
                });
        }
    };

    return (
        <>
            <Navbar locale={locale} />
            {sourceInfo ? (
                <main className={styles.main}>
                    <div className={styles.headerFlex}>
                        <Link href={window.localStorage.getItem("previous") || "/"} onClick={() => window.localStorage.removeItem("previous")} className={styles.goBack}>
                            <ArrowLeft size={24}></ArrowLeft> {window.localStorage.getItem("previous") ? locale.goBack : locale.goHome}
                        </Link>
                        <div className={styles.spacer}></div>
                        {password && !editMode && (
                            <a
                                className={styles.button}
                                href="#"
                                style={{ backgroundColor: "#c9a70e" }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEditMode(true);
                                }}
                            >
                                <Edit2 size={16} />
                                {locale.edit}
                            </a>
                        )}
                        {password && !editMode && sourceId != "new" && (
                            <a
                                className={styles.button}
                                href="#"
                                style={{ backgroundColor: "#c10e0e" }}
                                onClick={deleteItem}
                            >
                                {loading ? (
                                    <Loader size={16} className={styles.rotate} />
                                ) : (
                                    <Trash size={16} />
                                )}
                                {locale.delete}
                            </a>
                        )}
                        {password && editMode && (
                            <>
                                {sourceId != "new" && (
                                    <a
                                        className={styles.button}
                                        href="#"
                                        style={{ backgroundColor: "#c10e0e" }}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSourceInfo(sourceData);
                                            setEditMode(false);
                                        }}
                                    >
                                        <X size={16} />
                                        {locale.cancel}
                                    </a>
                                )}
                                <a
                                    className={styles.button}
                                    href="#"
                                    style={{ backgroundColor: "#009262" }}
                                    onClick={saveSource}
                                >
                                    {loading ? (
                                        <Loader size={16} className={styles.rotate} />
                                    ) : (
                                        <Save size={16} />
                                    )}
                                    {locale.saveChanges}
                                </a>
                            </>
                        )}
                    </div>
                    {error && error.code && (
                        <div className={styles.error}>
                            <AlertTriangle size={24} />
                            <p>
                                {locale.errorRecieved}: <pre>{error.code}</pre>
                            </p>
                        </div>
                    )}
                    <p className={styles.smallTitle}>{locale.source}</p>
                    <TextareaAutosize
                        className={styles.tzWord}
                        placeholder={locale.source}
                        disabled={!editMode}
                        onChange={(e) => setSourceInfo({ ...sourceInfo, name: e.target.value })}
                        value={sourceInfo.name}
                    ></TextareaAutosize>

                    <div className={styles.card}>
                        <div className={styles.definitionGrid}>
                            {sourceInfo?.related?.length > 0 && (
                                <div>
                                    <p className={styles.smallTitle}>{locale.seeAlso}</p>
                                    <h3>
                                        {sourceInfo?.related?.map((w, i) => `${w}`)?.join(", ") || ""}
                                    </h3>
                                </div>
                            )}
                            <div>
                                <p className={styles.smallTitle}>{locale.sourceId}</p>
                                <h3>{sourceInfo._id}</h3>
                            </div>
                            {sourceId != "new" && (
                                <div>
                                    <p className={styles.smallTitle}>{locale.link}</p>
                                    <h3>
                                        <a
                                            href={sourceInfo?.url || null}
                                            className={styles.source}
                                            target="_blank"
                                            title="Open this source in a new tab"
                                        >
                                            {locale.open} <ExternalLink size={16} />
                                        </a>
                                    </h3>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.card}>
                        <p className={styles.smallTitle}>{locale.notes}</p>
                        <TextareaAutosize
                            placeholder="no notes yet..."
                            className={styles.notes}
                            disabled={!editMode}
                            onChange={(e) => {
                                setSourceInfo({
                                    ...sourceInfo,
                                    description: e.target.value,
                                });
                            }}
                            value={sourceInfo.description || ""}
                        ></TextareaAutosize>
                    </div>
                </main>
            ) : (
                <div className="loader" style={{ marginTop: "7rem" }}></div>
            )}
        </>
    );
}
