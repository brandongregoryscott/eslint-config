/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        project: "tsconfig.json",
    },
    plugins: [
        "@typescript-eslint",
        "typescript-sort-keys",
    ],
    rules: {
        "@typescript-eslint/consistent-type-definitions": "error",
        "@typescript-eslint/consistent-type-exports": "error",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/padding-line-between-statements": [
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
        "@typescript-eslint/sort-type-union-intersection-members": "error",
        "@typescript-eslint/strict-boolean-expressions": "error",
        "typescript-sort-keys/interface": [
            "error",
            "asc",
            {
                caseSensitive: false,
            },
        ],
        "typescript-sort-keys/string-enum": "error",
        "collation/group-exports": "error",
        "collation/no-default-export": "error",
        "collation/no-inline-export": "error",
        "collation/sort-exports": "error",
    },
};

module.exports = config;
