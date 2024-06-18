import { useEffect, useState } from "react";
import BoundMultiInput from "./BoundMultiInput";
import styles from "./WordRow.module.css";
import Link from "next/link";

export default function WordRow({
  wordObj,
  wordId = "new",
  onSave,
  sourceOpts = [],
  defaultSource,
}) {
  const [word, setWord] = useState(
    wordObj || {
      variants: [""],
      definitions: [
        {
          en: {
            translation: "",
            example: "",
          },
          es: {
            translation: "",
            example: "",
          },
          tz: {
            example: "",
          },
        },
      ],
      sourceId: defaultSource || sourceOpts[0],
      notes: "",
    }
  );

  const onSaveProxy = () => {
    onSave(word, wordId);
    setWord({
      variants: [""],
      definitions: [
        {
          en: {
            translation: "",
            example: "",
          },
          es: {
            translation: "",
            example: "",
          },
          tz: {
            example: "",
          },
        },
      ],
      sourceId: defaultSource || sourceOpts[0],
      notes: "",
    });
  };

  return (
    <tr>
      <td>
        <>{/* TZ'UTUJIL SPELLINGS */}</>
        <BoundMultiInput
          onChange={(val) => setWord({ ...word, variants: val })}
          initialValue={word.variants}
          onSubmit={onSaveProxy}
          autofocus={true}
        />
      </td>
      <td>
        <>{/* SPANISH TRANSLATION */}</>
        <BoundMultiInput
          numbered={true}
          initialValue={word.definitions.map((def) => def.es.translation)}
          onChange={(arr) => {
            let definitions = [...word.definitions];
            arr.forEach((val, i) => {
              if (definitions[i]) {
                definitions[i].es.translation = val;
              } else {
                definitions.push({
                  es: {
                    translation: val,
                    example: "",
                  },
                  en: {
                    translation: "",
                    example: "",
                  },
                  tz: {
                    example: "",
                  },
                });
              }
            });
            setWord({ ...word, definitions });
          }}
          onSubmit={onSaveProxy}
        />
      </td>
      <td>
        <>{/* ENGLISH TRANSLATION */}</>
        <BoundMultiInput
          numbered={true}
          initialValue={word.definitions.map((def) => def.en.translation)}
          onChange={(arr) => {
            let definitions = [...word.definitions];
            arr.forEach((val, i) => {
              if (definitions[i]) {
                definitions[i].en.translation = val;
              } else {
                definitions.push({
                  en: {
                    translation: val,
                    example: "",
                  },
                  es: {
                    translation: "",
                    example: "",
                  },
                  tz: {
                    example: "",
                  },
                });
              }
            });
            setWord({ ...word, definitions });
          }}
          onSubmit={onSaveProxy}
        />
      </td>
      <td>
        <select className={styles.sourcePicker}>
          <option>HEllo</option>
        </select>
      </td>
      <td>
        <select
          className={styles.sourcePicker}
          value={word.sourceId}
          onChange={(e) => setWord({ ...word, sourceId: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              onSaveProxy();
            }
          }}
        >
          {sourceOpts.map((opt) => (
            <option value={opt._id} key={opt._id}>
              {opt.name}
            </option>
          ))}
        </select>
      </td>
      <td>
        {wordId != "new" && (
          <Link
            href={wordId != "new" ? `/words/${wordId}` : "#"}
            className={styles.wordLink}
            title="Open word in new tab"
            target="_blank"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M10 6v2H5v11h11v-5h2v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6zm11-3v8h-2V6.413l-7.793 7.794-1.414-1.414L17.585 5H13V3h8z"
                  fill="white"
                />
              </g>
            </svg>
          </Link>
        )}
      </td>
    </tr>
  );
}
