import { useEffect, useRef, useState } from "react";
import { Application, Graphics } from "pixi.js";
import Box2d from "box2d-wasm";
import "./App.css";

function App() {
  const SCanvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const elements: Box2D.b2Body[] = [];
    Box2d().then((box2d) => {
      const {
        b2World,
        b2Vec2,
        b2BodyDef,
        b2EdgeShape,
        b2PolygonShape,
        b2_dynamicBody,
        b2CircleShape,
      } = box2d;

      const sideLengthMetres = 25;
      const ZERO = new b2Vec2(0, 0);
      const gravity = new b2Vec2(0, 10);
      const world = new b2World(gravity);

      const bd_ground = new b2BodyDef();
      const ground = world.CreateBody(bd_ground);
      const shape = new b2EdgeShape();
      shape.SetTwoSided(new b2Vec2(0, 500), new b2Vec2(500, 500));
      ground.CreateFixture(shape, 0);
      elements.push(ground);

      const square = new b2PolygonShape();
      square.SetAsBox(sideLengthMetres / 2, sideLengthMetres / 2);

      const bd = new b2BodyDef();
      bd.set_type(b2_dynamicBody);
      bd.set_position(ZERO);
      const body = world.CreateBody(bd);
      body.CreateFixture(square, 1);
      elements.push(body);

      const app = new Application({
        width: 500,
        height: 500,
        backgroundColor: 0x1099bb,
        view: SCanvas.current as HTMLCanvasElement,
      });

      function animate() {
        world.Step(1 / 60, 3, 3);
        // console.log("x", body.GetPosition().x, "y", body.GetPosition().y);

        app.stage.removeChildren();
        elements.forEach((element) => {
          console.log(
            "x:",
            element.GetPosition().x,
            "y:",
            element.GetPosition().y
          );
          // render element to canvas with pixi
          const graphics = new Graphics();
          graphics.beginFill(0xff0000);
          graphics.drawCircle(
            element.GetPosition().x,
            element.GetPosition().y,
            10
          );
          graphics.endFill();
          app.stage.addChild(graphics);
        });

        requestAnimationFrame(animate);
      }
      animate();
    });
  }, []);

  return (
    <>
      <h1>test</h1>
      <canvas ref={SCanvas}></canvas>
    </>
  );
}

export default App;
