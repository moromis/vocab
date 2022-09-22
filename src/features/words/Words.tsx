import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import Fuse from "fuse.js";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSearch } from "../search/searchSlice";
import { selectWordsPerPage, setWordsPerPage } from "../settings/settingsSlice";
import { Word } from "./Word";
import "./Words.module.css";
import { selectWords } from "./wordsSlice";

const fuseOptions = {
  // Search in `author` and in `tags` array
  keys: ["word", "type", "definition", "valuelanguage"],
};

export function Words({ language }: { language?: string }) {
  const dispatch = useAppDispatch();
  const words = useAppSelector(selectWords);
  const search = useAppSelector(selectSearch);
  const wordsPerPage = useAppSelector(selectWordsPerPage);

  let filteredWords = words;
  if (search.length) {
    const fuse = new Fuse(words, fuseOptions);
    filteredWords = fuse.search(search).map((x) => x.item);
  }
  filteredWords = filteredWords.filter((x) =>
    language ? x.language === language : true
  );

  const [page, setPage] = useState(0);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(setWordsPerPage(parseInt(event.target.value, 10)));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ background: "dark-grey" }}>
              <TableCell>Language</TableCell>
              <TableCell>Part of Speech</TableCell>
              <TableCell>Word</TableCell>
              <TableCell>Definition</TableCell>
              <TableCell>Link</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          {filteredWords.length ? (
            <TableBody>
              {filteredWords
                .slice(page * wordsPerPage, page * wordsPerPage + wordsPerPage)
                .map((word) => (
                  <Word key={word.word} wordInfo={word} />
                ))}
            </TableBody>
          ) : null}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={Object.values(filteredWords).length || 0}
        rowsPerPage={wordsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
