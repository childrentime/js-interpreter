export const enum Token {
  BooleanLiteral = 1,
  Identifier,
  Keyword,
  NullLiteral,
  NumericLiteral,
  Punctuator,
  StringLiteral,
  EOF,
}

export const TokenName = {};
TokenName[Token.BooleanLiteral] = "Boolean";
TokenName[Token.Identifier] = "Identifier";
TokenName[Token.Keyword] = "Keyword";
TokenName[Token.NullLiteral] = "Null";
TokenName[Token.NumericLiteral] = "Numeric";
TokenName[Token.Punctuator] = "Punctuator";
TokenName[Token.StringLiteral] = "String";
TokenName[Token.EOF] = "<end>";
