import classNames from "classnames";
import { PARTS_COLORS, PARTS_OF_SPEECH } from "@/lib/partsOfSpeech";
import styles from "./PartOfSpeechBadge.module.css";
import { useMemo } from "react";

export default function PartOfSpeechBadge({ partCode, locale, context }) {
  const text = useMemo(() => {
    for (let entry of Object.values(PARTS_OF_SPEECH)) {
      if (entry.en == partCode) {
        return entry[locale];
      }
    }
  }, [partCode, locale])
  return (
    <div
      className={classNames(
        styles.badge,
        context == "search" ? styles.searchBadge : null
      )}
      style={{ backgroundColor: PARTS_COLORS[partCode] }}
    >
      {text}
    </div>
  );
}
