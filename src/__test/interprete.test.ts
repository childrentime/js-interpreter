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

  it("should interpreter function declarations", () => {
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

  it("should interpreter nested if statement", () => {
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

  it("should interpreter identifiers", () => {
    const input = `var a = 1; console.log(a)`;
    const output = interpreter(input);
    expect(output).toStrictEqual([[1]]);
  });

  it("should interpreter if else statement", () => {
    const input = `var a = 1;
                    if(a === 2){
                      console.log(3);
                    }else {
                      console.log('right');
                    }`;
    const output = interpreter(input);
    expect(output).toStrictEqual([["right"]]);
  });

  it("should interpreter while statement", () => {
    const input = `var a = 10;
                    while(a !== 1){
                      console.log(a);
                      a--;
                    }`;

    const output = interpreter(input);
    expect(output).toStrictEqual([
      [10],
      [9],
      [8],
      [7],
      [6],
      [5],
      [4],
      [3],
      [2],
    ]);
  });

  it("should interpreter break statement", () => {
    const input = `var a = 10;
    while(true){
      console.log(a);
      a--;
      if(a === 5){
        break;
      }
    }`;
    const output = interpreter(input);
    expect(output).toStrictEqual([[10], [9], [8], [7], [6]]);
  });

  it("should interpreter for statement", () => {
    const input = `for(var a = 1; a < 10; a++){
      console.log(a);
    }`;
    const output = interpreter(input);
    expect(output).toStrictEqual([[1], [2], [3], [4], [5], [6], [7], [8], [9]]);
  });

  it("should interpreter for break statement", () => {
    const input = `for(var a = 1; a < 10; a++){
      console.log(a);
      if(a === 5){
        break;
      }
    }`;
    const output = interpreter(input);
    expect(output).toStrictEqual([[1], [2], [3], [4], [5]]);
  });

  it("should interpreter math function", () => {
    const input = "console.log(Math.max(1,2))";
    const output = interpreter(input);
    expect(output).toStrictEqual([[2]]);
  });

  it("should interpreter array", () => {
    const input = `var arr = Array.from('1235'); console.log(arr);`;
    const output = interpreter(input);
    expect(output).toStrictEqual([[["1", "2", "3", "5"]]]);
  });
});
