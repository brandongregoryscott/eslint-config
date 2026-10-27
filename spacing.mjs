// Source of truth: https://github.com/brandongregoryscott/eslint-config/blob/main/spacing.mjs
// Application templates keep a local copy so generated projects remain independent.
import stylistic from "@stylistic/eslint-plugin";
import vitest from "@vitest/eslint-plugin";

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

export default spacing;
