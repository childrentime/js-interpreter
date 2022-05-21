import { interpreter } from "@childrentime/js-interpreter";

// eslint-disable-next-line no-restricted-globals
const ctx = self as unknown as Worker;

ctx.onmessage = (event: MessageEvent) => {
  const input = event.data;
  const output = interpreter(input);
  ctx.postMessage(output);
};

ctx.onerror = (event: ErrorEvent) => {
  ctx.terminate();
};
