import { defineConfig } from "eslint/config";
import tsEslint from "typescript-eslint";
import collationPlugin from "eslint-plugin-collation";
import importPlugin from "eslint-plugin-import";
import stylisticPlugin from "@stylistic/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import perfectionistPlugin from "eslint-plugin-perfectionist";

const config = defineConfig([
    { files: ["**/*.{ts,tsx}"] },
    {
        rules: {
            curly: "error",
            eqeqeq: [
                "error",
                "always",
                {
                    null: "ignore",
                },
            ],
            "no-console": "error",
        },
    },
    {
        plugins: {
            "@typescript-eslint": tsEslint.plugin,
        },
        languageOptions: {
            parser: tsEslint.parser,
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
                project: "tsconfig.json",
            },
        },
        rules: {
            "@typescript-eslint/strict-boolean-expressions": [
                "error",
                {
                    allowNullableObject: false,
                    allowNumber: false,
                    allowString: false,
                },
            ],
            "@typescript-eslint/consistent-type-definitions": ["error", "type"],
            "@typescript-eslint/consistent-type-exports": "error",
            "@typescript-eslint/consistent-type-imports": "error",
        },
    },
    {
        plugins: {
            collation: collationPlugin,
        },
        rules: {
            "collation/group-exports": "error",
            "collation/no-default-export": "error",
            "collation/no-inline-export": "error",
            "collation/sort-dependency-list": "error",
            "collation/sort-exports": "error",
        },
    },
    {
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        extends: [
            reactPlugin.configs.flat.recommended,
            reactHooksPlugin.configs.flat.recommended,
        ],
        rules: {
            "react-hooks/exhaustive-deps": "error",
            "react-hooks/rules-of-hooks": "error",
            "react/display-name": "error",
            "react/hook-use-state": "error",
            "react/jsx-boolean-value": ["error", "always"],
            "react/jsx-handler-names": "error",
            "react/jsx-no-constructed-context-values": "error",
            "react/jsx-sort-props": "error",
            "react/self-closing-comp": "error",
        },
    },
    {
        plugins: {
            "@stylistic": stylisticPlugin,
        },
        rules: {
            "@stylistic/padding-line-between-statements": [
                "error",
                {
                    blankLine: "always",
                    next: "export",
                    prev: "*",
                },
                {
                    blankLine: "never",
                    next: "export",
                    prev: "export",
                },
                {
                    blankLine: "always",
                    next: "*",
                    prev: "import",
                },
                {
                    blankLine: "never",
                    next: "import",
                    prev: "import",
                },
            ],
        },
    },
    {
        plugins: {
            perfectionist: perfectionistPlugin,
        },
        rules: {
            "perfectionist/sort-exports": "error",
            "perfectionist/sort-imports": ["error", { newlinesBetween: 0 }],
            "perfectionist/sort-interfaces": "error",
            "perfectionist/sort-intersection-types": "error",
            "perfectionist/sort-object-types": "error",
            "perfectionist/sort-objects": "error",
            "perfectionist/sort-union-types": "error",
        },
    },
    {
        plugins: {
            import: importPlugin,
        },
        rules: {
            "import/consistent-type-specifier-style": [
                "error",
                "prefer-top-level",
            ],
            "import/no-duplicates": "error",
        },
    },
    { ignores: ["dist", "eslint.config.mjs"] },
]);

export default config;
