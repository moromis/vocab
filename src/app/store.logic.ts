import { AppDispatch, RootState } from "./store";

export const STORE_KEY = "MOROMIS_VOCAB_STORAGE";

export const saveState = (state: RootState) => {
  const stringifiedState = JSON.stringify(state);
  localStorage.setItem(STORE_KEY, stringifiedState);

  // fetch("https://www.googleapis.com/upload/drive/v3/files", {
  //   method: "POST",
  //   headers: {
  //     Authorization: `Bearer ${state.settings.authToken}`,
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     name: GOOGLE_DRIVE_APPDATA_FILENAME,
  //     parents: ["appDataFolder"],
  //     mimeType: "application/json",
  //     body: JSON.stringify(state),
  //     fields: "id",
  //   }),
  // })
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((e) => console.error(e));
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

export const loadStateFromGoogle = (
  state: RootState,
  dispatch: AppDispatch
) => {
  fetch(
    "https://www.googleapis.com/upload/drive/v3/files?spaces=appDataFolder",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${state.settings.authToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      console.log(res);
    })
    .catch((e) => console.error(e));
};

export const clearState = () => {
  localStorage.removeItem(STORE_KEY);
};

export const clearLocalStorage = () => {
  localStorage.clear();
};
