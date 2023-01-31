import { useEffect, useState, useRef, RefObject } from "react";
import reactLogo from "./assets/react.svg";
import RAPIER, { RigidBodyDesc } from "@dimforge/rapier2d-compat";
import * as PIXI from "pixi.js";
import "./App.css";

function App() {
  const SCanvas: RefObject<HTMLCanvasElement> = useRef(null);

  useEffect(() => {
    if (SCanvas.current === null) {
      console.error("Canvas not found");
      return;
    }

    async function run_simulation() {
      await RAPIER.init();
      // Run the simulation.
      let world = new RAPIER.World({ x: 0.0, y: 0.5 });

      interface RigidBody extends RAPIER.RigidBody {
        color?: number;
      }
      function createBody(x: number, y: number, color: number) {
        let rigidBody: RigidBody = world.createRigidBody(
          RAPIER.RigidBodyDesc.dynamic()
            .setAngularDamping(0)
            .setCanSleep(false)
            .setCcdEnabled(true)
            .setTranslation(x, y)
        );

        rigidBody.color = color;

        let collider = world.createCollider(
          RAPIER.ColliderDesc.ball(10).setFriction(0).setRestitution(1),
          rigidBody
        );
        return rigidBody;
      }
      function createWall(
        x: number,
        y: number,
        width: number,
        height: number,
        color: number
      ) {
        let rigidBody: RigidBody = world.createRigidBody(
          RAPIER.RigidBodyDesc.fixed().setTranslation(x, y)
        );
        rigidBody.color = color;
        let collider = world.createCollider(
          RAPIER.ColliderDesc.cuboid(width, height),
          rigidBody
        );
        return rigidBody;
      }
      let rigidBody = createBody(50, 0, 0xff0000);
      let rigidBody1 = createBody(100, 0, 0x00ff00);
      let ground = createWall(50, 250, 1000, 10, 0x0000ff);

      const ridgedBodiesRender = [rigidBody, rigidBody1, ground];
      // set up the rendering
      if (SCanvas.current === null) return;
      const app = new PIXI.Application({
        width: 500,
        height: 500,
        view: SCanvas.current as HTMLCanvasElement,
        backgroundColor: 0xeeeeee,
        antialias: true,
      });
      // render rigid bodies from rapier to pixi

      // function drawFromRapierrigidBody(bodies: RigidBody[]) {
      //   bodies.forEach((body) => {
      //     let position = body.translation();
      //     let angle = body.rotation();
      //     ctx.save();
      //     ctx.translate(position.x, -position.y);
      //     ctx.rotate(angle);
      //     ctx.beginPath();
      //     ctx.arc(0, 0, 10, 0, 2 * Math.PI);
      //     ctx.fillStyle = body.color as string;
      //     ctx.fill();
      //     ctx.restore();
      //   });
      // }
      function renderRapier(bodies: RigidBody[]) {
        app.stage.removeChildren();
        bodies.forEach((body) => {
          let position = body.translation();
          let angle = body.rotation();
          let graphics = new PIXI.Graphics();
          graphics.beginFill(body.color as number);
          graphics.drawCircle(position.x, position.y, 10);
          graphics.endFill();
          app.stage.addChild(graphics);
        });
      }
      function animate(time: unknown) {
        requestAnimationFrame(animate);
        world.step();
        console.log(rigidBody.translation());
        console.log(rigidBody1.translation());
        renderRapier(ridgedBodiesRender);
      }
      requestAnimationFrame(animate);
    }
    run_simulation();
  }, []);
  return (
    <>
      <h1>test</h1>
      <canvas ref={SCanvas}></canvas>
    </>
  );
}

export default App;
