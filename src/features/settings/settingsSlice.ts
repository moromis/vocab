import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export const getCommonWordsFromLanguage = (l: string) => {
  return import(`../../data/${l}`).then((module) => module.default);
};

export interface SettingsState {
  nativeLanguage: string;
  vocabLanguage: string;
  authToken: string | null;
  wordsPerPage: number;
}

const initialState: SettingsState = {
  nativeLanguage: "",
  vocabLanguage: "",
  authToken: null,
  wordsPerPage: 5,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setNativeLanguage: (state, action: PayloadAction<string>) => {
      state.nativeLanguage = action.payload;
    },
    setVocabularyLanguage: (state, action: PayloadAction<string>) => {
      state.vocabLanguage = action.payload;
    },
    setAuthToken: (state, action: PayloadAction<string | null>) => {
      state.authToken = action.payload;
    },
    setWordsPerPage: (state, action: PayloadAction<number>) => {
      state.wordsPerPage = action.payload;
    },
  },
});

export const {
  setNativeLanguage,
  setVocabularyLanguage,
  setAuthToken,
  setWordsPerPage,
} = settingsSlice.actions;

export const selectSettings = (state: RootState) => state.settings;
export const selectNativeLanguage = (state: RootState) =>
  state.settings.nativeLanguage;
export const selectVocabLanguage = (state: RootState) =>
  state.settings.vocabLanguage;
export const selectAuthToken = (state: RootState) => state.settings.authToken;
export const selectWordsPerPage = (state: RootState) =>
  state.settings.wordsPerPage;

export default settingsSlice.reducer;
