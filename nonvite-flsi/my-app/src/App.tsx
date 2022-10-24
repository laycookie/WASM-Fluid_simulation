import { useEffect } from "react";
import Box2DFactory from "box2d-wasm";
import "./App.css";

function App() {
  useEffect(() => {
    Box2DFactory().then((box2D: typeof Box2D & EmscriptenModule) => {
      console.log(box2D);
    });
  }, []);
  return (
    <>
      <h1>Hello world</h1>
      <p>test</p>
      <canvas width={500} height={500}></canvas>
    </>
  );
}

export default App;
