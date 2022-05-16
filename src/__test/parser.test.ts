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
                value: "1",
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
    console.log(JSON.stringify(ast, null, 2));
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
                      value: "1",
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
});
