import { interpreter } from "..";

describe("interpreter", () => {
  it("should interpreter global object", () => {
    const input = "console.log(1)";
    interpreter(input);
  });
});
