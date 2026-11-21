import type { ToolConfig } from '@itsjust/core';

const toolConfig = {
  id: '1795287972',
  name: 'Percentage Calculator',
  description:
    'Compute X% of Y, percentage change, reverse percentages, add/subtract percentages and compound percentages, with step-by-step explanations, history and shareable URL state.',
  version: '1.0.0',
  exportFormats: ['png', 'jpeg', 'webp', 'pdf'],
  features: {
    export: true,
    autoSave: true,
    undoRedo: false,
    sidebar: true,
    statusBar: true,
    darkMode: true,
  },
  theme: {
    accent: '#8b5cf6',
    accentHover: '#7c3aed',
    accentSubtle: 'rgba(139, 92, 246, 0.12)',
    brand: 'Percentage Calculator',
    icon: '％',
  },
  shortcuts: [
    {
      title: 'Percentage Calculator',
      shortcuts: [
        { keys: 'O', label: 'X% of Y', description: 'switch to percentage-of mode' },
        { keys: 'C', label: 'Change', description: 'switch to percentage-change mode' },
        { keys: 'R', label: 'Reverse', description: 'switch to reverse-percentage mode' },
        { keys: 'A', label: 'Add / subtract', description: 'switch to add/subtract mode' },
        { keys: 'P', label: 'Compound', description: 'switch to compound mode' },
        {
          keys: 'Y',
          label: 'Copy result',
          description: 'copy the current result to the clipboard',
        },
      ],
    },
  ],
} satisfies ToolConfig;

export default toolConfig;
