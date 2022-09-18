import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addWord, selectWords } from "../features/words/wordsSlice";
import styles from "./Header.module.css";

export const wordTypes = ["verb", "noun", "adjective", "preposition"];

export function Header() {
  const words = useAppSelector(selectWords);
  const dispatch = useAppDispatch();
  const [key, setKey] = useState("");
  const [type, setType] = useState(
    wordTypes[0].charAt(0).toUpperCase() + wordTypes[0].slice(1)
  );
  const [definition, setDefinition] = useState("");

  const submit = () => {
    setKey("");
    setDefinition("");
    dispatch(addWord({ key, value: { type, definition } }));
  };

  return (
    <div className={styles.header}>
      <div className={styles.addWord}>
        <label className={styles.label} htmlFor="key">
          Type
        </label>
        <select
          id="type"
          aria-label="Set type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className={styles.select}
        >
          {wordTypes.map((t) => (
            <option value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
        <label className={styles.label} htmlFor="key">
          Word
        </label>
        <textarea
          id="key"
          className={styles.textbox}
          aria-label="Set word"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <label className={styles.label} htmlFor="value">
          Definition
        </label>
        <textarea
          id="key"
          className={styles.textbox}
          aria-label="Set Definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
        />
        <button
          className={styles.button}
          aria-label="Add Word"
          onClick={submit}
          disabled={!definition || definition === ""}
        >
          {key in words ? "Change Definition" : "Add Word"}
        </button>
        {key in words && (
          <p style={{ color: "red" }}>Word is already in dictionary</p>
        )}
      </div>
    </div>
  );
}
