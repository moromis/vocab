import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export const getCommonWordsFromLanguage = (l: string) => {
  return import(`../../data/${l}`).then((module) => module.default);
};

export interface ViewState {
  current: string;
}

const initialState: ViewState = {
  current: "all",
};

export const viewSlice = createSlice({
  name: "view",
  initialState,
  reducers: {
    setCurrentView: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
    },
  },
});

export const { setCurrentView } = viewSlice.actions;

export const selectCurrentView = (state: RootState) => state.view.current;

export default viewSlice.reducer;
