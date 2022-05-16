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

  // 跳过所有的空格和换行
  public skipWhiteSpaceAndLineTerminator() {
    while (!this.eof()) {
      let ch = this.source.charCodeAt(this.index);
      if (Character.isWhiteSpace(ch)) {
        this.index++;
      } else if (Character.isLineTerminator(ch)) {
        ++this.index;
        if (ch === 0x0d && this.source.charCodeAt(this.index) === 0x0a) {
          ++this.index;
        }
      } else {
        break;
      }
    }
  }

  public lex(): RawToken {
    const cp = this.source.charCodeAt(this.index);
    if (Character.isIdentifierStart(cp)) {
      return this.scanIdentifier();
    }
    // 会被频繁解析的标点符号 ();
    if (cp === 0x28 || cp === 0x29 || cp === 0x3b) {
      return this.scanPunctuator();
    }
    if (Character.isDecimalDigit(cp)) {
      return this.scanNumericLiteral();
    }
    // 字符串字面量 '' ""
    if (cp === 0x27 || cp === 0x22) {
      return this.scanStringLiteral();
    }

    return this.scanPunctuator();
  }

  private scanNumericLiteral(): RawToken {
    const start = this.index;
    let ch = this.source[start];
    let num = "";
    if (ch !== ".") {
      num = this.source[this.index++];
      ch = this.source[this.index];
      // 16进制 '0x'.
      // 十进制 '0'.
      // 八进制 '0o'.
      // 二进制 '0b'.
      if (num === "0") {
        if (ch === "x" || ch === "X") {
          this.index++;
          return this.scanHexLiteral(start);
        }
        if (ch === "b" || ch === "B") {
          ++this.index;
          return this.scanBinaryLiteral(start);
        }
        if (ch === "o" || ch === "O") {
          return this.scanOctalLiteral(ch, start);
        }
        // 0784(8) = 500(10)
        if (ch && Character.isOctalDigit(ch.charCodeAt(0))) {
          if (this.isImplicitOctalLiteral()) {
            return this.scanOctalLiteral(ch, start);
          }
        }
      }
      while (Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
        num += this.source[this.index++];
      }
      ch = this.source[this.index];
    }

    // 浮点数
    if (ch === ".") {
      num += this.source[this.index++];
      while (Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
        num += this.source[this.index++];
      }
      ch = this.source[this.index];
    }

    // 科学计数法
    if (ch === "e" || ch === "E") {
      num += this.source[this.index++];
      ch = this.source[this.index];
      if (ch === "+" || ch === "-") {
        num += this.source[this.index++];
      }
      if (Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
        while (Character.isDecimalDigit(this.source.charCodeAt(this.index))) {
          num += this.source[this.index++];
        }
      }
    }
    return {
      type: Token.NumericLiteral,
      value: parseFloat(num),
      start: start,
      end: this.index,
    };
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
        str = this.source.slice(this.index, this.index + 4);
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
    }
    return {
      type: Token.Punctuator,
      value: str,
      start: start,
      end: this.index,
    };
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

  private scanHexLiteral(start: number): RawToken {
    let num = "";
    while (!this.eof()) {
      if (!Character.isHexDigit(this.source.charCodeAt(this.index))) {
        break;
      }
      num += this.source[this.index++];
    }
    return {
      type: Token.NumericLiteral,
      value: parseInt("0x" + num, 16),
      start: start,
      end: this.index,
    };
  }

  private scanBinaryLiteral(start: number): RawToken {
    let num = "";
    while (!this.eof()) {
      num += this.source[this.index++];
    }
    return {
      type: Token.NumericLiteral,
      value: parseInt(num, 2),
      start: start,
      end: this.index,
    };
  }

  private scanOctalLiteral(prefix: string, start: number): RawToken {
    let num = "";
    // 隐式八进制
    if (Character.isOctalDigit(prefix.charCodeAt(0))) {
      num = "0" + this.source[this.index++];
    } else {
      this.index++;
    }
    while (!this.eof()) {
      if (!Character.isOctalDigit(this.source.charCodeAt(this.index))) {
        break;
      }
      num += this.source[this.index++];
    }
    return {
      type: Token.NumericLiteral,
      value: parseInt(num, 8),
      start: start,
      end: this.index,
    };
  }

  private isImplicitOctalLiteral(): boolean {
    for (let i = this.index + 1; i < this.length; i++) {
      const ch = this.source[i];
      if (ch === "8" || ch === "9") {
        return false;
      }
    }
    return true;
  }

  // 不考虑转义字符
  private scanStringLiteral(): RawToken {
    const start = this.index;
    this.index++;
    let quote = this.source[start];
    let str = "";
    while (!this.eof()) {
      let ch = this.source[this.index++];
      if (ch === quote) {
        break;
      } else {
        str += ch;
      }
    }
    return {
      type: Token.StringLiteral,
      value: str,
      start: start,
      end: this.index,
    };
  }
}
