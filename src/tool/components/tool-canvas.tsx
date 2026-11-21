'use client';

import React, { useCallback } from 'react';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { resultText } from '../tool-definition';
import { MODES, type ToolState } from '../types';

interface ToolCanvasProps {
  state: ToolState;
  fontSize?: number;
  readOnly?: boolean;
  canvasRef?: React.RefObject<HTMLDivElement | null>;
  onStateChange?: (updater: (prev: ToolState) => ToolState) => void;
  onClear?: () => void;
  onCopyResult?: () => void;
}

export function ToolCanvas({
  state,
  readOnly = false,
  canvasRef,
  onStateChange,
  onClear,
  onCopyResult,
}: ToolCanvasProps) {
  const handleChange = useCallback(
    (updater: (prev: ToolState) => ToolState) => {
      onStateChange?.(updater);
    },
    [onStateChange]
  );

  const handleSaveHistory = useCallback(
    (text: string) => {
      handleChange((prev) => ({
        ...prev,
        history: [{ text, createdAt: new Date().toISOString() }, ...prev.history].slice(0, 20),
      }));
    },
    [handleChange]
  );

  // Keyboard shortcuts: O/C/R/A/P switch modes, Y copies the result.
  React.useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;
      const key = event.key.toLowerCase();
      const modeByKey: Record<string, ToolState['mode']> = {
        o: 'of',
        c: 'change',
        r: 'reverse',
        a: 'addsub',
        p: 'compound',
      };
      const nextMode = modeByKey[key];
      if (nextMode) {
        onStateChange?.((prev) => ({ ...prev, mode: nextMode }));
      } else if (key === 'y') {
        const result = resultText(state);
        if (result) void navigator.clipboard.writeText(result).catch(() => {});
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onStateChange, state]);

  void readOnly;
  void MODES;

  return (
    <div
      ref={canvasRef}
      className="percentage-canvas-root"
      role="application"
      aria-label="Percentage calculator canvas"
      style={{ fontSize: `${readOnly ? 16 : undefined}px` }}
    >
      {onClear ? (
        <Toolbar
          state={state}
          onChange={handleChange as unknown as (next: ToolState) => void}
          onClear={onClear}
          onCopy={onCopyResult}
        />
      ) : null}
      <Canvas
        state={state}
        onChange={handleChange as unknown as (next: ToolState) => void}
        onSaveHistory={handleSaveHistory}
      />
    </div>
  );
}
