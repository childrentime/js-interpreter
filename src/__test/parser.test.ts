import { parse } from "..";
import * as Node from "../parser/node";

describe("parse", () => {
  it("should parse binary expression", () => {
    const input = "a+b*c";
    const ast = parse(input);
    const node: Node.Script = {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "Identifier",
              name: "a",
            },
            right: {
              type: "BinaryExpression",
              operator: "*",
              left: {
                type: "Identifier",
                name: "b",
              },
              right: {
                type: "Identifier",
                name: "c",
              },
            },
          },
        },
      ],
      sourceType: "script",
    };
    expect(JSON.stringify(ast)).toStrictEqual(JSON.stringify(node));
  });

  it("should parse assignment", () => {
    const input = "a = 1";
    const ast = parse(input);
    expect(JSON.stringify(ast)).toStrictEqual(
      JSON.stringify({
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "AssignmentExpression",
              operator: "=",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "Literal",
                value: 1,
              },
            },
          },
        ],
        sourceType: "script",
      })
    );
  });

  it("should parse group expression", () => {
    const input = "(a+b)*c";
    const ast = parse(input);
    expect(JSON.stringify(ast)).toStrictEqual(
      JSON.stringify({
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "BinaryExpression",
              operator: "*",
              left: {
                type: "BinaryExpression",
                operator: "+",
                left: {
                  type: "Identifier",
                  name: "a",
                },
                right: {
                  type: "Identifier",
                  name: "b",
                },
              },
              right: {
                type: "Identifier",
                name: "c",
              },
            },
          },
        ],
        sourceType: "script",
      })
    );
  });

  it("should parse function declarations", () => {
    const input = "function a(param1,param2){b=1}";
    const ast = parse(input);
    expect(JSON.stringify(ast)).toStrictEqual(
      JSON.stringify({
        type: "Program",
        body: [
          {
            type: "FunctionDeclaration",
            id: {
              type: "Identifier",
              name: "a",
            },
            params: [
              {
                type: "Identifier",
                name: "param1",
              },
              {
                type: "Identifier",
                name: "param2",
              },
            ],
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "AssignmentExpression",
                    operator: "=",
                    left: {
                      type: "Identifier",
                      name: "b",
                    },
                    right: {
                      type: "Literal",
                      value: 1,
                    },
                  },
                },
              ],
            },
          },
        ],
        sourceType: "script",
      })
    );
  });

  it("should parse var declaration", () => {
    const input = "var a = 1;";
    const ast = parse(input);
    expect(JSON.stringify(ast)).toStrictEqual(
      JSON.stringify({
        type: "Program",
        body: [
          {
            type: "VariableDeclaration",
            declarations: [
              {
                type: "VariableDeclarator",
                id: {
                  type: "Identifier",
                  name: "a",
                },
                init: {
                  type: "Literal",
                  value: 1,
                },
              },
            ],
            kind: "var",
          },
        ],
        sourceType: "script",
      })
    );
  });

  it("should parse for statement", () => {
    const input = `for(var a =1; a<3;a++){
      var b = 1;
    }`;
    const ast = parse(input);
    expect(JSON.stringify(ast)).toStrictEqual(
      JSON.stringify({
        type: "Program",
        body: [
          {
            type: "ForStatement",
            init: {
              type: "VariableDeclaration",
              declarations: [
                {
                  type: "VariableDeclarator",
                  id: {
                    type: "Identifier",
                    name: "a",
                  },
                  init: {
                    type: "Literal",
                    value: 1,
                  },
                },
              ],
              kind: "var",
            },
            test: {
              type: "BinaryExpression",
              operator: "<",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "Literal",
                value: 3,
              },
            },
            update: {
              type: "UpdateExpression",
              operator: "++",
              argument: {
                type: "Identifier",
                name: "a",
              },
              prefix: false,
            },
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "VariableDeclaration",
                  declarations: [
                    {
                      type: "VariableDeclarator",
                      id: {
                        type: "Identifier",
                        name: "b",
                      },
                      init: {
                        type: "Literal",
                        value: 1,
                      },
                    },
                  ],
                  kind: "var",
                },
              ],
            },
          },
        ],
        sourceType: "script",
      })
    );
  });

  it("should parse if statement", () => {
    const input = `if(a === 1){
      a = 2;
    }else {
      a = 3;
    }`;
    const ast = parse(input);
    expect(JSON.stringify(ast)).toStrictEqual(
      JSON.stringify({
        type: "Program",
        body: [
          {
            type: "IfStatement",
            test: {
              type: "BinaryExpression",
              operator: "===",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "Literal",
                value: 1,
              },
            },
            consequent: {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "AssignmentExpression",
                    operator: "=",
                    left: {
                      type: "Identifier",
                      name: "a",
                    },
                    right: {
                      type: "Literal",
                      value: 2,
                    },
                  },
                },
              ],
            },
            alternate: {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "AssignmentExpression",
                    operator: "=",
                    left: {
                      type: "Identifier",
                      name: "a",
                    },
                    right: {
                      type: "Literal",
                      value: 3,
                    },
                  },
                },
              ],
            },
          },
        ],
        sourceType: "script",
      })
    );
  });

  it("should parse return statement", () => {
    const input = `function a(){
      return 1+2;
    }`;
    const ast = parse(input);
    expect(JSON.stringify(ast)).toStrictEqual(
      JSON.stringify({
        type: "Program",
        body: [
          {
            type: "FunctionDeclaration",
            id: {
              type: "Identifier",
              name: "a",
            },
            params: [],
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "ReturnStatement",
                  argument: {
                    type: "BinaryExpression",
                    operator: "+",
                    left: {
                      type: "Literal",
                      value: 1,
                    },
                    right: {
                      type: "Literal",
                      value: 2,
                    },
                  },
                },
              ],
            },
          },
        ],
        sourceType: "script",
      })
    );
  });

  it("should test while statement", () => {
    const input = `while(a === 1){
      var b = 2;
    }`;
    const ast = parse(input);
    expect(JSON.stringify(ast)).toStrictEqual(
      JSON.stringify({
        type: "Program",
        body: [
          {
            type: "WhileStatement",
            test: {
              type: "BinaryExpression",
              operator: "===",
              left: {
                type: "Identifier",
                name: "a",
              },
              right: {
                type: "Literal",
                value: 1,
              },
            },
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "VariableDeclaration",
                  declarations: [
                    {
                      type: "VariableDeclarator",
                      id: {
                        type: "Identifier",
                        name: "b",
                      },
                      init: {
                        type: "Literal",
                        value: 2,
                      },
                    },
                  ],
                  kind: "var",
                },
              ],
            },
          },
        ],
        sourceType: "script",
      })
    );
  });

  it("should parse call expression", () => {
    const input = "a(b,c,d)";
    const ast = parse(input);
    expect(JSON.stringify(ast)).toStrictEqual(
      JSON.stringify({
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "a",
              },
              arguments: [
                {
                  type: "Identifier",
                  name: "b",
                },
                {
                  type: "Identifier",
                  name: "c",
                },
                {
                  type: "Identifier",
                  name: "d",
                },
              ],
            },
          },
        ],
        sourceType: "script",
      })
    );
  });

  it("should parse member expression", () => {
    const input = "a.b.c";
    const ast = parse(input);
    expect(JSON.stringify(ast)).toStrictEqual(
      JSON.stringify({
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "MemberExpression",
              object: {
                type: "MemberExpression",
                object: {
                  type: "Identifier",
                  name: "a",
                },
                property: {
                  type: "Identifier",
                  name: "b",
                },
              },
              property: {
                type: "Identifier",
                name: "c",
              },
            },
          },
        ],
        sourceType: "script",
      })
    );
  });

  it("should parse member & call", () => {
    const input = "console.log(a)";
    const ast = parse(input);
    expect(JSON.stringify(ast)).toStrictEqual(
      JSON.stringify({
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: {
                type: "MemberExpression",
                object: {
                  type: "Identifier",
                  name: "console",
                },
                property: {
                  type: "Identifier",
                  name: "log",
                },
              },
              arguments: [
                {
                  type: "Identifier",
                  name: "a",
                },
              ],
            },
          },
        ],
        sourceType: "script",
      })
    );
  });

  it("should parse call expression", () => {
    const input = "console.log(1)";
    const ast = parse(input);
    expect(JSON.stringify(ast)).toStrictEqual(
      JSON.stringify({
        type: "Program",
        body: [
          {
            type: "ExpressionStatement",
            expression: {
              type: "CallExpression",
              callee: {
                type: "MemberExpression",
                object: {
                  type: "Identifier",
                  name: "console",
                },
                property: {
                  type: "Identifier",
                  name: "log",
                },
              },
              arguments: [
                {
                  type: "Literal",
                  value: 1,
                },
              ],
            },
          },
        ],
        sourceType: "script",
      })
    );
  });
});
