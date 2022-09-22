import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as R from "ramda";
import { RootState } from "../../app/store";
import { WordType } from "./words.types";

export const partsOfSpeech = [
  "unknown",
  "verb",
  "adverb",
  "noun",
  "adjective",
  "preposition",
];

export interface WordsState {
  words: WordType[];
  selectedType: string;
}

const initialState: WordsState = {
  words: [],
  selectedType: partsOfSpeech[0],
};

export const wordsSlice = createSlice({
  name: "words",
  initialState,
  reducers: {
    addWord: (state, action: PayloadAction<WordType>) => {
      if (
        !state.words.some(
          (x) =>
            x.word === action.payload.word &&
            x.language === action.payload.language
        )
      )
        state.words = [...state.words, action.payload];
    },
    changeWord: (state, action: PayloadAction<WordType>) => {
      const oldWords = R.clone(state.words);
      state.words = [
        ...oldWords.filter(
          (x) =>
            !(
              x.word === action.payload.word &&
              x.language === action.payload.language
            )
        ),
        action.payload,
      ];
    },
    removeWord: (state, action: PayloadAction<string>) => {
      state.words = state.words.filter((x) => x.word !== action.payload);
    },
    clearWords: (state) => {
      state.words = [];
    },
    setType: (state, action: PayloadAction<string>) => {
      state.selectedType = action.payload;
    },
    clearAllDefinitions: (state) => {
      state.words = state.words.map((x) => R.omit(["definition"], x));
    },
  },
});

export const {
  addWord,
  changeWord,
  removeWord,
  clearWords,
  setType,
  clearAllDefinitions,
} = wordsSlice.actions;

export const selectWords = (state: RootState) => state.words.words;
export const selectType = (state: RootState) => state.words.selectedType;

export default wordsSlice.reducer;
