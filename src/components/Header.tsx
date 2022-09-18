import { Close, Settings as SettingsIcon } from "@mui/icons-material";
import {
  AppBar,
  Autocomplete,
  Button,
  Dialog,
  IconButton,
  Link,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { Settings } from "../features/settings/Settings";
import {
  LANGUAGES_MAP,
  selectLanguage,
} from "../features/settings/settingsSlice";
import {
  addWord,
  selectType,
  selectWords,
  setType,
  wordTypes,
} from "../features/words/wordsSlice";
import styles from "./Header.module.css";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function Header() {
  const words = useAppSelector(selectWords);
  const type = useAppSelector(selectType);
  const language = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  const [key, setKey] = useState("");
  const [definition, setDefinition] = useState("");
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<string[] | null>(null);

  useEffect(() => {
    if (language && language.length) {
      LANGUAGES_MAP[language]().then((res) => {
        setOptions(res);
      });
    }
  }, [language]);

  const handleOpen = () => {
    setSettingsDialogOpen(true);
  };

  const handleClose = () => {
    setSettingsDialogOpen(false);
  };

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
          onChange={(e) => dispatch(setType(e.target.value))}
          className={styles.select}
        >
          {wordTypes.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
        <label className={styles.label} htmlFor="key">
          Word
        </label>
        {type !== "" && options ? (
          <Autocomplete
            sx={{ marginRight: 2 }}
            value={key}
            onChange={(_, value) => setKey(value || "")}
            options={options}
            renderInput={(params) => <TextField {...params} />}
            freeSolo
          />
        ) : (
          <textarea
            id="key"
            className={styles.textbox}
            aria-label="Set word"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        )}
        {key && key.length && (
          <Link
            href={`https://translate.google.com/?sl=it&tl=en&text=${key}&op=translate`}
            target="_blank"
            sx={{ fontSize: "1.5rem", marginRight: 2 }}
          >
            Translation
          </Link>
        )}
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
      <IconButton
        id="settings-button"
        onClick={handleOpen}
        aria-controls={settingsDialogOpen ? "settings-dialog" : undefined}
        aria-haspopup="true"
        aria-expanded={settingsDialogOpen ? "true" : undefined}
      >
        <SettingsIcon fontSize="large" />
      </IconButton>
      <Dialog
        fullScreen
        open={settingsDialogOpen}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Settings
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Done
            </Button>
          </Toolbar>
        </AppBar>
        <Settings />
      </Dialog>
    </div>
  );
}
