import { gapi } from "gapi-script";
import { useEffect } from "react";
import { GOOGLE_API_SCOPES } from "./App.const";
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
          scope: GOOGLE_API_SCOPES.join(" "),
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
