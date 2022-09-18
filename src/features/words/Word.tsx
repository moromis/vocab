import { WordInfo } from "./words.types";

export const Word = ({ name, info }: { name: string; info: WordInfo }) => {
  return (
    <tr>
      <td>{info.type}</td>
      <td>{name}</td>
      <td>{info.definition}</td>
    </tr>
  );
};
