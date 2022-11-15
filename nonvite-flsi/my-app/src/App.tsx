import { RefObject, useEffect, useRef, useState } from "react";
import Box2DFactory from "box2d-wasm";
import type { DrawBuffer } from "./scripts/debugDraw";
import { debugDraw } from "./scripts/debugDraw";
import "./App.css";

interface Point {
  x: number;
  y: number;
}

function App() {
  const SCanvas: RefObject<HTMLCanvasElement> = useRef(null);
  // Sizes the canvas to the window (You can not do it trought the css becouse css will just strech the canvas)
  const [windowDimansions, setWindowDimansions] = useState<Point>({
    x: window.innerWidth,
    y: window.innerHeight,
  });
  useEffect(() => {
    function updateWindowDimansions() {
      setWindowDimansions({ x: window.innerWidth, y: window.innerHeight });
    }
    window.addEventListener("resize", updateWindowDimansions);
    updateWindowDimansions();
  }, []);
  useEffect(() => {
    if (!SCanvas.current) return;
    SCanvas.current.width = windowDimansions.x;
    SCanvas.current.height = windowDimansions.y;
  }, [windowDimansions]);

  // Create a Box2D instance
  useEffect(() => {
    Box2DFactory().then((box2D: typeof Box2D & EmscriptenModule) => {
      if (!SCanvas.current) return;
      const {
        b2Vec2,
        b2_elasticParticle,
        b2World,
        b2PolygonShape,
        b2CircleShape,
        b2BodyDef,
        b2_dynamicBody,
        b2EdgeShape,
        b2ParticleSystemDef,
        b2ParticleGroupDef,
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
      // === creating objects ===
      // walls
      let walls: Box2D.b2Body;
      function createBorderWalls(windowDimansionsLocal: Point) {
        const bd_walls = new b2BodyDef();
        const floorShape = new b2EdgeShape();
        floorShape.SetTwoSided(
          new b2Vec2(0, (windowDimansionsLocal.y + 0) / pixelsPerMeter),
          new b2Vec2(
            windowDimansionsLocal.x / pixelsPerMeter,
            (windowDimansionsLocal.y + 0) / pixelsPerMeter
          )
        );
        const roofShape = new b2EdgeShape();
        roofShape.SetTwoSided(
          new b2Vec2(0, 0),
          new b2Vec2(windowDimansionsLocal.x / pixelsPerMeter, 0)
        );
        const rightWallShape = new b2EdgeShape();
        rightWallShape.SetTwoSided(
          new b2Vec2(windowDimansionsLocal.x / pixelsPerMeter, 0),
          new b2Vec2(
            windowDimansionsLocal.x / pixelsPerMeter,
            (windowDimansionsLocal.y + 0) / pixelsPerMeter
          )
        );
        const leftWallShape = new b2EdgeShape();
        leftWallShape.SetTwoSided(
          new b2Vec2(0, (windowDimansionsLocal.y + 0) / pixelsPerMeter),
          new b2Vec2(0, 0)
        );
        walls = world.CreateBody(bd_walls);
        walls.CreateFixture(floorShape, 0);
        walls.CreateFixture(roofShape, 0);
        walls.CreateFixture(rightWallShape, 0);
        walls.CreateFixture(leftWallShape, 0);
      }
      createBorderWalls(windowDimansions);
      window.onresize = () => {
        const windowDimansionsLocal: Point = {
          x: window.innerWidth,
          y: window.innerHeight,
        };
        world.DestroyBody(walls);
        createBorderWalls(windowDimansionsLocal);
      };

      // particles
      const square = new b2PolygonShape();
      square.SetAsBox(0.5, 1);
      const AmounthOfBoxes = 1;
      for (let i = 0; i < AmounthOfBoxes; i++) {
        const bd_sqr = new b2BodyDef();
        bd_sqr.set_type(b2_dynamicBody);
        bd_sqr.set_position(new b2Vec2(10, 2));
        bd_sqr.set_awake(true);
        bd_sqr.set_linearVelocity(zero);
        const sqr = world.CreateBody(bd_sqr);
        sqr.CreateFixture(square, 1);
        sqr.SetEnabled(true);
      }

      // liquid
      const psd = new b2ParticleSystemDef();
      const particleGroupDef = new b2ParticleGroupDef();
      const liqShape = new b2PolygonShape();

      liqShape.SetAsBox(5, 5);

      particleGroupDef.shape = liqShape;
      particleGroupDef.flags = b2_elasticParticle;
      particleGroupDef.color.Set(0, 0, 255, 255);
      particleGroupDef.position.Set(10, 5);

      psd.radius = 0.25;
      psd.dampingStrength = 0.2;
      psd.gravityScale = 0.4;

      const particleSystem: Box2D.b2ParticleSystem =
        world.CreateParticleSystem(psd);
      particleSystem.CreateParticleGroup(particleGroupDef);

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
        ctx.scale(pixelsPerMeter, pixelsPerMeter);
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
      world.SetDebugDraw(debugDraw);
    });
  }, []);
  return (
    <>
      <canvas ref={SCanvas} id="SCanvas" height={500} width={500}></canvas>
    </>
  );
}

export default App;
