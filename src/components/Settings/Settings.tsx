import { useGoogleLogout } from "@leecheuk/react-google-login";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { clearLocalStorage } from "../../app/store.logic";
import { GOOGLE_CLIENT_ID } from "../../features/settings/settings.const";
import { clearWords } from "../../features/words/wordsSlice";
import { LoginButton } from "../LoginButton/LoginButton";
import { SelectLanguage } from "../SelectLanguage";

export const Settings = () => {
  const dispatch = useAppDispatch();
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
        <Grid item>
          <SelectLanguage />
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
