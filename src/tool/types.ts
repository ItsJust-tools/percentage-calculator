export type Direction = 'number' | 'roman';

export interface ToolState {
  /** Which input is active: entering an integer or a Roman numeral. */
  direction: Direction;
  /** Integer as typed by the user (empty string when untouched). */
  numberInput: string;
  /** Roman numeral as typed by the user, upper or lower case. */
  romanInput: string;
}

export const MIN_ROMAN = 1;
export const MAX_ROMAN = 3999;

export const DEFAULT_STATE: ToolState = {
  direction: 'number',
  numberInput: '',
  romanInput: '',
};

export interface ConversionResult {
  /** Conversion output value (canonical upper-case for Roman). */
  value: string;
  /** Error message, or null when the input converted successfully. */
  error: string | null;
}

/** The complete subtractive-notation reference, ones to thousands. */
export const NUMERAL_TABLE: { value: number; numeral: string }[] = [
  { value: 1000, numeral: 'M' },
  { value: 900, numeral: 'CM' },
  { value: 500, numeral: 'D' },
  { value: 400, numeral: 'CD' },
  { value: 100, numeral: 'C' },
  { value: 90, numeral: 'XC' },
  { value: 50, numeral: 'L' },
  { value: 40, numeral: 'XL' },
  { value: 10, numeral: 'X' },
  { value: 9, numeral: 'IX' },
  { value: 5, numeral: 'V' },
  { value: 4, numeral: 'IV' },
  { value: 1, numeral: 'I' },
];

/** Subtractive pairs that are legal (and the only legal ones). */
export const SUBTRACTIVE_PAIRS = ['IV', 'IX', 'XL', 'XC', 'CD', 'CM'] as const;
