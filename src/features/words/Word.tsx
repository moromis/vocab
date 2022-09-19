import { Link } from "@mui/material";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSettings } from "../settings/settingsSlice";
import { WordInfo } from "./words.types";
import { addWord } from "./wordsSlice";

export const Word = ({ name, info }: { name: string; info: WordInfo }) => {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);

  useEffect(() => {
    if (settings.authToken && !info.definition) {
      // get definition
      fetch("https://translation.googleapis.com/language/translate/v2", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${settings.authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source: settings.language,
          target: "en",
          q: name,
          format: "text",
        }),
      }).then((res) => {
        res.json().then((jsonData) => {
          const definition = jsonData.data.translations[0].translatedText;
          dispatch(
            addWord({
              key: name,
              value: {
                ...info,
                definition,
              },
            })
          );
        });
      });
    }
  }, [settings.authToken]);

  return (
    <tr>
      <td>{info.type}</td>
      <td>{name}</td>
      <td>{info.definition}</td>
      <td>
        <Link
          href={`https://translate.google.com/?sl=it&tl=en&text=${name}&op=translate`}
          target="_blank"
        >
          Translation
        </Link>
      </td>
    </tr>
  );
};
