export type CharCode = number;

/** 6x22 grid of character codes */
export type BoardState = CharCode[][];

export interface ContentItem {
  id: string;
  type: "quote";
  lines: string[];
}