import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import stylistic from '@stylistic/eslint-plugin';
import playwright from 'eslint-plugin-playwright';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js, '@stylistic': stylistic },
    extends: ['js/recommended'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      sourceType: 'module',
    },
    rules: {
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/max-len': ['error', { code: 150 }],
      '@stylistic/indent': ['error', 2],
      '@stylistic/spaced-comment': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/no-multi-spaces': ['error'],
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,mts,cts}'],
  })),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: ['**/*.{ts,mts,cts}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  {
    files: ['tests/**'],
    extends: [playwright.configs['flat/recommended']],
    rules: {
      'playwright/consistent-spacing-between-blocks': 'error',
      'playwright/expect-expect': 'error',
      'playwright/max-nested-describe': 'error',
      'playwright/missing-playwright-await': 'error',
      'playwright/no-conditional-expect': 'error',
      'playwright/no-conditional-in-test': 'error',
      'playwright/no-duplicate-hooks': 'error',
      'playwright/no-duplicate-slow': 'error',
      'playwright/no-element-handle': 'error',
      'playwright/no-eval': 'error',
      'playwright/no-focused-test': 'error',
      'playwright/no-force-option': 'error',
      'playwright/no-nested-step': 'error',
      'playwright/no-networkidle': 'error',
      'playwright/no-page-pause': 'error',
      'playwright/no-skipped-test': 'error',
      'playwright/no-standalone-expect': 'error',
      'playwright/no-unsafe-references': 'error',
      'playwright/no-unused-locators': 'error',
      'playwright/no-useless-await': 'error',
      'playwright/no-useless-not': 'error',
      'playwright/no-wait-for-navigation': 'error',
      'playwright/no-wait-for-selector': 'error',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/prefer-hooks-in-order': 'error',
      'playwright/prefer-hooks-on-top': 'error',
      'playwright/prefer-locator': 'error',
      'playwright/prefer-to-have-count': 'error',
      'playwright/prefer-to-have-length': 'error',
      'playwright/prefer-web-first-assertions': 'error',
      'playwright/valid-describe-callback': 'error',
      'playwright/valid-expect-in-promise': 'error',
      'playwright/valid-expect': 'error',
      'playwright/valid-title': 'error',
      'playwright/valid-test-tags': 'error',
    },
  },
]);
