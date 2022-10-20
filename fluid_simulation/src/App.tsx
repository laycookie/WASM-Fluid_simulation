import { useEffect, useState } from "react";
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
      <h1>test</h1>
      <h2>test test</h2>
      <canvas width="800" height="600"></canvas>
    </>
  );
}

export default App;
