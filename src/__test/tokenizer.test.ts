import { tokenizer } from "..";

describe("tokenizer", () => {
  it("should identify keywords", () => {
    const input = "const a = 1";
    const tokens = tokenizer(input);
    const output = [
      { type: "Keyword", value: "const" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: "=" },
      { type: "Numeric", value: "1" },
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
      { type: "Numeric", value: "1" },
      { type: "Punctuator", value: ";" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: "=" },
      { type: "Numeric", value: "1" },
      { type: "Punctuator", value: "+" },
      { type: "Numeric", value: "2" },
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
      { type: "Numeric", value: "1" },
      { type: "Punctuator", value: ";" },
      { type: "Keyword", value: "const" },
      { type: "Identifier", value: "b" },
      { type: "Punctuator", value: "=" },
      { type: "Identifier", value: "a" },
      { type: "Punctuator", value: ">>" },
      { type: "Numeric", value: "1" },
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
      { type: "Numeric", value: "1" },
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
      { type: "Numeric", value: "0.2224322432" },
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
      { type: "String", value: '"1"' },
    ]);
  });
});
