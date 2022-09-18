import { InputLabel, MenuItem, Select } from "@mui/material";
import { Box } from "@mui/system";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { LANGUAGES, selectLanguage, setLanguage } from "./settingsSlice";

export const Settings = () => {
  const language = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ display: "flex", alignItems: "center", margin: 1 }}>
      <InputLabel id="label" sx={{ marginRight: 1 }}>
        Language
      </InputLabel>
      <Select
        labelId="label"
        id="select"
        value={language}
        onChange={(e) => dispatch(setLanguage(e.target.value))}
      >
        <MenuItem disabled value="">
          None
        </MenuItem>
        {Object.entries(LANGUAGES).map(([name, value]) => (
          <MenuItem key={value} value={value}>
            {name}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};
