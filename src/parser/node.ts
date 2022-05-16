import { Syntax } from "./syntax";

/*------------表达式----------*/
export type Expression =
  | AssignmentExpression
  | UnaryExpression
  | UpdateExpression
  | BinaryExpression
  | ComputedMemberExpression
  | CallExpression
  | Identifier
  | Literal;

export class AssignmentExpression {
  readonly type: string;
  readonly operator: string;
  readonly left: Expression;
  readonly right: Expression;
  constructor(operator: string, left: Expression, right: Expression) {
    this.type = Syntax.AssignmentExpression;
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

export class UnaryExpression {
  readonly type: string;
  readonly operator: string;
  readonly argument: Expression;
  readonly prefix: boolean;
  constructor(operator: string, argument: Expression) {
    this.type = Syntax.UnaryExpression;
    this.operator = operator;
    this.argument = argument;
    this.prefix = true;
  }
}

export class UpdateExpression {
  readonly type: string;
  readonly operator: string;
  readonly argument: Expression;
  readonly prefix: boolean;
  constructor(operator: string, argument: Expression, prefix: boolean) {
    this.type = Syntax.UpdateExpression;
    this.operator = operator;
    this.argument = argument;
    this.prefix = prefix;
  }
}

// 计算或者逻辑表达式
export class BinaryExpression {
  readonly type: string;
  readonly operator: string;
  readonly left: Expression;
  readonly right: Expression;
  constructor(operator: string, left: Expression, right: Expression) {
    const logical = operator === "||" || operator === "&&" || operator === "??";
    this.type = logical ? Syntax.LogicalExpression : Syntax.BinaryExpression;
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

// 如果是 a[b]这样的 那么 computed属性为 true
export class ComputedMemberExpression {
  readonly type: string;
  readonly computed: boolean;
  readonly object: Expression;
  readonly property: Expression;
  readonly optional: boolean;
  constructor(object: Expression, property: Expression, optional: boolean) {
    this.type = Syntax.MemberExpression;
    this.computed = true;
    this.object = object;
    this.property = property;
    this.optional = optional;
  }
}

export class CallExpression {
  readonly type: string;
  readonly callee: Expression;
  readonly arguments: Expression[];
  readonly optional: boolean;
  constructor(callee: Expression, args: Expression[], optional: boolean) {
    this.type = Syntax.CallExpression;
    this.callee = callee;
    this.arguments = args;
    this.optional = optional;
  }
}

/*--------------声明----------------*/

export type Declaration =
  | Identifier
  | VariableDeclaration
  | VariableDeclarator
  | FunctionDeclaration;

export class Identifier {
  readonly type: string;
  readonly name: string;
  constructor(name: string) {
    this.type = Syntax.Identifier;
    this.name = name;
  }
}

export class VariableDeclaration {
  readonly type: string;
  readonly declarations: VariableDeclarator[];
  readonly kind: string;
  constructor(declarations: VariableDeclarator[], kind: string) {
    this.type = Syntax.VariableDeclaration;
    this.declarations = declarations;
    this.kind = kind;
  }
}

// 事实上js也支持 var {} ={}; var[] = {};这样的语法 我们不考虑id是这种情况
export class VariableDeclarator {
  readonly type: string;
  readonly id: Identifier;
  readonly init: Expression | null;
  constructor(id: Identifier, init: Expression | null) {
    this.type = Syntax.VariableDeclarator;
    this.id = id;
    this.init = init;
  }
}

// 不考虑函数表达式 生成器 async语法
export class FunctionDeclaration {
  readonly type: string;
  readonly id: Identifier;
  readonly params: Identifier[];
  readonly body: BlockStatement;
  constructor(id: Identifier, params: Identifier[], body: BlockStatement) {
    this.type = Syntax.FunctionDeclaration;
    this.id = id;
    this.params = params;
    this.body = body;
  }
}

/*------------语句------------------*/

export type Statement =
  | WhileStatement
  | BreakStatement
  | ContinueStatement
  | BlockStatement
  | IfStatement
  | ForStatement
  | ReturnStatement
  | ExpressionStatement
  | VariableDeclaration
  | FunctionDeclaration;
// 不考虑 while 不带大括号的情况
export class WhileStatement {
  readonly type: string;
  readonly test: Expression;
  readonly body: BlockStatement;
  constructor(test: Expression, body: BlockStatement) {
    this.type = Syntax.WhileStatement;
    this.test = test;
    this.body = body;
  }
}

// 不考虑 break带的 label标签
export class BreakStatement {
  readonly type: string;
  constructor() {
    this.type = Syntax.BreakStatement;
  }
}

// 不考虑 continue 带的 label 标签
export class ContinueStatement {
  readonly type: string;
  constructor() {
    this.type = Syntax.ContinueStatement;
  }
}

export class BlockStatement {
  readonly type: string;
  readonly body: Statement[];
  constructor(body: Statement[]) {
    this.type = Syntax.BlockStatement;
    this.body = body;
  }
}

export class IfStatement {
  readonly type: string;
  readonly test: Expression;
  // if语句的块
  readonly consequent: BlockStatement;
  // else语句的块
  readonly alternate: BlockStatement | null;
  constructor(
    test: Expression,
    consequent: BlockStatement,
    alternate: BlockStatement | null
  ) {
    this.type = Syntax.IfStatement;
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }
}

export class ForStatement {
  readonly type: string;
  // var a = 1;
  readonly init: VariableDeclaration | null;
  // a <3;
  readonly test: Expression | null;
  // a++
  readonly update: Expression | null;
  body: BlockStatement;
  constructor(
    init: VariableDeclaration | null,
    test: Expression | null,
    update: Expression | null,
    body: BlockStatement
  ) {
    this.type = Syntax.ForStatement;
    this.init = init;
    this.test = test;
    this.update = update;
    this.body = body;
  }
}

export class ReturnStatement {
  readonly type: string;
  readonly argument: Expression | null;
  constructor(argument: Expression | null) {
    this.type = Syntax.ReturnStatement;
    this.argument = argument;
  }
}

export class ExpressionStatement {
  readonly type: string;
  readonly expression: Expression;
  constructor(expression: Expression) {
    this.type = Syntax.ExpressionStatement;
    this.expression = expression;
  }
}
/*-----------字面量-------------*/
export class Literal {
  readonly type: string;
  // 实际值 比如 0x100 这里会是256
  readonly value: boolean | number | string | null;
  // 原值 比如 0x100 这里还是0x100
  // readonly raw: string;
  constructor(value: boolean | number | string | null, raw: string = "") {
    this.type = Syntax.Literal;
    this.value = value;
    // this.raw = raw;
  }
}

/*---------------程序--------------*/

// 为什么划分 因为 比如类声明不在 语句中
export type StatementListItem = Declaration | Statement;

export class Script {
  readonly type: string;
  readonly body: StatementListItem[];
  // 有语句和模块 这里我们只考虑语句
  readonly sourceType: string;
  constructor(body: StatementListItem[]) {
    this.type = Syntax.Program;
    this.body = body;
    this.sourceType = "script";
  }
}
