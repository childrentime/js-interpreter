import { Character } from "./character";
import { Token } from "./token";

export interface RawToken {
  type: Token;
  value: string | number;
  start: number;
  end: number;
}
export class Scanner {
  public readonly source: string;
  private index: number = 0;
  private readonly length: number;

  constructor(source: string) {
    this.source = source;
    this.length = source.length;
  }

  public eof(): boolean {
    return this.index >= this.length;
  }

  public skipWhiteSpaceAndLineTerminator() {
    let ch = this.source.charCodeAt(this.index);
    if (Character.isWhiteSpace(ch)) {
      this.index++;
    } else if (Character.isLineTerminator(ch)) {
      ++this.index;
      if (ch === 0x0d && this.source.charCodeAt(this.index) === 0x0a) {
        ++this.index;
      }
    }
  }

  public lex(): RawToken {
    const cp = this.source.charCodeAt(this.index);
    if (Character.isIdentifierStart(cp)) {
      return this.scanIdentifier();
    }

    return this.scanPunctuator();
  }

  private getIdentifier(): string {
    const start = this.index++;
    while (!this.eof()) {
      const ch = this.source.charCodeAt(this.index);
      if (Character.isIdentifierPart(ch)) {
        this.index++;
      } else {
        break;
      }
    }
    return this.source.slice(start, this.index);
  }

  // 忽略了中文标识符 代理对
  private scanIdentifier(): RawToken {
    let type: Token;
    const start = this.index;
    const id = this.getIdentifier();
    if (id.length === 1) {
      type = Token.Identifier;
    } else if (this.isKeyword(id)) {
      type = Token.Keyword;
    } else if (id === "null") {
      type = Token.NullLiteral;
    } else if (id === "true" || id === "false") {
      type = Token.BooleanLiteral;
    } else {
      type = Token.Identifier;
    }

    return {
      type: type,
      value: id,
      start: start,
      end: this.index,
    };
  }

  private isKeyword(id: string): boolean {
    switch (id.length) {
      case 2:
        return id === "if" || id === "in" || id === "do";
      case 3:
        return (
          id === "var" ||
          id === "for" ||
          id === "new" ||
          id === "try" ||
          id === "let"
        );
      case 4:
        return (
          id === "this" ||
          id === "else" ||
          id === "case" ||
          id === "void" ||
          id === "with" ||
          id === "enum"
        );
      case 5:
        return (
          id === "while" ||
          id === "break" ||
          id === "catch" ||
          id === "throw" ||
          id === "const" ||
          id === "yield" ||
          id === "class" ||
          id === "super"
        );
      case 6:
        return (
          id === "return" ||
          id === "typeof" ||
          id === "delete" ||
          id === "switch" ||
          id === "export" ||
          id === "import"
        );
      case 7:
        return id === "default" || id === "finally" || id === "extends";
      case 8:
        return id === "function" || id === "continue" || id === "debugger";
      case 10:
        return id === "instanceof";
      default:
        return false;
    }
  }

  private scanPunctuator(): RawToken {
    const start = this.index;
    let str = this.source[this.index];
    switch (str) {
      case "(":
      case "{":
      case "}":
      case ")":
      case ";":
      case ",":
      case "[":
      case "]":
      case ":":
      case "~":
        ++this.index;
        break;
      case ".":
        ++this.index;
        if (
          this.source[this.index] === "." &&
          this.source[this.index + 1] === "."
        ) {
          // 剩余操作符: ...
          this.index += 2;
          str = "...";
        }
        break;

      case "?":
        ++this.index;
        if (this.source[this.index] === "?") {
          ++this.index;
          str = "??";
        }
        if (
          this.source[this.index] === "." &&
          !/^\d$/.test(this.source[this.index + 1])
        ) {
          // "?." in "foo?.3:0" should not be treated as optional chaining.
          // See https://github.com/tc39/proposal-optional-chaining#notes
          ++this.index;
          str = "?.";
        }
        break;

      default:
        // 4字符
        str = this.source.slice(this.index, 4);
        if (str === ">>>=") {
          this.index += 4;
        } else {
          // 3字符
          str = str.slice(0, 3);
          if (
            str === "===" ||
            str === "!==" ||
            str === ">>>" ||
            str === "<<=" ||
            str === ">>=" ||
            str === "**="
          ) {
            this.index += 3;
          } else {
            // 2字符
            str = str.slice(0, 2);
            if (
              str === "&&" ||
              str === "||" ||
              str === "??" ||
              str === "==" ||
              str === "!=" ||
              str === "+=" ||
              str === "-=" ||
              str === "*=" ||
              str === "/=" ||
              str === "++" ||
              str === "--" ||
              str === "<<" ||
              str === ">>" ||
              str === "&=" ||
              str === "|=" ||
              str === "^=" ||
              str === "%=" ||
              str === "<=" ||
              str === ">=" ||
              str === "=>" ||
              str === "**"
            ) {
              this.index += 2;
            } else {
              // 1字符
              str = this.source[this.index];
              if ("<>=!+-*%&|^/".indexOf(str) >= 0) {
                ++this.index;
              }
            }
          }
        }
        return {
          type: Token.Punctuator,
          value: str,
          start: start,
          end: this.index,
        };
    }
  }
}
