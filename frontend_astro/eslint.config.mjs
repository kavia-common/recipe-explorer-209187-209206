/* eslint.config.mjs */
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,

  // TypeScript support
  ...tseslint.configs.recommended,

  // Ignore generated .astro types by excluding the directory
  {
    ignores: ['.astro/**', 'dist/**'],
  },

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      '@typescript-eslint/explicit-function-return-type': 'off',
      // So we don't fail on occasional simple object types in our code
      '@typescript-eslint/no-empty-object-type': ['warn', { allowObjectTypes: true }],
      // Allow `any` in generated or external, but keep default elsewhere (override below for our code only)
      '@typescript-eslint/no-explicit-any': ['warn'],
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },

  // JS files config (same as before)
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'eqeqeq': ['error', 'always'],
    },
  },
];
