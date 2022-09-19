import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

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
