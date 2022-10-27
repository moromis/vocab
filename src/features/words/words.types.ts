export type Order = "asc" | "desc";

export type WordType = {
  added: number;
  type: string;
  word: string;
  definition?: string;
  language: string | null;
};
