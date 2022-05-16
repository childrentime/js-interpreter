import { RawToken, Scanner } from "./scanner";
import { Token, TokenName } from "./token";

export interface BufferEntry {
  type: Token;
  value: string;
}
export class Tokenizer {
  private readonly buffer: BufferEntry[] = [];
  private scanner: Scanner;

  constructor(code: string) {
    this.scanner = new Scanner(code);
  }

  public getNextToken(): BufferEntry | undefined {
    if (this.buffer.length === 0) {
      // 跳过空格和换行符
      this.scanner.skipWhiteSpaceAndLineTerminator();
      if (!this.scanner.eof()) {
        const token: RawToken = this.scanner.lex();
        const entry: BufferEntry = {
          type: TokenName[token.type],
          value: this.scanner.source.slice(token.start, token.end),
        };
        this.buffer.push(entry);
      }
    }
    return this.buffer.shift();
  }
}
