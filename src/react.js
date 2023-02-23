/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
    plugins: [
        "collation",
        "react",
        "react-hooks",
    ],
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        "collation/sort-dependency-list":"error",
        "react/display-name": "error",
        "react-hooks/exhaustive-deps": "error",
        "react-hooks/rules-of-hooks": "error",
        "react/hook-use-state": "error",
        "react/jsx-boolean-value": ["error", "always"],
        "react/jsx-handler-names": "error",
        "react/jsx-no-constructed-context-values": "error",
        "react/jsx-sort-props": "error",
        "react/self-closing-comp": "error",
    },
};

module.exports = config;
