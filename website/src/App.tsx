import Editor from "@monaco-editor/react";

function App() {
  return (
    <div className="container">
      <div className="left">
        <Editor
          defaultLanguage="javascript"
          defaultValue="console.log('hello world');"
        />
      </div>
      <div className="right"></div>
    </div>
  );
}

export default App;
