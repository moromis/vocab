import { GoogleLogin, useGoogleLogout } from "@leecheuk/react-google-login";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { GOOGLE_CLIENT_ID } from "../../features/settings/settings.const";
import {
  selectSettings,
  setAuthToken,
} from "../../features/settings/settingsSlice";

export const LoginButton = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  const onSuccess = (res: any) => {
    console.log("success:", res);
    dispatch(setAuthToken(res.accessToken));
    // loadStateFromGoogle(store.getState(), store.dispatch);
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

  return settings.authToken === null ? (
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
  );
};
