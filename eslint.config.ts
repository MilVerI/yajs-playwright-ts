import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, "@stylistic": stylistic },
    extends: ["js/recommended"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      sourceType: "module",
    },
    rules: {
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/max-len": ["error", { code: 150 }],
      "@stylistic/indent": ["error", 2],
      "@stylistic/spaced-comment": ["error", "always"],
      "@stylistic/quotes": ["error", "single"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/no-multi-spaces": ["error"],
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.{ts,mts,cts}"],
  })),
]);
