import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
} from "@mui/material";
import Fuse from "fuse.js";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSearch } from "../search/searchSlice";
import { selectWordsPerPage, setWordsPerPage } from "../settings/settingsSlice";
import { EnhancedTableHead } from "./EnhancedTableHead";
import { getComparator } from "./getComparator";
import { Word } from "./Word";
import "./Words.module.css";
import { WordType } from "./words.types";
import {
  selectOrderBy,
  selectOrdering,
  selectWords,
  setOrderBy,
  setOrdering,
} from "./wordsSlice";

const fuseOptions: Fuse.IFuseOptions<WordType> = {
  keys: ["word", "definition"],
  threshold: 0.1,
};

export function Words({ language }: { language?: string }) {
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectOrdering);
  const orderBy = useAppSelector(selectOrderBy);
  const words = useAppSelector(selectWords);
  const search = useAppSelector(selectSearch);
  const wordsPerPage = useAppSelector(selectWordsPerPage);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof WordType
  ) => {
    const isAsc = orderBy === property && order === "asc";
    dispatch(setOrdering(isAsc ? "desc" : "asc"));
    dispatch(setOrderBy(property));
  };

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
    console.log("setting to ", parseInt(event.target.value, 10));
    dispatch(setWordsPerPage(parseInt(event.target.value, 10)));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
            rowCount={filteredWords.length}
          />
          {filteredWords.length ? (
            <TableBody>
              {(wordsPerPage > 0
                ? filteredWords.slice(
                    page * wordsPerPage,
                    page * wordsPerPage + wordsPerPage
                  )
                : filteredWords
              )
                .sort(getComparator<WordType>(order, orderBy))
                .map((word) => (
                  <Word key={word.word} wordInfo={word} />
                ))}
            </TableBody>
          ) : null}
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
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
