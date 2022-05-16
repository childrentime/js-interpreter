import * as Node from "./node";
import { Token, TokenName } from "../tokenizer/token";
import { BufferEntry } from "../tokenizer/tokenizer";
import { Syntax } from "./syntax";

export class Parser {
  // 下一个token
  private lookahead: BufferEntry;
  private tokens: BufferEntry[];
  private index: number = 0;
  // 操作符优先级
  readonly operatorPrecedence = {
    ")": 0,
    ";": 0,
    ",": 0,
    "=": 0,
    "]": 0,
    "??": 5,
    "||": 6,
    "&&": 7,
    "|": 8,
    "^": 9,
    "&": 10,
    "==": 11,
    "!=": 11,
    "===": 11,
    "!==": 11,
    "<": 12,
    ">": 12,
    "<=": 12,
    ">=": 12,
    "<<": 13,
    ">>": 13,
    ">>>": 13,
    "+": 14,
    "-": 14,
    "*": 15,
    "/": 15,
    "%": 15,
  };

  constructor(tokens: BufferEntry[]) {
    this.tokens = tokens;
    // 推入结束符号
    this.tokens.push({
      type: TokenName[Token.EOF],
      value: "",
    });
    // 最开始的第一个展望串应该也是结束符号
    this.lookahead = {
      type: TokenName[Token.EOF],
      value: "",
    };
    this.lookahead = this.tokens[this.index++];
  }

  private nextToken() {
    // 展望的 token
    const token = this.lookahead;
    // 下一个 token
    const next = this.tokens[this.index++];
    // 将下一个 token 赋值给展望串
    this.lookahead = next;
    // 返回展望的 token
    return token;
  }

  // 解析
  public parseScript(): Node.Script {
    // 语句数组
    const body: Node.StatementListItem[] = [];
    while (this.lookahead.type !== TokenName[Token.EOF]) {
      // 解析语句
      body.push(this.parseStatementListItem());
    }
    return new Node.Script(body);
  }

  private parseStatementListItem(): Node.StatementListItem {
    let statement: Node.StatementListItem;
    if (this.lookahead.type === TokenName[Token.Keyword]) {
      switch (this.lookahead.value) {
        case "function":
          statement = this.parseFunctionDeclaration();
          break;

        default:
          statement = this.parseStatement();
          break;
      }
    } else {
      statement = this.parseStatement();
    }

    return statement;
  }

  // 解析函数声明 function a(){}
  private parseFunctionDeclaration(): Node.FunctionDeclaration {
    // 期望 function 关键字
    this.expectKeyword("function");
    // 解析标识符
    const id = this.parseVariableIdentifier();
    // 解析参数
    const params = this.parseFormalParameters();
    // 解析函数体
    const body = this.parseBlock();

    return new Node.FunctionDeclaration(id, params, body);
  }

  // 解析标识符
  private parseVariableIdentifier(): Node.Identifier {
    const token = this.nextToken();
    return new Node.Identifier(token.value);
  }

  // (a1,a2,a3) 解析参数
  private parseFormalParameters(): Node.Identifier[] {
    const params: Node.Identifier[] = [];
    this.expect("(");
    // 如果展望串不是右括号
    if (!this.match(")")) {
      while (this.lookahead.type !== TokenName[Token.EOF]) {
        params.push(this.parseVariableIdentifier());
        // 右括号直接退出
        if (this.match(")")) {
          break;
        }
        // 不是右括号，则吃掉逗号
        this.expect(",");
        // 逗号后面没了，也退出
        if (this.match(")")) {
          break;
        }
      }
    }
    this.expect(")");
    return params;
  }

  // 解析块
  private parseBlock(): Node.BlockStatement {
    this.expect("{");
    const body: Node.Statement[] = [];
    while (this.lookahead.type !== TokenName[Token.EOF]) {
      if (this.match("}")) {
        break;
      }
      // 递归解析
      body.push(this.parseStatementListItem());
    }
    this.expect("}");
    return new Node.BlockStatement(body);
  }

  private parseStatement(): Node.Statement {
    switch (this.lookahead.type) {
      case TokenName[Token.BooleanLiteral]:
      case TokenName[Token.NullLiteral]:
      case TokenName[Token.NumericLiteral]:
      case TokenName[Token.StringLiteral]:
        return this.parseExpressionStatement();
      case TokenName[Token.Punctuator]:
        const value = this.lookahead.value;
        if (value === "{") {
          return this.parseBlock();
        } else if (value === "(") {
          return this.parseExpressionStatement();
        } else {
          this.throwUnexpectedToken(this.lookahead);
        }
      case TokenName[Token.Identifier]:
        return this.parseExpressionStatement();
      case TokenName[Token.Keyword]:
        switch (this.lookahead.value) {
          case "break":
            return this.parseBreakStatement();
          case "continue":
            return this.parseContinueStatement();
          // case "for":
          //   return this.parseForStatement();
          case "function":
            return this.parseFunctionDeclaration();
          // case "if":
          //   return this.parseIfStatement();
          // case "return":
          //   return this.parseReturnStatement();
          // case "var":
          //   return this.parseVariableStatement();
          // case "while":
          //   return this.parseWhileStatement();
          default:
            return this.parseExpressionStatement();
        }

      default:
        this.throwUnexpectedToken(this.lookahead);
    }
    throw new Error("unexpected reached");
  }

  // 解析表达式语句 默认分号结尾
  private parseExpressionStatement(): Node.ExpressionStatement {
    // 不考虑连续表达式 比如 a,b;
    // 不支持解构 比如 const {a,b} = c;
    // 不支持三元表达式 比如 a ? b : c
    // 不支持 [] {} 表达式
    const expr = this.parseAssignmentExpression();
    this.consumeSemicolon();
    return new Node.ExpressionStatement(expr);
  }

  // 解析赋值表达式
  private parseAssignmentExpression(): Node.Expression {
    const expression: Node.Expression = this.parseBinaryExpression();
    if (this.matchAssign()) {
      const token = this.nextToken();
      const operator = token.value as string;
      const right = this.parseAssignmentExpression();
      return new Node.AssignmentExpression(operator, expression, right);
    }

    return expression;
  }

  private parseBinaryExpression(): Node.Expression {
    let expression = this.parseExponentiationExpression();
    const token = this.lookahead;
    let prec = this.binaryPrecedence(token);
    if (prec > 0) {
      let left = expression;
      this.nextToken();
      let right = this.parseExponentiationExpression();
      // 符号栈
      const stack = [left, token.value, right];
      // 优先级栈
      const precedences: number[] = [prec];
      while (true) {
        prec = this.binaryPrecedence(this.lookahead);
        if (prec <= 0) {
          break;
        }
        // 如果当前token的优先级小 比如 1*2+3 *的优先级大于加号 我们就将优先级大的先规约
        while (
          stack.length > 2 &&
          prec <= precedences[precedences.length - 1]
        ) {
          right = stack.pop() as Node.Expression;
          const operator = stack.pop() as string;
          precedences.pop();
          left = stack.pop() as Node.Expression;
          stack.push(new Node.BinaryExpression(operator, left, right));
        }
        // 否则下一个操作符进入栈中
        stack.push(this.nextToken().value);
        precedences.push(prec);
        stack.push(this.parseExponentiationExpression());
      }
      // 将栈中剩余的规约
      let i = stack.length - 1;
      expression = stack[i] as Node.Expression;
      while (i > 1) {
        const operator = stack[i - 1] as string;
        expression = new Node.BinaryExpression(
          operator,
          stack[i - 2] as Node.Expression,
          expression
        );
        i -= 2;
      }
    }

    return expression;
  }

  private binaryPrecedence(token: BufferEntry): number {
    const op = token.value;
    if (token.type === TokenName[Token.Punctuator]) {
      return this.operatorPrecedence[op] || 0;
    } else {
      return 0;
    }
  }

  // 解析指数表达式
  private parseExponentiationExpression(): Node.Expression {
    const expression = this.parseUnaryExpression();
    if (expression.type !== Syntax.UnaryExpression && this.match("**")) {
      this.nextToken();
      const right = this.parseExponentiationExpression();
      return new Node.BinaryExpression("**", expression, right);
    }

    return expression;
  }

  // 解析一元表达式
  private parseUnaryExpression(): Node.Expression {
    if (
      this.match("+") ||
      this.match("-") ||
      this.match("~") ||
      this.match("!")
    ) {
      const token = this.nextToken();
      // 可能嵌套 比如 !!a
      const expression = this.parseUnaryExpression();
      return new Node.UnaryExpression(token.value, expression);
    }

    return this.parseUpdateExpression();
  }

  private parseUpdateExpression(): Node.Expression {
    if (this.match("++") || this.match("--")) {
      const token = this.nextToken();
      const expression = this.parsePrimaryExpression();
      const prefix = true;
      return new Node.UpdateExpression(token.value, expression, prefix);
    } else {
      const expression = this.parsePrimaryExpression();
      if (this.match("++") || this.match("--")) {
        const operator = this.nextToken().value;
        const prefix = false;
        return new Node.UpdateExpression(operator, expression, prefix);
      }
      return expression;
    }
  }

  private parsePrimaryExpression(): Node.Expression {
    switch (this.lookahead.type) {
      case TokenName[Token.Identifier]:
        return new Node.Identifier(this.nextToken().value);
      case TokenName[Token.NumericLiteral]:
      case TokenName[Token.StringLiteral]: {
        const token = this.nextToken();
        return new Node.Literal(token.value);
      }
      case TokenName[Token.BooleanLiteral]: {
        const token = this.nextToken();
        return new Node.Literal(token.value === "true");
      }
      case TokenName[Token.Punctuator]: {
        switch (this.lookahead.value) {
          case "(":
            return this.parseGroupExpression();
        }
      }
      default:
        this.throwUnexpectedToken(this.nextToken());
        throw new Error("unexpected reached");
    }
  }

  private parseGroupExpression(): Node.Expression {
    this.expect("(");
    const expression = this.parseAssignmentExpression();
    this.expect(")");
    return expression;
  }

  private parseBreakStatement(): Node.BreakStatement {
    this.expectKeyword("break");
    this.consumeSemicolon();
    return new Node.BreakStatement();
  }

  private parseContinueStatement(): Node.ContinueStatement {
    this.expectKeyword("continue");
    this.consumeSemicolon();
    return new Node.ContinueStatement();
  }

  // 吃掉关键字
  private expectKeyword(keyword: string) {
    const token = this.nextToken();
    if (token.type !== TokenName[Token.Keyword] || token.value !== keyword) {
      this.throwUnexpectedToken(token);
    }
  }

  // 吃掉标点符号
  private expect(value: string) {
    const token = this.nextToken();
    if (token.type !== TokenName[Token.Punctuator] || token.value !== value) {
      this.throwUnexpectedToken(token);
    }
  }

  // 判断展望串的值是否满足
  private match(value: string) {
    return (
      this.lookahead.type === TokenName[Token.Punctuator] &&
      this.lookahead.value === value
    );
  }

  // 吃掉分号
  private consumeSemicolon() {
    if (this.match(";")) {
      this.nextToken();
    }
  }

  private matchAssign() {
    if (this.lookahead.type !== TokenName[Token.Punctuator]) {
      return false;
    }
    const op = this.lookahead.value;
    return (
      op === "=" ||
      op === "*=" ||
      op === "**=" ||
      op === "/=" ||
      op === "%=" ||
      op === "+=" ||
      op === "-=" ||
      op === "<<=" ||
      op === ">>=" ||
      op === ">>>=" ||
      op === "&=" ||
      op === "^=" ||
      op === "|="
    );
  }

  private throwUnexpectedToken(token: BufferEntry) {
    throw new Error(`unexpected token: ${token.value}`);
  }
}
