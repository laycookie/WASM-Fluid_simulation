import { RefObject, useEffect, useRef } from "react";
import Box2DFactory from "box2d-wasm";
import { makeDebugDraw } from "./scripts/debugDraw";
import "./App.css";

interface Point {
  x: number;
  y: number;
}

function App() {
  const SCanvas: RefObject<HTMLCanvasElement> = useRef(null);

  // Create a Box2D instance
  useEffect(() => {
    Box2DFactory().then((box2D: typeof Box2D & EmscriptenModule) => {
      if (!SCanvas.current) return;
      const {
        b2Vec2,
        b2World,
        b2PolygonShape,
        b2BodyDef,
        b2_dynamicBody,
        b2EdgeShape,
      } = box2D;
      const ctx = SCanvas.current.getContext("2d");
      if (!ctx) return;

      const pixelsPerMeter = 32;
      const cameraOffsetMetres: Point = {
        x: 0,
        y: 0,
      };

      const gravity = new b2Vec2(0, 10);
      const world = new b2World(gravity);

      const zero = new b2Vec2(0, 0);
      // creating objects
      const bd_ground = new b2BodyDef();
      const floorShape = new b2EdgeShape();
      floorShape.SetTwoSided(new b2Vec2(0, 9.4), new b2Vec2(18.7, 9.4));
      const ground = world.CreateBody(bd_ground);
      ground.CreateFixture(floorShape, 0);

      const square = new b2PolygonShape();
      square.SetAsBox(0.5, 1);
      const AmounthOfBoxes = 10;
      for (let i = 0; i < AmounthOfBoxes; i++) {
        const bd_sqr = new b2BodyDef();
        bd_sqr.set_type(b2_dynamicBody);
        bd_sqr.set_position(new b2Vec2(10, 0));
        const sqr = world.CreateBody(bd_sqr);
        sqr.CreateFixture(square, 1);
        sqr.SetLinearVelocity(zero);
        sqr.SetAwake(true);
        sqr.SetEnabled(true);
      }

      // === misc ===
      // calculate no more than a 60th of a second during one world.Step() call
      const maxTimeStepMs = (1 / 60) * 1000;
      const velocityIterations = 1;
      const positionIterations = 1;

      /**
       * Advances the world's physics by the requested number of milliseconds
       * @param {number} deltaMs
       */
      const step = (deltaMs: number) => {
        const clampedDeltaMs = Math.min(deltaMs, maxTimeStepMs);
        world.Step(
          clampedDeltaMs / 1000,
          velocityIterations,
          positionIterations
        );
      };
      // === rendering ===
      const drawCanvas = () => {
        if (!SCanvas.current) return;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, SCanvas.current.width, SCanvas.current.height);

        ctx.save();
        ctx.scale(pixelsPerMeter / 2, pixelsPerMeter / 2);
        const { x, y } = cameraOffsetMetres;
        ctx.translate(x, y);
        ctx.lineWidth /= pixelsPerMeter;

        ctx.fillStyle = "rgb(255,255,0)";
        world.DebugDraw();

        ctx.restore();
      };

      /** @type {number} you can use this handle to cancel the callback via cancelAnimationFrame */
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let handle;
      (function loop(prevMs) {
        // runs code every new frame
        const nowMs = window.performance.now();
        handle = requestAnimationFrame(loop.bind(null, nowMs));
        const deltaMs = nowMs - prevMs;
        step(deltaMs);
        drawCanvas();
      })(window.performance.now());
      const debugDraw = makeDebugDraw(ctx, pixelsPerMeter, box2D);
      world.SetDebugDraw(debugDraw);
    });
  }, []);
  return (
    <>
      <canvas ref={SCanvas} id="SCanvas"></canvas>
    </>
  );
}

export default App;
