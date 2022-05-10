import { BufferEntry, Tokenizer } from "./tokenizer";

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

export { tokenizer };
