import { Close, Settings as SettingsIcon } from "@mui/icons-material";
import {
  AppBar,
  Autocomplete,
  Button,
  Dialog,
  IconButton,
  MenuItem,
  Select,
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
    dispatch(addWord({ key, value: { type } }));
  };

  return (
    <div className={styles.header}>
      <div className={styles.addWord}>
        <label className={styles.label} htmlFor="key">
          Type
        </label>
        <Select
          id="type"
          aria-label="Set type"
          value={type}
          onChange={(e) => dispatch(setType(e.target.value))}
          className={styles.select}
          sx={{ marginRight: 2 }}
        >
          {wordTypes.map((t) => (
            <MenuItem key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </MenuItem>
          ))}
        </Select>
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
          <TextField
            id="key"
            sx={{ marginRight: 2 }}
            className={styles.textbox}
            aria-label="Set word"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        )}
        <Button
          className={styles.button}
          aria-label="Add Word"
          onClick={submit}
          variant="contained"
        >
          {key in words ? "Change Definition" : "Add Word"}
        </Button>
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
