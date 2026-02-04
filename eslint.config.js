
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import jestPlugin from "eslint-plugin-jest";
import nodePlugin from "eslint-plugin-node";
import promisePlugin from "eslint-plugin-promise";
import prettier from "eslint-config-prettier";

/**
 * Top-level ignores for ESLint Flat Config (v9+)
 * This ensures generated/prisma and related folders are excluded from linting.
 */
export const ignores = [
  "generated/**",
  "generated/prisma/**",
  "generated/prisma/runtime/**",
  "prisma/**",
  "coverage/**",
  "prisma.config.ts"
];

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  { ignores },
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2021,
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
      jest: jestPlugin,
      node: nodePlugin,
      promise: promisePlugin
    },
    rules: {
      // Add or override rules here
    }
  },
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js"],
    // ...existing code...
  },
  prettier
];
