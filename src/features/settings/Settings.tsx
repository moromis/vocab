import { GoogleLogin, useGoogleLogout } from "@leecheuk/react-google-login";
import { Button, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { gapi } from "gapi-script";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { GOOGLE_CLIENT_ID } from "./settings.const";
import {
  LANGUAGE_OPTIONS,
  selectSettings,
  setAuthToken,
  setLanguage,
} from "./settingsSlice";

export const Settings = () => {
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  const onSuccess = (res: any) => {
    console.log("success:", res);
    dispatch(setAuthToken(res.accessToken));
  };
  const onFailure = (err: any) => {
    console.log("failed:", err);
  };

  useEffect(() => {
    if (settings.authToken === null) {
      const initClient = () => {
        gapi.client.init({
          clientId: GOOGLE_CLIENT_ID,
          scope:
            "email profile openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/cloud-translation",
        });
      };
      gapi.load("client:auth2", initClient);
    }
  });

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

  return (
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
        <InputLabel id="label" sx={{ marginRight: 1 }}>
          Language
        </InputLabel>
        <Select
          labelId="label"
          id="select"
          value={settings.language}
          onChange={(e) => dispatch(setLanguage(e.target.value))}
        >
          <MenuItem disabled value="">
            None
          </MenuItem>
          {Object.entries(LANGUAGE_OPTIONS)
            .sort()
            .map(([name, value]) => (
              <MenuItem key={value} value={value}>
                {name}
              </MenuItem>
            ))}
        </Select>
      </Grid>
    </Grid>
  );
};
