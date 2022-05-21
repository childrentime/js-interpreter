import { tokenizer } from "..";
import fs from "fs";
import path from "path";

describe("tokenizer", () => {
  it("should identify keywords", () => {
    const input = "const a = 1";
    const tokens = tokenizer(input);
    const output = [
      { type: "Keyword", value: "const" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: "=" },
      { type: "Numeric", value: 1 },
    ];
    expect(tokens).toStrictEqual(output);
  });

  it("should identify null literal", () => {
    const input = "const a = null;";
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: "Keyword", value: "const" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: "=" },
      { type: "Null", value: "null" },
      { type: "Punctuator", value: ";" },
    ]);
  });

  it("should identify boolean literal", () => {
    const input = "const a = false";
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: "Keyword", value: "const" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: "=" },
      { type: "Boolean", value: "false" },
    ]);
  });

  it("should identify operators", () => {
    const input = "const a = 1; a = 1 + 2;";
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: "Keyword", value: "const" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: "=" },
      { type: "Numeric", value: 1 },
      { type: "Punctuator", value: ";" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: "=" },
      { type: "Numeric", value: 1 },
      { type: "Punctuator", value: "+" },
      { type: "Numeric", value: 2 },
      { type: "Punctuator", value: ";" },
    ]);
  });

  it("should identify double opeators", () => {
    const input = "const a = 1; const b = a >> 1;";
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: "Keyword", value: "const" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: "=" },
      { type: "Numeric", value: 1 },
      { type: "Punctuator", value: ";" },
      { type: "Keyword", value: "const" },
      { type: "Identifier", value: "b" },
      { type: "Punctuator", value: "=" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: ">>" },
      { type: "Numeric", value: 1 },
      { type: "Punctuator", value: ";" },
    ]);
  });

  it("should indentify linefeed", () => {
    const input = "var a = 1;\nconsole.log(a)";
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: "Keyword", value: "var" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: "=" },
      { type: "Numeric", value: 1 },
      { type: "Punctuator", value: ";" },
      { type: "Identifier", value: "console" },
      { type: "Punctuator", value: "." },
      { type: "Identifier", value: "log" },
      { type: "Punctuator", value: "(" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: ")" },
    ]);
  });

  it("should indentify and opeator", () => {
    const input = "&&";
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([{ type: "Punctuator", value: "&&" }]);
  });

  it("should indentify float number", () => {
    const input = "return 0.2224322432;";
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: "Keyword", value: "return" },
      { type: "Numeric", value: 0.2224322432 },
      { type: "Punctuator", value: ";" },
    ]);
  });

  it("should indentify string  literals", () => {
    const input = 'const a = "1"';
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      { type: "Keyword", value: "const" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: "=" },
      { type: "String", value: "1" },
    ]);
  });

  it("should indentify js code", () => {
    const input = fs.readFileSync(path.join(__dirname, "./input.js"), "utf-8");
    const tokens = tokenizer(input);
    expect(tokens).toStrictEqual([
      {
        type: "Keyword",
        value: "var",
      },
      {
        type: "Identifier",
        value: "findMedianSortedArrays",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Identifier",
        value: "nums1",
      },
      {
        type: "Punctuator",
        value: ",",
      },
      {
        type: "Identifier",
        value: "nums2",
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Punctuator",
        value: "=>",
      },
      {
        type: "Punctuator",
        value: "{",
      },
      {
        type: "Keyword",
        value: "let",
      },
      {
        type: "Identifier",
        value: "len1",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Identifier",
        value: "nums1",
      },
      {
        type: "Punctuator",
        value: ".",
      },
      {
        type: "Identifier",
        value: "length",
      },
      {
        type: "Punctuator",
        value: ",",
      },
      {
        type: "Identifier",
        value: "len2",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Identifier",
        value: "nums2",
      },
      {
        type: "Punctuator",
        value: ".",
      },
      {
        type: "Identifier",
        value: "length",
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Keyword",
        value: "if",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Identifier",
        value: "len1",
      },
      {
        type: "Punctuator",
        value: ">",
      },
      {
        type: "Identifier",
        value: "len2",
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Keyword",
        value: "return",
      },
      {
        type: "Identifier",
        value: "findMedianSortedArrays",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Identifier",
        value: "nums2",
      },
      {
        type: "Punctuator",
        value: ",",
      },
      {
        type: "Identifier",
        value: "nums1",
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Keyword",
        value: "let",
      },
      {
        type: "Identifier",
        value: "len",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Identifier",
        value: "len1",
      },
      {
        type: "Punctuator",
        value: "+",
      },
      {
        type: "Identifier",
        value: "len2",
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Keyword",
        value: "let",
      },
      {
        type: "Identifier",
        value: "start",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Numeric",
        value: 0,
      },
      {
        type: "Punctuator",
        value: ",",
      },
      {
        type: "Identifier",
        value: "end",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Identifier",
        value: "len1",
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Keyword",
        value: "let",
      },
      {
        type: "Identifier",
        value: "partLen1",
      },
      {
        type: "Punctuator",
        value: ",",
      },
      {
        type: "Identifier",
        value: "partLen2",
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Keyword",
        value: "while",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Identifier",
        value: "start",
      },
      {
        type: "Punctuator",
        value: "<=",
      },
      {
        type: "Identifier",
        value: "end",
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Punctuator",
        value: "{",
      },
      {
        type: "Identifier",
        value: "partLen1",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Identifier",
        value: "start",
      },
      {
        type: "Punctuator",
        value: "+",
      },
      {
        type: "Identifier",
        value: "end",
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Punctuator",
        value: ">>",
      },
      {
        type: "Numeric",
        value: 1,
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Identifier",
        value: "partLen2",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Identifier",
        value: "len",
      },
      {
        type: "Punctuator",
        value: "+",
      },
      {
        type: "Numeric",
        value: 1,
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Punctuator",
        value: ">>",
      },
      {
        type: "Numeric",
        value: 1,
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Punctuator",
        value: "-",
      },
      {
        type: "Identifier",
        value: "partLen1",
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Keyword",
        value: "let",
      },
      {
        type: "Identifier",
        value: "L1",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Identifier",
        value: "partLen1",
      },
      {
        type: "Punctuator",
        value: "===",
      },
      {
        type: "Numeric",
        value: 0,
      },
      {
        type: "Punctuator",
        value: "?",
      },
      {
        type: "Punctuator",
        value: "-",
      },
      {
        type: "Identifier",
        value: "Infinity",
      },
      {
        type: "Punctuator",
        value: ":",
      },
      {
        type: "Identifier",
        value: "nums1",
      },
      {
        type: "Punctuator",
        value: "[",
      },
      {
        type: "Identifier",
        value: "partLen1",
      },
      {
        type: "Punctuator",
        value: "-",
      },
      {
        type: "Numeric",
        value: 1,
      },
      {
        type: "Punctuator",
        value: "]",
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Keyword",
        value: "let",
      },
      {
        type: "Identifier",
        value: "L2",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Identifier",
        value: "partLen2",
      },
      {
        type: "Punctuator",
        value: "===",
      },
      {
        type: "Numeric",
        value: 0,
      },
      {
        type: "Punctuator",
        value: "?",
      },
      {
        type: "Punctuator",
        value: "-",
      },
      {
        type: "Identifier",
        value: "Infinity",
      },
      {
        type: "Punctuator",
        value: ":",
      },
      {
        type: "Identifier",
        value: "nums2",
      },
      {
        type: "Punctuator",
        value: "[",
      },
      {
        type: "Identifier",
        value: "partLen2",
      },
      {
        type: "Punctuator",
        value: "-",
      },
      {
        type: "Numeric",
        value: 1,
      },
      {
        type: "Punctuator",
        value: "]",
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Keyword",
        value: "let",
      },
      {
        type: "Identifier",
        value: "R1",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Identifier",
        value: "partLen1",
      },
      {
        type: "Punctuator",
        value: "===",
      },
      {
        type: "Identifier",
        value: "len1",
      },
      {
        type: "Punctuator",
        value: "?",
      },
      {
        type: "Identifier",
        value: "Infinity",
      },
      {
        type: "Punctuator",
        value: ":",
      },
      {
        type: "Identifier",
        value: "nums1",
      },
      {
        type: "Punctuator",
        value: "[",
      },
      {
        type: "Identifier",
        value: "partLen1",
      },
      {
        type: "Punctuator",
        value: "]",
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Keyword",
        value: "let",
      },
      {
        type: "Identifier",
        value: "R2",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Identifier",
        value: "partLen2",
      },
      {
        type: "Punctuator",
        value: "===",
      },
      {
        type: "Identifier",
        value: "len2",
      },
      {
        type: "Punctuator",
        value: "?",
      },
      {
        type: "Identifier",
        value: "Infinity",
      },
      {
        type: "Punctuator",
        value: ":",
      },
      {
        type: "Identifier",
        value: "nums2",
      },
      {
        type: "Punctuator",
        value: "[",
      },
      {
        type: "Identifier",
        value: "partLen2",
      },
      {
        type: "Punctuator",
        value: "]",
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Keyword",
        value: "if",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Identifier",
        value: "L1",
      },
      {
        type: "Punctuator",
        value: ">",
      },
      {
        type: "Identifier",
        value: "R2",
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Punctuator",
        value: "{",
      },
      {
        type: "Identifier",
        value: "end",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Identifier",
        value: "partLen1",
      },
      {
        type: "Punctuator",
        value: "-",
      },
      {
        type: "Numeric",
        value: 1,
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Punctuator",
        value: "}",
      },
      {
        type: "Keyword",
        value: "else",
      },
      {
        type: "Keyword",
        value: "if",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Identifier",
        value: "L2",
      },
      {
        type: "Punctuator",
        value: ">",
      },
      {
        type: "Identifier",
        value: "R1",
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Punctuator",
        value: "{",
      },
      {
        type: "Identifier",
        value: "start",
      },
      {
        type: "Punctuator",
        value: "=",
      },
      {
        type: "Identifier",
        value: "partLen1",
      },
      {
        type: "Punctuator",
        value: "+",
      },
      {
        type: "Numeric",
        value: 1,
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Punctuator",
        value: "}",
      },
      {
        type: "Keyword",
        value: "else",
      },
      {
        type: "Punctuator",
        value: "{",
      },
      {
        type: "Keyword",
        value: "return",
      },
      {
        type: "Identifier",
        value: "len",
      },
      {
        type: "Punctuator",
        value: "%",
      },
      {
        type: "Numeric",
        value: 2,
      },
      {
        type: "Punctuator",
        value: "===",
      },
      {
        type: "Numeric",
        value: 0,
      },
      {
        type: "Punctuator",
        value: "?",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Identifier",
        value: "Math",
      },
      {
        type: "Punctuator",
        value: ".",
      },
      {
        type: "Identifier",
        value: "max",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Identifier",
        value: "L1",
      },
      {
        type: "Punctuator",
        value: ",",
      },
      {
        type: "Identifier",
        value: "L2",
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Punctuator",
        value: "+",
      },
      {
        type: "Identifier",
        value: "Math",
      },
      {
        type: "Punctuator",
        value: ".",
      },
      {
        type: "Identifier",
        value: "min",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Identifier",
        value: "R1",
      },
      {
        type: "Punctuator",
        value: ",",
      },
      {
        type: "Identifier",
        value: "R2",
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Punctuator",
        value: "/",
      },
      {
        type: "Numeric",
        value: 2,
      },
      {
        type: "Punctuator",
        value: ":",
      },
      {
        type: "Identifier",
        value: "Math",
      },
      {
        type: "Punctuator",
        value: ".",
      },
      {
        type: "Identifier",
        value: "max",
      },
      {
        type: "Punctuator",
        value: "(",
      },
      {
        type: "Identifier",
        value: "L1",
      },
      {
        type: "Punctuator",
        value: ",",
      },
      {
        type: "Identifier",
        value: "L2",
      },
      {
        type: "Punctuator",
        value: ")",
      },
      {
        type: "Punctuator",
        value: ";",
      },
      {
        type: "Punctuator",
        value: "}",
      },
      {
        type: "Punctuator",
        value: "}",
      },
      {
        type: "Punctuator",
        value: "}",
      },
      {
        type: "Punctuator",
        value: ";",
      },
    ]);
  });
});
