import { useAppSelector } from "../../app/hooks";
import { Word } from "./Word";
import "./Words.module.css";
import { selectWords } from "./wordsSlice";

export function Words() {
  const words = useAppSelector(selectWords);

  return (
    <table>
      <tr>
        <th>Word</th>
        <th>Definition</th>
      </tr>
      <tbody>
        {Object.entries(words).map(([key, value]) => (
          <Word key={key} name={key} definition={value} />
        ))}
      </tbody>
    </table>
  );
}
