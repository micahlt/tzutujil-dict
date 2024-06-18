import { PARTS_COLORS, PARTS_OF_SPEECH } from "@/lib/partsOfSpeech";
import styles from "./PartOfSpeechBadge.module.css";

export default function PartOfSpeechBadge({ partCode, locale }) {
  return (
    <div
      className={styles.badge}
      style={{ backgroundColor: PARTS_COLORS[partCode] }}
    >
      {PARTS_OF_SPEECH[partCode][locale]}
    </div>
  );
}
