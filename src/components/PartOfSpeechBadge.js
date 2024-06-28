import classNames from "classnames";
import { PARTS_COLORS, PARTS_OF_SPEECH } from "@/lib/partsOfSpeech";
import styles from "./PartOfSpeechBadge.module.css";

export default function PartOfSpeechBadge({ partCode, locale, context }) {
  if (partCode === 0) return <></>;
  return (
    <div
      className={classNames(
        styles.badge,
        context == "search" ? styles.searchBadge : null
      )}
      style={{ backgroundColor: PARTS_COLORS[partCode] }}
    >
      {PARTS_OF_SPEECH[partCode][locale]}
    </div>
  );
}
