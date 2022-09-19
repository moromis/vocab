import { GoogleLogin, GoogleLogout } from "@leecheuk/react-google-login";
import { Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { gapi } from "gapi-script";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  LANGUAGES,
  selectSettings,
  setAuthToken,
  setLanguage,
} from "./settingsSlice";

const clientId =
  "704609242086-dabkajm8tj8crsgcs2lvecej4qaimi02.apps.googleusercontent.com";

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
          clientId: clientId,
          scope:
            "email profile openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/cloud-translation",
        });
      };
      gapi.load("client:auth2", initClient);
    }
  });

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
            clientId={clientId}
            buttonText="Sign in with Google"
            onSuccess={onSuccess}
            onFailure={onFailure}
            cookiePolicy={"single_host_origin"}
            isSignedIn={true}
          />
        ) : (
          <GoogleLogout clientId={clientId} />
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
          {Object.entries(LANGUAGES).map(([name, value]) => (
            <MenuItem key={value} value={value}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </Grid>
    </Grid>
  );
};
