'use client';

import React from 'react';
import { convert } from '../tool-definition';
import { NUMERAL_TABLE, type ToolState } from '../types';

interface CanvasProps {
  state: ToolState;
  onChange: (state: ToolState) => void;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable; ignore
    }
  }, [value]);
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="copy-btn text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
      aria-label="Copy result"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

export const Canvas: React.FC<CanvasProps> = ({ state, onChange }) => {
  const result = React.useMemo(() => convert(state), [state]);
  const update = (patch: Partial<ToolState>) => onChange({ ...state, ...patch });
  const isNumber = state.direction === 'number';

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full" data-testid="roman-converter-canvas">
      <div className="space-y-2">
        <div className="flex items-center gap-2" role="group" aria-label="Conversion direction">
          <button
            type="button"
            onClick={() => update({ direction: 'number' })}
            aria-pressed={isNumber}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              isNumber
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Number → Roman
          </button>
          <button
            type="button"
            onClick={() => update({ direction: 'roman' })}
            aria-pressed={!isNumber}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              !isNumber
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            Roman → Number
          </button>
        </div>

        <label
          htmlFor="roman-input"
          className="block text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300"
        >
          {isNumber ? 'Number (1–3999)' : 'Roman numeral (I–MMMCMXCIX)'}
        </label>
        <input
          id="roman-input"
          type="text"
          value={isNumber ? state.numberInput : state.romanInput}
          onChange={(e) =>
            isNumber
              ? update({ numberInput: e.target.value })
              : update({ romanInput: e.target.value })
          }
          placeholder={isNumber ? 'Enter a number, e.g. 1987' : 'Enter a numeral, e.g. mcmlxxxvii'}
          className="w-full sm:w-96 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          aria-describedby="roman-result"
        />

        <div
          id="roman-result"
          className="rounded-md border border-gray-200 dark:border-gray-800 px-3 py-2 flex items-center justify-between gap-3"
          data-testid="conversion-result"
        >
          {result.error ? (
            <span role="alert" className="text-xs text-red-600 dark:text-red-400">
              {result.error}
            </span>
          ) : (
            <>
              <code className="break-all font-mono text-lg text-gray-900 dark:text-gray-100">
                {result.value || '—'}
              </code>
              {result.value ? <CopyButton value={result.value} /> : null}
            </>
          )}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-700 dark:text-gray-300">
          Subtractive notation reference
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {NUMERAL_TABLE.map(({ value, numeral }) => (
            <div
              key={numeral}
              className="flex items-center justify-between rounded-md border border-gray-200 dark:border-gray-800 px-3 py-1.5"
              data-testid={`numeral-${numeral}`}
            >
              <span className="font-mono text-sm text-gray-900 dark:text-gray-100">{numeral}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
