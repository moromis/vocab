import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  autocompleteClasses,
  Button,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Popper,
  Select,
  styled,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSearch, setSearch } from "../../features/search/searchSlice";
import {
  getCommonWordsFromLanguage,
  selectSettings,
} from "../../features/settings/settingsSlice";
import {
  addWord,
  partsOfSpeech,
  selectType,
  selectWords,
  setType,
} from "../../features/words/wordsSlice";
import { LoginButton } from "../LoginButton/LoginButton";
import { SelectLanguage } from "../SelectLanguage";
import { SettingsDialog } from "../Settings/SettingsDialog";
import styles from "./Header.module.css";
import { ListboxComponent } from "./ListboxComponent";

const StyledPopper = styled(Popper)({
  [`& .${autocompleteClasses.listbox}`]: {
    boxSizing: "border-box",
    "& ul": {
      padding: 0,
      margin: 0,
    },
  },
});

export function Header() {
  const words = useAppSelector(selectWords);
  const type = useAppSelector(selectType);
  const { language } = useAppSelector(selectSettings);
  const search = useAppSelector(selectSearch);
  const dispatch = useAppDispatch();

  const [key, setKey] = useState("");
  const [options, setOptions] = useState<string[] | null>(null);

  useEffect(() => {
    if (language && language.length) {
      getCommonWordsFromLanguage(language).then((res: any) => {
        setOptions(res);
      });
    }
  }, [language]);

  const submit = () => {
    setKey("");
    dispatch(
      addWord({
        word: key,
        type,
        language: language && language.length ? language : null,
      })
    );
  };

  return (
    <div className={styles.header}>
      <div className={styles.addWord}>
        <Box sx={{ marginRight: 2, display: "flex", alignItems: "center" }}>
          <SelectLanguage />
        </Box>
        <InputLabel htmlFor="key">Part of Speech</InputLabel>
        <Select
          id="type"
          aria-label="Set type"
          value={type}
          onChange={(e) => dispatch(setType(e.target.value))}
          className={styles.select}
          sx={{ marginRight: 2 }}
        >
          {partsOfSpeech.map((t) => (
            <MenuItem key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </MenuItem>
          ))}
        </Select>
        <InputLabel htmlFor="key">Word</InputLabel>
        {type !== "" && options ? (
          <Autocomplete
            sx={{ marginRight: 2, width: 300 }}
            disableListWrap
            PopperComponent={StyledPopper}
            value={key}
            onChange={(_, value) => setKey(value || "")}
            options={options}
            renderInput={(params) => <TextField {...params} />}
            ListboxComponent={ListboxComponent}
            freeSolo
            renderOption={(props, option) => [props, option] as React.ReactNode}
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
          sx={{ marginRight: 2 }}
          className={styles.button}
          aria-label="Add Word"
          onClick={submit}
          variant="contained"
          disabled={
            !key || key.length === 0 || words.some((x) => x.word === key)
          }
        >
          Add Word
        </Button>
        {words.some((x) => x.word === key) && (
          <p style={{ color: "red" }}>Word is already in dictionary</p>
        )}
      </div>
      <Grid container direction="column" spacing={1} alignItems="flex-end">
        <Grid item container justifyContent="flex-end" alignItems="center">
          <Box sx={{ marginRight: 2 }}>
            <LoginButton />
          </Box>
          <SettingsDialog />
        </Grid>
        <Grid item>
          <OutlinedInput
            placeholder="Search"
            endAdornment={
              <IconButton>
                <Close />
              </IconButton>
            }
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
        </Grid>
      </Grid>
    </div>
  );
}
