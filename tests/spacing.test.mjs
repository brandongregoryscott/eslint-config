import { ESLint } from "eslint";
import { format } from "prettier";
import { describe, expect, it } from "vitest";
import tseslint from "typescript-eslint";
import fullConfig from "../eslint.config.mjs";

// Exercise the spacing blocks from the actual single-file configuration.
const spacing = fullConfig.filter((entry) =>
    Object.hasOwn(
        entry.rules ?? {},
        "@stylistic/padding-line-between-statements"
    )
);

const config = [...tseslint.configs.recommended, ...spacing];

// Exercise the real shared config, without unrelated unused fixture bindings.
const options = {
    overrideConfigFile: true,
    overrideConfig: [
        ...config,
        {
            rules: {
                "@typescript-eslint/no-unused-vars": "off",
                "no-unused-vars": "off",
            },
        },
    ],
};

const lint = new ESLint(options);

const fix = new ESLint({ ...options, fix: true });

const formatSource = (source) =>
    format(source, { parser: "typescript", tabWidth: 4, trailingComma: "es5" });

const testCases = [
    {
        name: "constants and schema declarations",
        input: `
            const first = 1;
            const second = 2;
            const schema = { first, second };
            const alias = schema;
        `,
        expected: `
            const first = 1;

            const second = 2;

            const schema = { first, second };

            const alias = schema;
        `,
    },
    {
        name: "types, interfaces, enums, and classes",
        input: `
            type Value = number;
            type Label = string;
            interface Item {
                value: Value;
            }
            enum Mode {
                Read,
                Write,
            }
            class Store {}
        `,
        expected: `
            type Value = number;

            type Label = string;

            interface Item {
                value: Value;
            }

            enum Mode {
                Read,
                Write,
            }

            class Store {}
        `,
    },
    {
        name: "named functions and arrow helpers",
        input: `
            function first() {
                return 1;
            }
            function second() {
                return 2;
            }
            const third = () => 3;
        `,
        expected: `
            function first() {
                return 1;
            }

            function second() {
                return 2;
            }

            const third = () => 3;
        `,
    },
    {
        name: "local declarations and returns",
        input: `
            function total() {
                const first = 1;
                const second = 2;
                return first + second;
            }
        `,
        expected: `
            function total() {
                const first = 1;

                const second = 2;

                return first + second;
            }
        `,
    },
    {
        name: "class fields, constructors, methods, and getters",
        input: `
            class Store {
                value = 1;
                other = 2;
                constructor() {
                    this.value = 3;
                }
                read() {
                    return this.value;
                }
                get current() {
                    return this.value;
                }
            }
        `,
        expected: `
            class Store {
                value = 1;

                other = 2;

                constructor() {
                    this.value = 3;
                }

                read() {
                    return this.value;
                }

                get current() {
                    return this.value;
                }
            }
        `,
    },
    {
        name: "inline exports are declarations, not export lists",
        input: `
            export const first = 1;
            export type Value = number;
            export function read() {
                return first;
            }
            export class Store {}
        `,
        expected: `
            export const first = 1;

            export type Value = number;

            export function read() {
                return first;
            }

            export class Store {}
        `,
    },
    {
        name: "comments stay attached to the declaration they describe",
        input: `
            const first = 1;
            /** Describes the second constant. */
            const second = 2;
        `,
        expected: `
            const first = 1;

            /** Describes the second constant. */
            const second = 2;
        `,
    },
    {
        name: "test suites, hooks, modifiers, and parameterized tests",
        filename: "apps/api/src/fixture.test.ts",
        input: `
            import { describe, beforeEach, afterEach, it } from "vitest";
            describe("suite", () => {
                beforeEach(() => {});
                it("first", () => {});
                it.skip("second", () => {});
                it.each([1])("parameter", () => {});
                afterEach(() => {});
            });
            describe("other suite", () => {});
        `,
        expected: `
            import { describe, beforeEach, afterEach, it } from "vitest";

            describe("suite", () => {
                beforeEach(() => {});

                it("first", () => {});

                it.skip("second", () => {});

                it.each([1])("parameter", () => {});

                afterEach(() => {});
            });

            describe("other suite", () => {});
        `,
    },
    {
        name: "Node test hooks and awaited test calls",
        filename: "apps/api/test/fixture.ts",
        input: `
            import { before, after, test } from "node:test";
            before(() => {});
            after(() => {});
            await test("first", () => {});
            await test("second", () => {});
        `,
        expected: `
            import { before, after, test } from "node:test";

            before(() => {});

            after(() => {});

            await test("first", () => {});

            await test("second", () => {});
        `,
    },
    {
        name: "callback-based routes and event listeners",
        input: `
            import express from "express";
            const app = express();
            app.get("/first", () => {});
            app.get("/second", () => {});
            process.once("SIGTERM", () => {});
        `,
        expected: `
            import express from "express";

            const app = express();

            app.get("/first", () => {});

            app.get("/second", () => {});

            process.once("SIGTERM", () => {});
        `,
    },
    {
        name: "named test callbacks and todo blocks",
        filename: "apps/api/src/fixture.test.ts",
        input: `
            import { it } from "vitest";
            const body = () => {};
            it("first", body);
            it.todo("later");
            it.skip("second", body);
        `,
        expected: `
            import { it } from "vitest";

            const body = () => {};

            it("first", body);

            it.todo("later");

            it.skip("second", body);
        `,
    },
    {
        name: "Playwright tests and member-form hooks",
        filename: "tests/e2e/fixture.spec.ts",
        input: `
            import { test } from "@playwright/test";
            test.beforeEach(() => {});
            test("first", () => {});
            test("second", () => {});
        `,
        expected: `
            import { test } from "@playwright/test";

            test.beforeEach(() => {});

            test("first", () => {});

            test("second", () => {});
        `,
    },
];

describe("shared ESLint spacing", () => {
    it("detects missing boundaries, fixes them, and stays stable after Prettier", async () => {
        for (const testCase of testCases) {
            const source = await formatSource(testCase.input);

            const expected = await formatSource(testCase.expected);

            const filePath =
                testCase.filename ?? "packages/common/src/fixture.ts";

            const [initial] = await lint.lintText(source, { filePath });

            const [fixed] = await fix.lintText(source, { filePath });

            const output = await formatSource(fixed.output ?? source);

            const [secondPass] = await fix.lintText(output, { filePath });

            expect(initial.errorCount, testCase.name).toBeGreaterThan(0);
            expect(fixed.messages, testCase.name).toEqual([]);
            expect(output, testCase.name).toBe(expected);
            expect(secondPass.messages, testCase.name).toEqual([]);
            expect(secondPass.output, testCase.name).toBeUndefined();
        }
    });

    it("preserves compact imports, export lists, overloads, and assertion groups", async () => {
        const source = await formatSource(`
            import { assert, expect, it } from "vitest";
            import { z } from "zod";

            type Value = number;

            function read(value: number): number;
            function read(value: string): string;
            function read(value: number | string) { return value; }

            class Reader {
                read(value: number): number;
                read(value: string): string;
                read(value: number | string) { return value; }
            }

            it("keeps assertions together", () => {
                assert(true);
                expect(1).toBe(1);
                expect(() => { throw new Error("test"); }).toThrow("test");
                expect(2).toBe(2);
            });

            export { read, Reader, z };
            export type { Value };
        `);

        const [result] = await lint.lintText(source, {
            filePath: "apps/api/src/fixture.test.ts",
        });

        expect(result.messages).toEqual([]);
    });
});

it("composes with the canonical import, export, and class sorting rules", async () => {
    // Virtual fixtures do not have a consumer tsconfig. The formatting rules
    // still run together with the source config's other syntax-only policies.
    const combined = new ESLint({
        overrideConfigFile: true,
        fix: true,
        overrideConfig: [...fullConfig, tseslint.configs.disableTypeChecked],
    });

    const source = await formatSource(`
        type Pair = {
            z: number;
            a: number;
        };
        class Reader {
            #value = 1;
            read() { return this.#value; }
            readonly label = "reader";
            constructor() {}
        }
        const createReader = () => new Reader();
        export { Reader, createReader };
        export type { Pair };
    `);

    const [fixed] = await combined.lintText(source, {
        filePath: "fixtures/composition.ts",
    });

    const output = await formatSource(fixed.output ?? source);

    const [again] = await combined.lintText(output, {
        filePath: "fixtures/composition.ts",
    });

    expect(fixed.messages).toEqual([]);
    expect(again.messages).toEqual([]);
    expect(again.output).toBeUndefined();
});

it("exposes the same spacing settings through the canonical config", async () => {
    const canonical = new ESLint({
        overrideConfigFile: true,
        overrideConfig: fullConfig,
    });

    const reference = new ESLint({
        overrideConfigFile: true,
        overrideConfig: config,
    });

    const ruleNames = new Set(
        spacing.flatMap((entry) => Object.keys(entry.rules))
    );

    const filePaths = [
        "fixtures/policy.ts",
        "fixtures/policy.mjs",
        "fixtures/policy.test.ts",
        "tests/e2e/policy.spec.ts",
    ];

    for (const filePath of filePaths) {
        const effective = await canonical.calculateConfigForFile(filePath);

        const expected = await reference.calculateConfigForFile(filePath);

        for (const name of ruleNames) {
            expect(effective.rules[name], `${filePath}: ${name}`).toEqual(
                expected.rules[name]
            );
        }
    }
});
