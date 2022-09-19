import { gapi } from "gapi-script";
import { useEffect } from "react";
import "./App.css";
import { useAppSelector } from "./app/hooks";
import { Header } from "./components/Header/Header";
import { GOOGLE_CLIENT_ID } from "./features/settings/settings.const";
import { selectAuthToken } from "./features/settings/settingsSlice";
import { Words } from "./features/words/Words";

function App() {
  const authToken = useAppSelector(selectAuthToken);

  // load gapi
  useEffect(() => {
    if (authToken === null) {
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

  return (
    <div className="App">
      <Header />
      <Words />
    </div>
  );
}

export default App;
