import { Close, Settings as SettingsIcon } from "@mui/icons-material";
import {
  AppBar,
  Button,
  Dialog,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { CustomTransition } from "../CustomTransition";
import { Settings } from "../Settings/Settings";

export const SettingsDialog = () => {
  const [settingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setSettingsDialogOpen(true);
  };

  const handleClose = () => {
    setSettingsDialogOpen(false);
  };

  return (
    <>
      <IconButton
        id="settings-button"
        onClick={handleOpen}
        aria-controls={settingsDialogOpen ? "settings-dialog" : undefined}
        aria-haspopup="true"
        aria-expanded={settingsDialogOpen ? "true" : undefined}
      >
        <SettingsIcon fontSize="large" />
      </IconButton>
      <Dialog
        fullScreen
        open={settingsDialogOpen}
        onClose={handleClose}
        TransitionComponent={CustomTransition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Settings
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Done
            </Button>
          </Toolbar>
        </AppBar>
        <Settings />
      </Dialog>
    </>
  );
};
