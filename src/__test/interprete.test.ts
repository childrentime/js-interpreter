import { interpreter } from "..";

describe("interpreter", () => {
  it("should interpreter global object", () => {
    const input = "console.log(1,2,3,4);console.log(5,6,7,8)";
    const output = interpreter(input);
    expect(output).toStrictEqual([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
    ]);
  });

  it("should interperter global function", () => {
    const input = "console.log(parseInt('1'))";
    const output = interpreter(input);
    expect(output).toStrictEqual([[1]]);
  });

  it("should parse function declarations", () => {
    const input = `function Fibonacci(n) {
      if(n === 1) {
        return 1;
      }
      if(n === 2) {
        return 2;
      }
      return Fibonacci(n-1)+Fibonacci(n-2)
    }
    console.log(Fibonacci(3))`;
    const output = interpreter(input);
    expect(output).toStrictEqual([[3]]);
  });

  it("should parse nested if statement", () => {
    const input = `function Fibonacci(n) {
      if(true){
        if(n === 1) {
          return 1;
        }
      }
      if(n === 2) {
        return 2;
      }
      return Fibonacci(n-1)+Fibonacci(n-2)
    }
    console.log(Fibonacci(5))`;
    const output = interpreter(input);
    expect(output).toStrictEqual([[8]]);
  });

  it("should parse identifiers", () => {
    const input = `var a = 1; console.log(a)`;
    const output = interpreter(input);
    expect(output).toStrictEqual([[1]]);
  });

  it("should parse if else statement", () => {
    const input = `var a = 1;
                    if(a === 2){
                      console.log(3);
                    }else {
                      console.log('right');
                    }`;
    const output = interpreter(input);
    expect(output).toStrictEqual([["right"]]);
  });
});
