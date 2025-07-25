import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Base JS rules
  js.configs.recommended,

  // TypeScript support
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },

  // React support
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: pluginReact,
    },
  rules: {
    ...pluginReact.configs.flat.recommended.rules,
    'react/react-in-jsx-scope': 'off', 
  },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Add global variables for browser and node
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
]);
