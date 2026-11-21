import type { Tool, DeserializeResult } from '@itsjust/core';
import toolConfig from './tool.config';
import {
  DEFAULT_STATE,
  MAX_HISTORY,
  parseNumber,
  resultText,
  stepsFor,
  type AddSubOp,
  type HistoryEntry,
  type Mode,
  type ToolState,
} from './types';

const VALID_MODES: Mode[] = ['of', 'change', 'reverse', 'addsub', 'compound'];
const VALID_OPS: AddSubOp[] = ['add', 'subtract'];

/** Serialize tool state into a compact JSON string for share/import. */
export function serializeState(state: ToolState): string {
  return JSON.stringify({
    mode: state.mode,
    percentageOf: state.percentageOf,
    ofBase: state.ofBase,
    changeFrom: state.changeFrom,
    changeTo: state.changeTo,
    reversePart: state.reversePart,
    reversePercent: state.reversePercent,
    addSubValue: state.addSubValue,
    addSubPercent: state.addSubPercent,
    addSubOp: state.addSubOp,
    compoundA: state.compoundA,
    compoundB: state.compoundB,
    history: state.history,
  });
}

function stringOr(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

function validHistory(value: unknown): HistoryEntry[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter(
      (entry): entry is HistoryEntry =>
        typeof entry === 'object' &&
        entry !== null &&
        typeof (entry as HistoryEntry).text === 'string' &&
        typeof (entry as HistoryEntry).createdAt === 'string'
    )
    .slice(0, MAX_HISTORY);
}

/** Validate and recover tool state from an arbitrary payload. */
export function deserializeState(data: unknown): DeserializeResult<ToolState> {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {
      success: false,
      error: 'Invalid data format: expected percentage calculator state object',
    };
  }
  const v = data as Record<string, unknown>;
  const mode: Mode = VALID_MODES.includes(v.mode as Mode) ? (v.mode as Mode) : DEFAULT_STATE.mode;
  const addSubOp: AddSubOp = VALID_OPS.includes(v.addSubOp as AddSubOp)
    ? (v.addSubOp as AddSubOp)
    : DEFAULT_STATE.addSubOp;
  const state: ToolState = {
    mode,
    percentageOf: stringOr(v.percentageOf, DEFAULT_STATE.percentageOf),
    ofBase: stringOr(v.ofBase, DEFAULT_STATE.ofBase),
    changeFrom: stringOr(v.changeFrom, DEFAULT_STATE.changeFrom),
    changeTo: stringOr(v.changeTo, DEFAULT_STATE.changeTo),
    reversePart: stringOr(v.reversePart, DEFAULT_STATE.reversePart),
    reversePercent: stringOr(v.reversePercent, DEFAULT_STATE.reversePercent),
    addSubValue: stringOr(v.addSubValue, DEFAULT_STATE.addSubValue),
    addSubPercent: stringOr(v.addSubPercent, DEFAULT_STATE.addSubPercent),
    addSubOp,
    compoundA: stringOr(v.compoundA, DEFAULT_STATE.compoundA),
    compoundB: stringOr(v.compoundB, DEFAULT_STATE.compoundB),
    history: validHistory(v.history),
  };
  return { success: true, data: state };
}

/** Append a history entry to state, capped at MAX_HISTORY, newest first. */
export function withHistory(state: ToolState, text: string, now = new Date()): ToolState {
  const entry: HistoryEntry = { text, createdAt: now.toISOString() };
  return { ...state, history: [entry, ...state.history].slice(0, MAX_HISTORY) };
}

/** True when a serialized string round-trips back to the same state. */
export function roundTrips(state: ToolState): boolean {
  try {
    const restored = deserializeState(JSON.parse(serializeState(state)));
    return restored.success && JSON.stringify(restored.data) === JSON.stringify(state);
  } catch {
    return false;
  }
}

const numberOrNull = (value: string): number | null => parseNumber(value);

export const percentageCalculatorTool: Tool<ToolState> = {
  id: toolConfig.id,
  name: toolConfig.name,
  version: toolConfig.version,
  config: toolConfig,
  initialState: { ...DEFAULT_STATE },
  serialize: serializeState,
  deserialize: deserializeState,
  exporters: [
    { format: 'png', loader: () => import('./exporters/png') },
    { format: 'jpeg', loader: () => import('./exporters/jpeg') },
    { format: 'webp', loader: () => import('./exporters/webp') },
    { format: 'pdf', loader: () => import('./exporters/pdf') },
  ],
};

export { numberOrNull, resultText, stepsFor };
