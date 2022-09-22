import { useGoogleLogout } from "@leecheuk/react-google-login";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  SelectProps,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearLocalStorage } from "../../app/store.logic";
import { GOOGLE_CLIENT_ID } from "../../features/settings/settings.const";
import {
  selectSettings,
  setNativeLanguage,
  setVocabularyLanguage,
} from "../../features/settings/settingsSlice";
import {
  clearAllDefinitions,
  clearWords,
} from "../../features/words/wordsSlice";
import { LoginButton } from "../LoginButton/LoginButton";
import { SelectLanguage } from "../SelectLanguage";

export const Settings = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const [checkSureDialogOpen, setCheckSureDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const checkSureDialogCallback = useRef<any>(null);

  const checkIfSure = (message: string, callback: any) => {
    setDialogText(message);
    setCheckSureDialogOpen(true);
    checkSureDialogCallback.current = callback;
  };

  const isSure = () => {
    if (checkSureDialogCallback.current) {
      checkSureDialogCallback.current();
    }
    setCheckSureDialogOpen(false);
    checkSureDialogCallback.current = null;
  };

  const { signOut } = useGoogleLogout({
    clientId: GOOGLE_CLIENT_ID,
  });

  const changeNativeLanguageCallback: SelectProps<string>["onChange"] = (e) => {
    const dispatchNativeLanguage = () =>
      dispatch(setNativeLanguage(e.target.value));
    if (settings.nativeLanguage && settings.nativeLanguage.length) {
      checkIfSure(
        "If you change your native language, all definitions will be cleared and changed to the new language, proceed?",
        () => {
          dispatch(clearAllDefinitions());
          dispatchNativeLanguage();
        }
      );
    } else {
      dispatchNativeLanguage();
    }
  };

  return (
    <>
      <Dialog open={checkSureDialogOpen}>
        <DialogTitle>Are You Sure?</DialogTitle>
        <DialogContent>{dialogText}</DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setCheckSureDialogOpen(false)}
          >
            No
          </Button>
          <Button onClick={isSure}>Yes</Button>
        </DialogActions>
      </Dialog>
      <Grid
        sx={{
          alignItems: "center",
          margin: "auto",
        }}
        direction="column"
        container
        spacing={2}
      >
        <Grid item>
          <LoginButton />
        </Grid>
        <Grid
          item
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {!settings.nativeLanguage.length && (
            <Typography color="red" sx={{ marginBottom: 2 }}>
              {`Please select your native language
            Don't see it? Email me at `}
              <a href="mailto:themoromis@gmail.com">themoromis@gmail.com</a>
            </Typography>
          )}
          <SelectLanguage
            title="Native Language (I know...)"
            language={settings.nativeLanguage}
            onChangeCallback={changeNativeLanguageCallback}
            required
          />
        </Grid>
        <Grid item>
          <SelectLanguage
            title="Vocabulary Language (I'm learning...)"
            language={settings.vocabLanguage}
            onChangeCallback={(e) =>
              dispatch(setVocabularyLanguage(e.target.value))
            }
          />
        </Grid>
        <Grid item sx={{ marginTop: 4 }}>
          <Typography color="red">Danger Zone</Typography>
        </Grid>
        <Grid item sx={{ width: "100%" }}>
          <Divider />
        </Grid>
        <Grid item>
          <Button
            color="error"
            onClick={() =>
              checkIfSure(
                "Are you sure you want to delete ALL the vocabulary words you've added?",
                () => dispatch(clearWords())
              )
            }
          >
            Clear All Words
          </Button>
        </Grid>
        <Grid item>
          <Button
            color="error"
            onClick={() =>
              checkIfSure(
                "Are you sure you want to clear ALL APP STATE and reset to default settings? (this will also log out your Google SSO if you've logged in)",
                () => {
                  clearLocalStorage();
                  signOut();
                  window.location.reload();
                }
              )
            }
          >
            Reset App
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
