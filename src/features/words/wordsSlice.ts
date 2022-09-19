import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { WordInfo } from "./words.types";

export const partsOfSpeech = [
  "unknown",
  "verb",
  "adverb",
  "noun",
  "adjective",
  "preposition",
];

export interface WordsState {
  words: Record<string, WordInfo>;
  selectedType: string;
}

const initialState: WordsState = {
  words: {},
  selectedType: partsOfSpeech[0],
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
    clearWords: (state) => {
      state.words = {};
    },
    setType: (state, action: PayloadAction<string>) => {
      state.selectedType = action.payload;
    },
  },
});

export const { addWord, removeWord, clearWords, setType } = wordsSlice.actions;

export const selectWords = (state: RootState) => state.words.words;
export const selectType = (state: RootState) => state.words.selectedType;

export default wordsSlice.reducer;
