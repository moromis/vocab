import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import Fuse from "fuse.js";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectSearch } from "../search/searchSlice";
import { selectWordsPerPage, setWordsPerPage } from "../settings/settingsSlice";
import { Word } from "./Word";
import "./Words.module.css";
import { WordType } from "./words.types";
import {
  Order,
  selectOrderBy,
  selectOrdering,
  selectWords,
  setOrderBy,
  setOrdering,
} from "./wordsSlice";

const fuseOptions = {
  // Search in `author` and in `tags` array
  keys: ["word", "type", "definition", "value", "language"],
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<T>(
  order: Order,
  orderBy: keyof T
): (a: T, b: T) => number {
  return order === "desc"
    ? (a, b) => descendingComparator<T>(a, b, orderBy)
    : (a, b) => -descendingComparator<T>(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof WordType;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "added",
    numeric: false,
    disablePadding: false,
    label: "Date Added",
  },
  {
    id: "language",
    numeric: false,
    disablePadding: false,
    label: "Language",
  },
  {
    id: "type",
    numeric: false,
    disablePadding: false,
    label: "Part of Speech",
  },
  {
    id: "word",
    numeric: false,
    disablePadding: false,
    label: "Word",
  },
  {
    id: "definition",
    numeric: false,
    disablePadding: false,
    label: "Definition",
  },
];
interface EnhancedTableProps {
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof WordType
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof WordType) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
        <TableCell>Link</TableCell>
        <TableCell align="center">Delete</TableCell>
      </TableRow>
    </TableHead>
  );
}

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
