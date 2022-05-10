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
});
