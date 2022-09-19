import { Close, Help } from "@mui/icons-material";
import {
  IconButton,
  Link,
  styled,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { titleCase } from "title-case";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  LANGUAGE_TO_KEY,
  selectSettings,
  setAuthToken,
} from "../settings/settingsSlice";
import { WordInfo } from "./words.types";
import { addWord, removeWord } from "./wordsSlice";

export const Word = ({ name, info }: { name: string; info: WordInfo }) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  useEffect(() => {
    if (
      settings.authToken &&
      !info.definition &&
      (info.language || settings.language)
    ) {
      // get definition
      fetch("https://translation.googleapis.com/language/translate/v2", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${settings.authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: LANGUAGE_TO_KEY[info.language || settings.language],
          target: "en",
          q: name,
          format: "text",
        }),
      })
        .then((res) => {
          res.json().then((jsonData) => {
            const definition = jsonData.data.translations[0].translatedText;
            dispatch(
              addWord({
                key: name,
                value: {
                  ...info,
                  definition,
                  language:
                    settings.language && settings.language.length
                      ? settings.language
                      : null,
                },
              })
            );
          });
        })
        .catch((e) => {
          // TODO: clear auth token only on 401, also retry or cause token refresh so this gets retried?
          console.error("failed to get translation... ", e);
          dispatch(setAuthToken(null));
        });
    }
  }, [settings.authToken]);

  const remove = () => {
    dispatch(removeWord(name));
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  return (
    <StyledTableRow>
      <TableCell>{titleCase(info.language || "")}</TableCell>
      <TableCell>{titleCase(info.type)}</TableCell>
      <TableCell>{name}</TableCell>
      <TableCell
        sx={{ ...(info.definition ? {} : { justifyContent: "center" }) }}
      >
        {info.definition || (
          <Tooltip
            title={
              <Typography sx={{ fontSize: "1rem" }}>
                Login to Google in settings to automatically add definitions
              </Typography>
            }
            arrow
          >
            <Help />
          </Tooltip>
        )}
      </TableCell>
      <TableCell>
        <Link
          href={`https://translate.google.com/?sl=${
            LANGUAGE_TO_KEY[info.language || settings.language]
          }&tl=en&text=${name}&op=translate`}
          target="_blank"
        >
          Translation
        </Link>
      </TableCell>
      <TableCell sx={{ display: "flex", justifyContent: "center" }}>
        <IconButton onClick={remove}>
          <Close />
        </IconButton>
      </TableCell>
    </StyledTableRow>
  );
};
