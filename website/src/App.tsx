import Editor from "@monaco-editor/react";
import { useMemo, useState } from "react";

const defaultValue = `function Fibonacci(n) {
  if(n === 1) {
    return 1;
  }
  if(n === 2) {
    return 2;
  }
  return Fibonacci(n-1)+Fibonacci(n-2)
}
console.log(Fibonacci(3))`;
const worker = new Worker(new URL("./worker.ts", import.meta.url));
worker.postMessage(defaultValue);
function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<string>(defaultValue);
  const [result, setResult] = useState<any[][]>([[]]);
  const output = useMemo(
    () =>
      result
        .map((item) => {
          return item.toString();
        })
        .map((item) => <div>{item}</div>),
    [result]
  );
  const handleEditorChange = (value: string | undefined, event: any) => {
    setValue(value!);
  };
  worker.onmessage = (event: MessageEvent) => {
    const output = event.data;
    setLoading(false);
    setResult(output);
  };

  return (
    <div className="container">
      <div className="operation">
        <button
          onClick={() => {
            setLoading(true);
            worker.postMessage(value);
          }}
        >
          运行
        </button>
      </div>
      <div className="editor">
        <div className="left">
          <Editor
            defaultLanguage="javascript"
            defaultValue={defaultValue}
            onChange={handleEditorChange}
          />
        </div>
        <div className="right">{loading ? "Loading..." : output}</div>
      </div>
    </div>
  );
}

export default App;
