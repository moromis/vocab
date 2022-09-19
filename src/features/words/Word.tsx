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
import { ISO_LANGUAGE_CODES } from "../settings/settings.const";
import { selectSettings, setAuthToken } from "../settings/settingsSlice";
import { WordType } from "./words.types";
import { changeWord, removeWord } from "./wordsSlice";

export const Word = ({ wordInfo }: { wordInfo: WordType }) => {
  const { definition, language, type, word } = wordInfo;
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  useEffect(() => {
    if (settings.authToken && !definition && (language || settings.language)) {
      // get definition
      fetch("https://translation.googleapis.com/language/translate/v2", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${settings.authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: ISO_LANGUAGE_CODES[language || settings.language],
          target: "en",
          q: word,
          format: "text",
        }),
      })
        .then((res) => {
          res.json().then((jsonData) => {
            const definition = jsonData.data.translations[0].translatedText;
            dispatch(
              changeWord({
                ...wordInfo,
                definition,
                language:
                  settings.language && settings.language.length
                    ? settings.language
                    : null,
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
    dispatch(removeWord(word));
  };

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  return (
    <StyledTableRow>
      <TableCell>{titleCase(language || "")}</TableCell>
      <TableCell>{titleCase(type)}</TableCell>
      <TableCell>{word}</TableCell>
      <TableCell sx={{ ...(definition ? {} : { justifyContent: "center" }) }}>
        {definition || (
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
            ISO_LANGUAGE_CODES[language || settings.language]
          }&tl=en&text=${word}&op=translate`}
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
