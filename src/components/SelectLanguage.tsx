import { Box, InputLabel, MenuItem, Select, SelectProps } from "@mui/material";
import { LANGUAGE_OPTIONS } from "../features/settings/settings.const";

export type SelectLanguageProps = {
  language: string;
  onChangeCallback: SelectProps<string>["onChange"];
  required?: boolean;
  title: string;
};

export const SelectLanguage = ({
  language,
  onChangeCallback,
  required,
  title,
}: SelectLanguageProps) => {
  return (
    <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center" }}>
      <InputLabel id="label" sx={{ marginRight: 2 }} required={required}>
        {title}
      </InputLabel>
      <Select
        required={required}
        aria-required={required ? "true" : "false"}
        sx={{ minWidth: "6rem" }}
        labelId="label"
        id="select"
        value={language}
        onChange={onChangeCallback}
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
    </Box>
  );
};
