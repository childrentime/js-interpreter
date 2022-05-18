import * as Node from "../parser/node";
// 作用域
class Scope {
  private parent: Scope | null;
  private declarations = new Map<string, any>();
  constructor(parentScope: Scope | null) {
    this.parent = parentScope;
  }

  set(name: string, value: any) {
    this.declarations.set(name, value);
  }

  getLocal(name: string) {
    return this.declarations.get(name);
  }

  // 模拟作用域链 向上查找
  get(name: string) {
    let res = this.getLocal(name);
    if (!res && this.parent) {
      res = this.parent.get(name);
    }
    return res;
  }

  has(name: string) {
    return !!this.getLocal(name);
  }
}

const astInterpreters = {
  Program(node: Node.Script, scope: Scope) {
    node.body.forEach((item) => {
      evaluator(item, scope);
    });
  },
  ExpressionStatement(node: Node.ExpressionStatement, scope: Scope) {
    return evaluator(node.expression, scope);
  },
  CallExpression(node: Node.CallExpression, scope: Scope) {
    const args = node.arguments.map((item: Node.Expression) => {
      if (item.type === "Identifier") {
        return scope.get((<Node.Identifier>item).name);
      }
      return evaluator(item, scope);
    });
    if (node.callee.type === "MemberExpression") {
      const fn = evaluator(node.callee, scope);
      const obj = evaluator((<Node.MemberExpression>node.callee).object, scope);
      return fn.apply(obj, args);
    } else {
      const fn = scope.get(evaluator(node.callee, scope));
      return fn.apply(null, args);
    }
  },
  MemberExpression(node: Node.MemberExpression, scope: Scope) {
    const obj = scope.get(evaluator(node.object, scope));
    return obj[evaluator(node.property, scope)];
  },
  Identifier(node: Node.Identifier, scope: Scope) {
    return node.name;
  },
  Literal(node: Node.Literal, scope: Scope) {
    return node.value;
  },
};
//解释器
const evaluator = (node: { type: string }, scope: Scope) => {
  try {
    return astInterpreters[node.type](node, scope);
  } catch (e: unknown) {
    console.error("unsupported ast type: " + node.type);
  }
};

const globalScope = new Scope(null);
globalScope.set("console", {
  log: function (...args: any[]) {
    console.log(...args);
  },
  error: function (...args: any[]) {
    console.log(...args);
  },
});

const evaluate = (node: Node.Script) => {
  return evaluator(node, globalScope);
};

export default evaluate;
