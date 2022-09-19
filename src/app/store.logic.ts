import { RootState } from "./store";

const STORE_KEY = "MOROMIS_VOCAB_STORAGE";

export const saveState = (state: RootState) => {
  const stringifiedState = JSON.stringify(state);
  localStorage.setItem(STORE_KEY, stringifiedState);
};
export const loadState = () => {
  const json = localStorage.getItem(STORE_KEY) || "{}";
  const state = JSON.parse(json);

  if (state) {
    return state;
  } else {
    return undefined; // To use the defaults in the reducers
  }
};

export const clearState = () => {
  localStorage.removeItem(STORE_KEY);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
