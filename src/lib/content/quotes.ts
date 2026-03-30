import type { ContentItem } from "@/types";

/**
 * ============================================================
 *  INNTW QUOTES — EDIT THIS FILE TO CHANGE THE DISPLAY
 * ============================================================
 *
 *  RULES:
 *  - Each quote has 6 lines (rows on the board)
 *  - Each line can be MAX 22 characters (columns on the board)
 *  - ALL TEXT MUST BE UPPERCASE
 *  - Use spaces at the start of lines to indent/position text
 *  - Empty strings "" create blank rows
 *  - You can add or remove quotes freely
 *
 *  SUPPORTED CHARACTERS:
 *  A-Z  0-9  ! @ # $ ( ) - + & = ; : ' " % , . / ? °
 * ============================================================
 */

export const QUOTES: ContentItem[] = [
  {
    id: "believe-more",
    type: "quote",
    lines: [
      " FOR THE PEOPLE WHO",
      " STILL BELIEVE",
      " THEY CAN",
      " BE MORE.",      "",
      "",
    ],
  },
  {
    id: "words-ideas-dreams",
    type: "quote",
    lines: [
      " FOR THE WORDS,",
      " IDEAS, AND DREAMS",
      " YOU WILL BUILD.",
      "",
      "",
      "",
    ],
  },
  {
    id: "tired-of-waiting",
    type: "quote",
    lines: [
      " FOR EVERYONE",
      " TIRED OF WAITING",
      " FOR THE",
      " RIGHT TIME.",
      "",
      "",
    ],
  },  {
    id: "ready-to-become",
    type: "quote",
    lines: [
      " FOR THE ONES",
      " READY TO BECOME",
      " WHO THEY SAID",
      " THEY'D BE.",
      "",
      "",
    ],
  },
  {
    id: "right-on-time",
    type: "quote",
    lines: [
      "",
      " YOU'RE NOT LATE.",
      " YOU'RE RIGHT",
      " ON TIME.",
      "",
      "",
    ],
  },
  {
    id: "if-not-now",
    type: "quote",
    lines: [
      "",
      " IF NOT NOW",
      " THEN WHEN.",
      "",
      "",
      "",
    ],
  },
];