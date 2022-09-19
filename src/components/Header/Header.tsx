import { useGoogleLogin } from "@leecheuk/react-google-login";
import { Close, Settings as SettingsIcon } from "@mui/icons-material";
import {
  AppBar,
  Autocomplete,
  autocompleteClasses,
  Button,
  Dialog,
  IconButton,
  InputLabel,
  MenuItem,
  Popper,
  Select,
  styled,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Settings } from "../../features/settings/Settings";
import { GOOGLE_CLIENT_ID } from "../../features/settings/settings.const";
import {
  getCommonWordsFromLanguage,
  selectSettings,
  setAuthToken,
} from "../../features/settings/settingsSlice";
import {
  addWord,
  partsOfSpeech,
  selectType,
  selectWords,
  setType,
} from "../../features/words/wordsSlice";
import { SelectLanguage } from "../SelectLanguage";
import styles from "./Header.module.css";
import { ListboxComponent } from "./ListboxComponent";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  const { language, authToken } = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  const [key, setKey] = useState("");
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<string[] | null>(null);

  useEffect(() => {
    if (language && language.length) {
      getCommonWordsFromLanguage(language).then((res: any) => {
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
    dispatch(
      addWord({
        key,
        value: {
          type,
          language: language && language.length ? language : null,
        },
      })
    );
  };

  const onLoginSuccess = (res: any) => {
    if (!authToken) {
      console.log("success:", res);
      dispatch(setAuthToken(res.accessToken));
    }
  };
  const { signIn } = useGoogleLogin({
    clientId: GOOGLE_CLIENT_ID,
    onSuccess: onLoginSuccess,
  });

  useEffect(() => {
    if (!authToken) {
      signIn();
    }
  }, []);

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
          className={styles.button}
          aria-label="Add Word"
          onClick={submit}
          variant="contained"
          disabled={!key || key.length === 0 || key in words}
        >
          Add Word
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
