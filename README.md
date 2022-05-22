# js-interpreter

[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

## Background

This project is my graduation project, the main purpose is to implement a simple javascript interpreter.
<div style = "color: red">Warning: This project only supports simple syntax and has no error handler, For example we don't support new syntax and let const keyword. don't use it for production.
</div>

But maybe it's a good example for you to learn how to write a javascript interpreter because I try to finish it with minimal code.

If you want to add new syntax support, in general, you need to add parsing of the syntax expression in [parse](./src/parser/parse.ts), and then interpret it in [interperter](./src/interpreter/interpreter.ts).

In addition, the interperter of the while statement and for statement in the project is a bit rough.

## Install

This project uses node and npm. Go check them out if you don't have them locally installed.

```sh
npm i @childrentime/js-interpreter
```

## Usage

```ts
import { interpreter } from "@childrentime/js-interpreter";
const result = interpreter(`var a = 1; console.log(a)`);
console.log(result); // [[1]]
```

The output of each console statement will be contained in an array so the result is a two-dimensional array

### Living Demo

You can experience it in real time [here](https://js-interpreter.vercel.app/).

<div style = "color: red">Warning: It is best not to enter infinite loop code</div>

#### test cases

Alternatively, you can view its test files [here](./src/__test//interprete.test.ts).

## API

```ts
export { tokenizer, parse, interpreter };
const code = 'var a = 1;';
const tokens: { type: string, value: string | number }[] = tokenizer(code);
const ast = parse(code);
const interpreter: any[][] = interpreter(code);
```

## License

[MIT](LICENSE) © ChildrenTime
