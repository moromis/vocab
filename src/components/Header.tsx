import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addWord, selectWords } from "../features/words/wordsSlice";
import styles from "./Header.module.css";

export function Header() {
  const words = useAppSelector(selectWords);
  const dispatch = useAppDispatch();
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  return (
    <div className={styles.header}>
      <div className={styles.addWord}>
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
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          className={styles.button}
          aria-label="Add Word"
          onClick={() => dispatch(addWord({ key, value }))}
          disabled={!value || value === ""}
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
