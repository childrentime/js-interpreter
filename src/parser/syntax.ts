export const Syntax = {
  /*--------------------表达式----------------------*/
  // 赋值表达式 比如 b = a+c;
  AssignmentExpression: "AssignmentExpression",
  // 一元表达式 比如 +1
  UnaryExpression: "UnaryExpression",
  // 自增表达式 比如 a++
  UpdateExpression: "UpdateExpression",
  // 计算表达式 比如 a+b
  BinaryExpression: "BinaryExpression",
  // 逻辑表达式 比如 a && b
  LogicalExpression: "LogicalExpression",
  // 成员表达式 比如 a.b
  MemberExpression: "MemberExpression",
  // 函数调用表达式 比如 a();
  CallExpression: "CallExpression",

  /*----------声明---------------*/
  // 标识符 比如 a b
  Identifier: "Identifier",
  // 变量声明 比如 var a = 1
  VariableDeclaration: "VariableDeclaration",
  // 变量声明器 比如 var a = 1; 中的 a=1
  VariableDeclarator: "VariableDeclarator",
  // 函数声明 比如 function a(){}
  FunctionDeclaration: "FunctionDeclaration",

  /*-------------------语句-----------------*/
  // while 语句
  WhileStatement: "WhileStatement",
  // break 语句
  BreakStatement: "BreakStatement",
  // continue 语句
  ContinueStatement: "ContinueStatement",
  // 块语句 比如 while{}
  BlockStatement: "BlockStatement",
  // if 语句
  IfStatement: "IfStatement",
  // for 语句
  ForStatement: "ForStatement",
  // return 语句
  ReturnStatement: "ReturnStatement",
  // 表达式语句 比如 a++; a; console.log(a); 里面包含有表达式
  ExpressionStatement: "ExpressionStatement",

  /*-------------字面量----------------*/
  // 比如 var a = 1; 中的1
  Literal: "Literal",

  /*----------程序-------------*/
  Program: "Program",
};
