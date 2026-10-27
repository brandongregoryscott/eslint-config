import { defineConfig } from "eslint/config";
import tsEslint from "typescript-eslint";
import collationPlugin from "eslint-plugin-collation";
import importPlugin from "eslint-plugin-import";
import stylistic from "@stylistic/eslint-plugin";
import vitest from "@vitest/eslint-plugin";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import perfectionistPlugin from "eslint-plugin-perfectionist";
import packageJsonPlugin from "eslint-plugin-package-json";
import * as parserJsonc from "jsonc-eslint-parser";

const declarationTypes = [
    "const",
    "let",
    "var",
    "using",
    "type",
    "interface",
    "enum",
    "function",
    "class",
    "function-overload",
];

// Export lists stay grouped; inline exported declarations still need separation.
const exportList = {
    selector: "ExportNamedDeclaration[declaration=null], ExportAllDeclaration",
};

// Callback-based route handlers and event listeners also form readable blocks.
const callbackBlock = {
    selector:
        "ExpressionStatement:has(CallExpression.expression > :matches(ArrowFunctionExpression, FunctionExpression))",
};

const statementPadding = [
    { blankLine: "always", prev: "*", next: declarationTypes },
    { blankLine: "always", prev: declarationTypes, next: "*" },
    { blankLine: "always", prev: "*", next: "block-like" },
    { blankLine: "always", prev: "block-like", next: "*" },
    { blankLine: "always", prev: "*", next: callbackBlock },
    { blankLine: "always", prev: callbackBlock, next: "*" },
    { blankLine: "always", prev: "*", next: "return" },
    { blankLine: "always", prev: "*", next: "import" },
    { blankLine: "always", prev: "import", next: "*" },
    { blankLine: "never", prev: "import", next: "import" },
    { blankLine: "always", prev: "*", next: "export" },
    { blankLine: "always", prev: "export", next: "*" },
    { blankLine: "never", prev: exportList, next: exportList },
    {
        blankLine: "never",
        prev: "function-overload",
        next: ["function-overload", "function"],
    },
];

// Vitest's padding rules recognize Playwright's test.* calls too.
// Include Node's hook names and Vitest's suite alias as well.
const additionalTestBlock = {
    selector:
        "ExpressionStatement[expression.callee.name=/^(before|after|suite)$/]",
};

const spacing = [
    {
        files: ["**/*.{js,mjs,mts,ts,tsx}"],
        plugins: { "@stylistic": stylistic },
        rules: {
            "@stylistic/padding-line-between-statements": [
                "error",
                ...statementPadding,
            ],
            "@stylistic/lines-between-class-members": [
                "error",
                "always",
                { exceptAfterOverload: true },
            ],
            "@stylistic/no-multiple-empty-lines": [
                "error",
                { max: 1, maxBOF: 0, maxEOF: 0 },
            ],
        },
    },
    {
        files: [
            "**/*.{test,spec}.{js,mjs,mts,ts,tsx}",
            "**/{test,tests}/**/*.{js,mjs,mts,ts,tsx}",
        ],
        plugins: { vitest },
        rules: {
            "@stylistic/padding-line-between-statements": [
                "error",
                ...statementPadding,
                { blankLine: "always", prev: "*", next: additionalTestBlock },
                { blankLine: "always", prev: additionalTestBlock, next: "*" },
            ],
            "vitest/padding-around-describe-blocks": "error",
            "vitest/padding-around-test-blocks": "error",
            "vitest/padding-around-before-all-blocks": "error",
            "vitest/padding-around-before-each-blocks": "error",
            "vitest/padding-around-after-all-blocks": "error",
            "vitest/padding-around-after-each-blocks": "error",
        },
    },
];

const TYPESCRIPT_FILES = ["**/*.{ts,tsx}"];

const config = defineConfig([
    {
        files: TYPESCRIPT_FILES,
        rules: {
            curly: ["error", "all"],
            eqeqeq: [
                "error",
                "always",
                {
                    null: "ignore",
                },
            ],
            "no-console": "error",
            "no-nested-ternary": "error",
            "no-useless-rename": "error",
            "no-var": "error",
            "prefer-destructuring": [
                "error",
                {
                    array: true,
                    object: true,
                },
            ],
        },
    },
    {
        files: TYPESCRIPT_FILES,
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
            "@typescript-eslint/consistent-type-definitions": ["error", "type"],
            "@typescript-eslint/consistent-type-exports": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/explicit-member-accessibility": [
                "error",
                {
                    accessibility: "no-public",
                },
            ],
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/strict-boolean-expressions": [
                "error",
                {
                    allowNullableObject: false,
                    allowNumber: false,
                    allowString: false,
                },
            ],
        },
    },
    {
        files: TYPESCRIPT_FILES,
        plugins: {
            collation: collationPlugin,
        },
        rules: {
            "collation/group-exports": "error",
            "collation/no-default-export": "error",
            "collation/no-destructured-props-parameter": "error",
            "collation/no-inline-export": "error",
            "collation/no-inline-object-type": "error",
            "collation/prefer-native-private-syntax": "error",
            "collation/sort-dependency-list": "error",
            "collation/sort-exports": "error",
        },
    },
    {
        files: TYPESCRIPT_FILES,
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
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/no-unescaped-entities": "off",
        },
    },
    ...spacing,
    {
        files: TYPESCRIPT_FILES,
        plugins: {
            perfectionist: perfectionistPlugin,
        },
        rules: {
            "perfectionist/sort-classes": [
                "error",
                {
                    fallbackSort: { type: "unsorted" },
                    groups: [
                        "readonly-property",
                        "property",
                        "private-property",
                        "constructor",
                        "abstract-method",
                        "static-method",
                        ["get-method", "set-method"],
                        "method",
                        "private-static-method",
                        "private-method",
                    ],
                    ignoreCase: true,
                    newlinesBetween: "ignore",
                    newlinesInside: "ignore",
                    order: "asc",
                    partitionByComment: false,
                    partitionByNewLine: false,
                    specialCharacters: "keep",
                    type: "alphabetical",
                },
            ],
            "perfectionist/sort-exports": "error",
            "perfectionist/sort-imports": ["error", { newlinesBetween: 0 }],
            "perfectionist/sort-interfaces": "error",
            "perfectionist/sort-intersection-types": "error",
            "perfectionist/sort-object-types": "error",
            "perfectionist/sort-objects": "error",
            "perfectionist/sort-switch-case": "error",
            "perfectionist/sort-union-types": "error",
        },
    },
    {
        files: TYPESCRIPT_FILES,
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
    {
        files: ["package.json"],
        plugins: {
            "package-json": packageJsonPlugin,
        },
        languageOptions: {
            parser: parserJsonc,
        },
        extends: [packageJsonPlugin.configs.recommended],
        rules: {
            "package-json/restrict-dependency-ranges": [
                "error",
                {
                    forDependencyTypes: ["dependencies", "devDependencies"],
                    rangeType: "pin",
                },
            ],
        },
    },
    { ignores: ["dist", "eslint.config.mjs"] },
]);

export default config;
