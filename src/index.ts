import { Parser } from "./parser/parse";
import { BufferEntry, Tokenizer } from "./tokenizer/tokenizer";

const tokenizer = (code: string) => {
  const tokenizer = new Tokenizer(code);
  const tokens: BufferEntry[] = [];
  while (true) {
    const token: BufferEntry | undefined = tokenizer.getNextToken();
    if (!token) {
      break;
    }
    tokens.push(token);
  }
  return tokens;
};

const parse = (code: string) => {
  const tokens = tokenizer(code);
  const parser = new Parser(tokens);
  const ast = parser.parseScript();
  return ast;
};

export { tokenizer, parse };
