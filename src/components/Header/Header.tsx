import { Close } from "@mui/icons-material";
import {
  Grid,
  IconButton,
  OutlinedInput,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Box } from "@mui/system";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSearch, setSearch } from "../../features/search/searchSlice";
import { AddWordDialog } from "../AddWord/AddWordDialog";
import { LoginButton } from "../LoginButton/LoginButton";
import { SettingsDialog } from "../Settings/SettingsDialog";

export function Header() {
  const search = useAppSelector(selectSearch);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.only("xs"));

  const AddWords = (
    <Grid
      item
      container
      xs={12}
      md={6}
      sx={{ justifyContent: { xs: "center", md: "flex-start" } }}
    >
      <AddWordDialog fullWidth={isSmallScreen} />
    </Grid>
  );

  return (
    <Grid
      container
      sx={{
        padding: "2rem",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {!isSmallScreen && AddWords}
      <Grid
        item
        xs={12}
        md={6}
        container
        direction="column"
        alignItems="flex-end"
        sx={{ marginBottom: { xs: 2, md: 0 } }}
      >
        <Grid
          item
          container
          justifyContent="flex-end"
          alignItems="center"
          sx={{ marginBottom: 2 }}
        >
          <Box sx={{ marginRight: 2 }}>
            <LoginButton />
          </Box>
          <SettingsDialog />
        </Grid>
        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: { xs: "center", md: "flex-end" },
            width: "100%",
          }}
        >
          <OutlinedInput
            fullWidth={isSmallScreen}
            placeholder="Search"
            endAdornment={
              <IconButton>
                <Close />
              </IconButton>
            }
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
          />
        </Grid>
      </Grid>
      {isSmallScreen && AddWords}
    </Grid>
  );
}
