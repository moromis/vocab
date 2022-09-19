import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAppSelector } from "../../app/hooks";
import { Word } from "./Word";
import "./Words.module.css";
import { selectWords } from "./wordsSlice";

export function Words() {
  const words = useAppSelector(selectWords);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Language</TableCell>
          <TableCell>Part of Speech</TableCell>
          <TableCell>Word</TableCell>
          <TableCell>Definition</TableCell>
          <TableCell>Link</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.entries(words).map(([key, value]) => (
          <Word key={key} name={key} info={value} />
        ))}
      </TableBody>
    </Table>
  );
}
