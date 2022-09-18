import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export const LANGUAGES = {
  Italian: "it",
};

interface LanguagesMap {
  [x: string]: () => Promise<string[]>;
}

export const LANGUAGES_MAP: LanguagesMap = {
  [LANGUAGES.Italian]: () =>
    import("../../data/it/words").then((module) => module.default),
};

export interface CounterState {
  language: string;
}

const initialState: CounterState = {
  language: "",
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const { setLanguage } = settingsSlice.actions;

export const selectLanguage = (state: RootState) => state.settings.language;

export default settingsSlice.reducer;
