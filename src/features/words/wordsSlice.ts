import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface CounterState {
  words: Record<string, string>;
}

const initialState: CounterState = {
  words: {},
};

export const wordsSlice = createSlice({
  name: "words",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addWord: (state, action: PayloadAction<{ key: string; value: string }>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      const { key, value } = action.payload;
      state.words[key] = value;
    },
    removeWord: (state, action: PayloadAction<string>) => {
      delete state.words[action.payload];
    },
  },
});

export const { addWord, removeWord } = wordsSlice.actions;

export const selectWords = (state: RootState) => state.counter.words;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectWords(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

export default wordsSlice.reducer;
