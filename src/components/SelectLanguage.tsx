import { InputLabel, MenuItem, Select } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  LANGUAGE_OPTIONS,
  selectSettings,
  setLanguage,
} from "../features/settings/settingsSlice";

export const SelectLanguage = () => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  return (
    <>
      <InputLabel id="label" sx={{ marginRight: 1 }}>
        Language
      </InputLabel>
      <Select
        sx={{ minWidth: "6rem" }}
        labelId="label"
        id="select"
        value={settings.language}
        onChange={(e) => dispatch(setLanguage(e.target.value))}
      >
        <MenuItem disabled value="">
          None
        </MenuItem>
        {Object.entries(LANGUAGE_OPTIONS)
          .sort()
          .map(([name, value]) => (
            <MenuItem key={value} value={value}>
              {name}
            </MenuItem>
          ))}
      </Select>
    </>
  );
};
