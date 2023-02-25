/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
    plugins: ["import"],
    rules: {
        curly: "error",
        eqeqeq: [
            "error",
            "always",
            {
                null: "ignore",
            },
        ],
        "import/no-duplicates": "error"
    },
};

module.exports = config;
