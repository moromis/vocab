import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { WordInfo } from "./words.types";

export const wordTypes = ["verb", "adverb", "noun", "adjective", "preposition"];

export interface WordsState {
  words: Record<string, WordInfo>;
  selectedType: string;
}

const initialState: WordsState = {
  words: {},
  selectedType: wordTypes[0],
};

export const wordsSlice = createSlice({
  name: "words",
  initialState,
  reducers: {
    addWord: (
      state,
      action: PayloadAction<{ key: string; value: WordInfo }>
    ) => {
      const { key, value } = action.payload;
      state.words[key] = value;
    },
    removeWord: (state, action: PayloadAction<string>) => {
      delete state.words[action.payload];
    },
    setType: (state, action: PayloadAction<string>) => {
      state.selectedType = action.payload;
    },
  },
});

export const { addWord, removeWord, setType } = wordsSlice.actions;

export const selectWords = (state: RootState) => state.words.words;
export const selectType = (state: RootState) => state.words.selectedType;

export default wordsSlice.reducer;
