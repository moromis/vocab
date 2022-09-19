import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type SearchState = string;

const initialState: SearchState = "";

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state = action.payload;
      return state;
    },
    clearSearch: (state) => {
      state = "";
      return state;
    },
  },
});

export const { setSearch, clearSearch } = searchSlice.actions;

export const selectSearch = (state: RootState) => state.search;

export default searchSlice.reducer;
