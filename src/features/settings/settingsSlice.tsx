import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export const LANGUAGE_OPTIONS = {
  Estonian: "estonian",
  Czech: "czech",
  Catalan: "catalan",
  Afrikaans: "afrikaans",
  Thai: "thai",
  Russian: "russian",
  Farsi: "farsi",
  Finnish: "finnish",
  Macedonian: "macedonian",
  Esperanto: "esperanto",
  Spanish: "spanish",
  Vietnamese: "vietnamese",
  Hungarian: "hungarian",
  Hindi: "hindi",
  Turkish: "turkish",
  Greek: "greek",
  Swedish: "swedish",
  Japanese: "japanese",
  German: "german",
  Latvian: "latvian",
  Ukrainian: "ukrainian",
  Slovak: "slovak",
  Serbian: "serbian",
  Italian: "italian",
  Danish: "danish",
  Bulgarian: "bulgarian",
  Korean: "korean",
  Chinese: "chinese",
  Polish: "polish",
  Languages: "languages",
  French: "french",
  Kazakh: "kazakh",
  Norwegian: "norwegian",
  Romanian: "romanian",
  Portuguese: "portuguese",
  Indonesian: "indonesian",
  Slovenian: "slovenian",
  Arabic: "arabic",
  Lithuanian: "lithuanian",
  Dutch: "dutch",
  Bengali: "bengali",
  Hebrew: "hebrew",
  English: "english",
  Albanian: "albanian",
};

export const LANGUAGE_TO_KEY = {
  [LANGUAGE_OPTIONS.Italian]: "it",
  [LANGUAGE_OPTIONS.German]: "de",
  [LANGUAGE_OPTIONS.French]: "fr",
};

export const getCommonWordsFromLanguage = (l: string) => {
  return import(`../../data/${l}`).then((module) => module.default);
};

export interface CounterState {
  language: string;
  authToken: string | null;
}

const initialState: CounterState = {
  language: "",
  authToken: null,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setAuthToken: (state, action: PayloadAction<string | null>) => {
      state.authToken = action.payload;
    },
  },
});

export const { setLanguage, setAuthToken } = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
export const selectLanguage = (state: RootState) => state.settings.language;
export const selectAuthToken = (state: RootState) => state.settings.authToken;

export default settingsSlice.reducer;
