import type { ToolConfig } from '@itsjust/core';

export const toolConfig: ToolConfig = {
  id: 'tool-1795273467',
  name: 'Roman Numeral Converter',
  description:
    'Convert between integers and Roman numerals with bidirectional parsing, validation, and range checks.',
  version: '1.0.0',
  exportFormats: ['png', 'jpeg', 'webp', 'pdf'],
  features: {
    export: true,
    autoSave: true,
    undoRedo: true,
    sidebar: true,
    statusBar: true,
    darkMode: true,
  },
  theme: {
    brand: 'Roman Numeral Converter',
    accent: '#10b981',
  },
};

export default toolConfig;
