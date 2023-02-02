import { useEffect, useRef, useState } from "react";
import { Application, Graphics } from "pixi.js";
import Box2d from "box2d-wasm";
import "./App.css";

function App() {
  const SCanvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    Box2d().then((box2d) => {
      const {
        b2World,
        b2Vec2,
        b2BodyDef,
        b2EdgeShape,
        b2PolygonShape,
        b2_dynamicBody,
        b2CircleShape,
        b2ParticleSystemDef,
        b2ParticleGroupDef,
        b2ParticleColor,
      } = box2d;

      const sideLengthMetres = 25;
      const gravity = new b2Vec2(0, 10);
      const world = new b2World(gravity);

      // create walls
      const bd_ground = new b2BodyDef();
      const groundWall = world.CreateBody(bd_ground);
      const rightWall = world.CreateBody(bd_ground);
      const leftWall = world.CreateBody(bd_ground);
      const roofWall = world.CreateBody(bd_ground);
      const wallShape = new b2EdgeShape();
      wallShape.SetTwoSided(new b2Vec2(0, 500), new b2Vec2(500, 500));
      groundWall.CreateFixture(wallShape, 0);
      wallShape.SetTwoSided(new b2Vec2(0, 0), new b2Vec2(500, 0));
      roofWall.CreateFixture(wallShape, 0);
      wallShape.SetTwoSided(new b2Vec2(500, 0), new b2Vec2(500, 500));
      rightWall.CreateFixture(wallShape, 0);
      wallShape.SetTwoSided(new b2Vec2(0, 0), new b2Vec2(0, 500));
      leftWall.CreateFixture(wallShape, 0);

      // Create a square
      const square = new b2PolygonShape();
      const sqrSize = 25;
      square.SetAsBox(sqrSize, sqrSize);
      const bd = new b2BodyDef();
      bd.set_type(b2_dynamicBody);
      bd.set_position(new b2Vec2(50, 40));
      const body = world.CreateBody(bd);
      body.CreateFixture(square, 1);

      // create liquid system
      const psd = new b2ParticleSystemDef();
      psd.set_radius(0.1);
      const particleSystem = world.CreateParticleSystem(psd);
      particleSystem.SetMaxParticleCount(5000);

      // spawn liquid
      const circle = new b2CircleShape();
      circle.set_m_radius(1);
      function spawnLiquid(x: number, y: number) {
        const pd = new b2ParticleGroupDef();
        pd.set_shape(circle);
        pd.set_color(new b2ParticleColor(0, 0, 255, 255));
        pd.set_position(new b2Vec2(x, y));
        let group = particleSystem.CreateParticleGroup(pd);
        return group;
      }

      const app = new Application({
        width: 500,
        height: 500,
        backgroundColor: 0x1099bb,
        view: SCanvas.current as HTMLCanvasElement,
      });

      function animate() {
        world.Step(1 / 60, 3, 3);
        app.stage.removeChildren();
        // Following for loop is iterating through all the elements in the world, keep in mind the world is a linked list
        const graphics = new Graphics();
        graphics.beginFill(0xff0000);

        for (
          let objList = world.GetBodyList();
          objList.GetNext() !== objList;
          objList = objList.GetNext()
        ) {
          // render element to canvas with pixi
          switch (objList.GetType()) {
            case 0:
              break;
            case 2:
              // render square
              graphics.drawRect(
                objList.GetPosition().x,
                objList.GetPosition().y,
                sqrSize,
                sqrSize
              );
              break;
          }
        }
        graphics.endFill();
        app.stage.addChild(graphics);

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
