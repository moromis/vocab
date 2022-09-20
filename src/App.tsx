import { Tab, Tabs } from "@mui/material";
import { Box } from "@mui/system";
import { gapi } from "gapi-script";
import * as R from "ramda";
import { useEffect, useMemo } from "react";
import { GOOGLE_API_SCOPES } from "./App.const";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { Header } from "./components/Header/Header";
import { TabPanel } from "./components/TabPanel";
import { GOOGLE_CLIENT_ID } from "./features/settings/settings.const";
import { selectAuthToken } from "./features/settings/settingsSlice";
import { selectCurrentView, setCurrentView } from "./features/view/viewSlice";
import { Words } from "./features/words/Words";
import { selectWords } from "./features/words/wordsSlice";

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function App() {
  const dispatch = useAppDispatch();
  const authToken = useAppSelector(selectAuthToken);
  const currentView = useAppSelector(selectCurrentView);
  const words = useAppSelector(selectWords);

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

  const uniqueLanguages: string[] = useMemo(
    () =>
      R.uniqBy((x) => x.language, words)
        .map((x) => x.language)
        .filter((x) => x !== null) as string[],
    [words]
  );

  const selectedTab = useMemo(
    () => uniqueLanguages.findIndex((x) => x === currentView) + 1,
    [uniqueLanguages, currentView]
  );

  return (
    <div className="App">
      <Header />
      <Box sx={{ bgcolor: "background.paper", display: "flex" }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={selectedTab}
          onChange={(e: any) => {
            dispatch(setCurrentView(e.target.textContent));
          }}
          aria-label="Language tabs"
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          <Tab label="All" {...a11yProps(0)} />
          {uniqueLanguages.map((x, i) => (
            <Tab key={`tab-${x}`} label={x} {...a11yProps(i + 1)} />
          ))}
        </Tabs>
        <TabPanel value={selectedTab} index={0}>
          <Words />
        </TabPanel>
        {uniqueLanguages.map((x, i) => (
          <TabPanel key={`tab-panel-${x}`} value={selectedTab} index={i + 1}>
            <Words language={x} />
          </TabPanel>
        ))}
      </Box>
    </div>
  );
}

export default App;
