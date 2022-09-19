import { useAppSelector } from "../../app/hooks";
import { Word } from "./Word";
import "./Words.module.css";
import { selectWords } from "./wordsSlice";

export function Words() {
  const words = useAppSelector(selectWords);

  return (
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Word</th>
          <th>Definition</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(words).map(([key, value]) => (
          <Word key={key} name={key} info={value} />
        ))}
      </tbody>
    </table>
  );
}
