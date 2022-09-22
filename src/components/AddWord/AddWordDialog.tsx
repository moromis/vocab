import { Close } from "@mui/icons-material";
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
import { AddWord } from "./AddWord";

export const AddWordDialog = ({ fullWidth }: { fullWidth?: boolean }) => {
  const [addwordDialogOpen, setAddWordDialogOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setAddWordDialogOpen(true);
  };

  const handleClose = () => {
    setAddWordDialogOpen(false);
  };

  return (
    <>
      <Button
        id="add-word-button"
        onClick={handleOpen}
        aria-controls={addwordDialogOpen ? "add-word-dialog" : undefined}
        aria-haspopup="true"
        aria-expanded={addwordDialogOpen ? "true" : undefined}
        variant="contained"
        fullWidth={fullWidth}
      >
        Add Words
      </Button>
      <Dialog
        fullScreen
        open={addwordDialogOpen}
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
              Add Words
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Done
            </Button>
          </Toolbar>
        </AppBar>
        <AddWord />
      </Dialog>
    </>
  );
};
