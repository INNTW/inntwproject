/**
 * Vestaboard character set and encoding.
 * Based on official Vestaboard character codes.
 */

export const BLANK = 0;

const CODE_TO_CHAR: Record<number, string> = {
  0: " ",
  1: "A", 2: "B", 3: "C", 4: "D", 5: "E", 6: "F", 7: "G", 8: "H", 9: "I", 10: "J",
  11: "K", 12: "L", 13: "M", 14: "N", 15: "O", 16: "P", 17: "Q", 18: "R", 19: "S", 20: "T",
  21: "U", 22: "V", 23: "W", 24: "X", 25: "Y", 26: "Z",
  27: "1", 28: "2", 29: "3", 30: "4", 31: "5", 32: "6", 33: "7", 34: "8", 35: "9", 36: "0",
  37: "!", 38: "@", 39: "#", 40: "$", 41: "(", 42: ")",
  44: "-", 46: "+", 47: "&", 48: "=", 49: ";", 50: ":",
  52: "'", 53: '"', 54: "%", 55: ",", 56: ".",
  59: "/", 60: "?", 62: "°",
};

const CHAR_TO_CODE: Record<string, number> = {};
for (const [code, char] of Object.entries(CODE_TO_CHAR)) {
  CHAR_TO_CODE[char] = Number(code);
}

// Letters only: A(1) through Z(26)
const LETTER_SEQUENCE: number[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26,
];

// Punctuation cycle: period(56), question mark(60), exclamation(37)
const PUNCTUATION_SEQUENCE: number[] = [56, 60, 37];

const LETTER_CODES = new Set(LETTER_SEQUENCE);
const PUNCTUATION_CODES = new Set(PUNCTUATION_SEQUENCE);

const PUNCTUATION_INDEX: Map<number, number> = new Map();
PUNCTUATION_SEQUENCE.forEach((code, index) => {
  PUNCTUATION_INDEX.set(code, index);
});

// Legacy export (kept for compatibility)
export const FLIP_SEQUENCE: number[] = [
  0,
  ...LETTER_SEQUENCE,
  27, 28, 29, 30, 31, 32, 33, 34, 35, 36,
  37, 38, 39, 40, 41, 42,
  44, 46, 47, 48, 49, 50,
  52, 53, 54, 55, 56,
  59, 60, 62,
];

export function charToCode(char: string): number {
  if (char.length === 0) return BLANK;
  const upper = char.toUpperCase();
  return CHAR_TO_CODE[upper] ?? BLANK;
}

export function codeToChar(code: number): string {
  return CODE_TO_CHAR[code] ?? " ";
}

/**
 * Calculate the flip path between two character codes.
 *
 * Letters get 14-18 intermediate random A-Z characters before the target.
 * Punctuation gets 6-8 cycles through . ? ! before landing.
 * The animation speed per step is handled by transitionTo (deceleration curve).
 */
export function calculateFlipPath(fromCode: number, toCode: number): number[] {
  if (fromCode === toCode) return [];

  // Letters: many intermediate flips for the deceleration effect
  if (LETTER_CODES.has(toCode)) {
    const steps: number[] = [];
    const numFlips = 14 + Math.floor(Math.random() * 5); // 14-18 intermediate letters

    for (let i = 0; i < numFlips; i++) {
      let randomCode: number;
      do {
        randomCode = LETTER_SEQUENCE[Math.floor(Math.random() * LETTER_SEQUENCE.length)];
      } while (
        randomCode === toCode ||
        (steps.length > 0 && randomCode === steps[steps.length - 1])
      );
      steps.push(randomCode);
    }

    steps.push(toCode);
    return steps;
  }

  // Punctuation: more cycles for the deceleration to feel right
  if (PUNCTUATION_CODES.has(toCode)) {
    const steps: number[] = [];
    const toIdx = PUNCTUATION_INDEX.get(toCode) ?? 0;
    const numCycles = 6 + Math.floor(Math.random() * 3); // 6-8 cycles
    let idx = (toIdx + 1) % PUNCTUATION_SEQUENCE.length;

    for (let i = 0; i < numCycles; i++) {
      steps.push(PUNCTUATION_SEQUENCE[idx]);
      idx = (idx + 1) % PUNCTUATION_SEQUENCE.length;
    }

    steps.push(toCode);
    return steps;
  }

  // Blank/other: direct
  if (toCode === BLANK) return [BLANK];
  return [toCode];
}
