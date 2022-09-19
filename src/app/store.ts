import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import searchReducer from "../features/search/searchSlice";
import settingsReducer from "../features/settings/settingsSlice";
import wordsReducer from "../features/words/wordsSlice";
import { loadState, saveState } from "./store.logic";

export const store = configureStore({
  reducer: {
    words: wordsReducer,
    settings: settingsReducer,
    search: searchReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  const state = store.getState();
  saveState(state);
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
