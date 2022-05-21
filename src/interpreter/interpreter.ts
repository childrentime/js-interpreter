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
  VariableDeclaration(node: Node.VariableDeclaration, scope: Scope) {
    for (const declaration of node.declarations) {
      scope.set(declaration.id.name, evaluator(declaration.init, scope));
    }
  },
  FunctionDeclaration(node: Node.FunctionDeclaration, scope: Scope) {
    // 函数名称
    const declareName = evaluator(node.id, scope);
    // 设置函数作用域
    scope.set(declareName, function <
      F extends (...arg: any[]) => any
    >(this: ThisParameterType<F>, ...args: Parameters<F>) {
      const funcScope = new Scope(scope);

      node.params.forEach((item, index) => {
        funcScope.set(item.name, args[index]);
      });
      funcScope.set("this", this);
      return evaluator(node.body, funcScope);
    });
  },
  // 块语句中 我们需要检测所有的 return 语句
  BlockStatement(node: Node.BlockStatement, scope: Scope) {
    scope.set("return", false);
    for (let i = 0; i < node.body.length; i++) {
      // 如果有语句将 return 修改为 true 则终止
      const v = evaluator(node.body[i], scope);
      if (scope.get("return")) {
        return v;
      }
    }
  },
  IfStatement(node: Node.IfStatement, scope: Scope) {
    const test = evaluator(node.test, scope);
    if (test) {
      // 执行完块的语句后 返回块的值
      const v = evaluator(node.consequent, scope);
      return v;
    } else if (node.alternate != null) {
      const v = evaluator(node.alternate, scope);
      return v;
    }
  },
  ReturnStatement(node: Node.ReturnStatement, scope: Scope) {
    scope.set("return", true);
    return evaluator(node.argument, scope);
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
  BinaryExpression(node: Node.BinaryExpression, scope: Scope) {
    const getIdentifierValue = (node: any, scope: Scope) => {
      if (node.type === "Identifier") {
        return scope.get(node.name);
      } else {
        return evaluator(node, scope);
      }
    };
    const leftValue = getIdentifierValue(node.left, scope);
    const rightValue = getIdentifierValue(node.right, scope);

    switch (node.operator) {
      case "+":
        return leftValue + rightValue;
      case "-":
        return leftValue - rightValue;
      case "*":
        return leftValue * rightValue;
      case "/":
        return leftValue / rightValue;
      case "==":
      case "===":
        return leftValue === rightValue;
      default:
        throw Error("upsupported operator：" + node.operator);
    }
  },
  Identifier(node: Node.Identifier) {
    return node.name;
  },
  Literal(node: Node.Literal) {
    return node.value;
  },
};
//解释器
const evaluator = (node: { type: string } | null, scope: Scope): any => {
  if (!node) {
    return undefined;
  }
  try {
    return astInterpreters[node.type](node, scope);
  } catch (e: unknown) {
    console.error("unsupported ast type: " + node.type);
  }
};

const evaluate = (node: Node.Script): any => {
  const globalScope = new Scope(null);
  const output: any[][] = [];
  globalScope.set("console", {
    log: function (...args: any[]) {
      output.push([...args]);
    },
  });
  globalScope.set("parseInt", parseInt);
  evaluator(node, globalScope);
  return output;
};

export default evaluate;
