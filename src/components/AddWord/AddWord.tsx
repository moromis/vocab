import {
  Autocomplete,
  autocompleteClasses,
  Button,
  InputLabel,
  MenuItem,
  Popper,
  Select,
  styled,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  getCommonWordsFromLanguage,
  selectSettings,
  setVocabularyLanguage,
} from "../../features/settings/settingsSlice";
import {
  addWord,
  partsOfSpeech,
  selectType,
  selectWords,
  setType,
} from "../../features/words/wordsSlice";
import { SelectLanguage } from "../SelectLanguage";
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

export const AddWord = () => {
  const type = useAppSelector(selectType);
  const { vocabLanguage } = useAppSelector(selectSettings);
  const words = useAppSelector(selectWords);
  const [key, setKey] = useState("");
  const [options, setOptions] = useState<string[] | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (vocabLanguage && vocabLanguage.length) {
      getCommonWordsFromLanguage(vocabLanguage).then((res: any) => {
        setOptions(res);
      });
    }
  }, [vocabLanguage]);

  const submit = () => {
    setKey("");
    dispatch(
      addWord({
        added: Date.now(),
        word: key,
        type,
        language: vocabLanguage && vocabLanguage.length ? vocabLanguage : null,
      })
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
        <SelectLanguage
          title="Language"
          language={vocabLanguage}
          onChangeCallback={(e) =>
            dispatch(setVocabularyLanguage(e.target.value))
          }
        />
      </Box>
      <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
        <InputLabel htmlFor="type" sx={{ marginRight: 2 }}>
          Part of Speech
        </InputLabel>
        <Select
          id="type"
          aria-label="Set type"
          value={type}
          onChange={(e) => dispatch(setType(e.target.value))}
          sx={{ marginBottom: 2 }}
        >
          {partsOfSpeech.map((t) => (
            <MenuItem key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
        <InputLabel htmlFor="key" sx={{ marginRight: 2 }}>
          Word
        </InputLabel>
        {type !== "" && options ? (
          <Autocomplete
            id="key"
            sx={{ marginBottom: 2, width: 300 }}
            disableListWrap
            PopperComponent={StyledPopper}
            value={key}
            onInputChange={(_, value) => setKey(value || "")}
            options={options}
            renderInput={(params) => <TextField {...params} />}
            ListboxComponent={ListboxComponent}
            freeSolo
            renderOption={(props, option) => [props, option] as React.ReactNode}
          />
        ) : (
          <TextField
            id="key"
            sx={{ marginBottom: 2 }}
            aria-label="Set word"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        )}
      </Box>
      <Button
        sx={{ marginBottom: 2 }}
        aria-label="Add Word"
        onClick={submit}
        variant="contained"
        disabled={!key || key.length === 0 || words.some((x) => x.word === key)}
      >
        Add Word
      </Button>
      {words.some((x) => x.word === key) && (
        <p style={{ color: "red" }}>Word is already in dictionary</p>
      )}
    </Box>
  );
};
