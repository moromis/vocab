import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import counterReducer from "../features/words/wordsSlice";
import { loadState, saveState } from "./store.logic";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
  preloadedState: loadState(),
});

store.subscribe(() => {
  saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
