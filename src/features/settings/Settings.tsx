import { GoogleLogin, useGoogleLogout } from "@leecheuk/react-google-login";
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
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { store } from "../../app/store";
import { clearLocalStorage, loadStateFromGoogle } from "../../app/store.logic";
import { SelectLanguage } from "../../components/SelectLanguage";
import { clearWords } from "../words/wordsSlice";
import { GOOGLE_CLIENT_ID } from "./settings.const";
import { selectSettings, setAuthToken } from "./settingsSlice";

export const Settings = () => {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();
  const [checkSureDialogOpen, setCheckSureDialogOpen] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const checkSureDialogCallback = useRef<any>(null);

  const onSuccess = (res: any) => {
    console.log("success:", res);
    dispatch(setAuthToken(res.accessToken));
    loadStateFromGoogle(store.getState(), store.dispatch);
  };
  const onFailure = (err: any) => {
    console.log("failed:", err);
  };

  const logoutSuccess = () => {
    console.log("logged out");
    dispatch(setAuthToken(null));
  };
  const logoutFailure = () => {
    console.log("logout failed");
  };
  const { signOut } = useGoogleLogout({
    clientId: GOOGLE_CLIENT_ID,
    onLogoutSuccess: logoutSuccess,
    onFailure: logoutFailure,
  });

  const logout = () => {
    signOut();
  };

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
          {settings.authToken === null ? (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Sign in with Google"
              onSuccess={onSuccess}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
              isSignedIn={true}
            />
          ) : (
            <Button onClick={logout}>Logout</Button>
          )}
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
                  logout();
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
