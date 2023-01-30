import { useEffect, useState, useRef, RefObject } from "react";
import reactLogo from "./assets/react.svg";
import RAPIER, { RigidBodyDesc } from "@dimforge/rapier2d-compat";
import "./App.css";

function App() {
  const SCanvas: RefObject<HTMLCanvasElement> = useRef(null);

  useEffect(() => {
    if (SCanvas.current === null) {
      console.error("Canvas not found");
      return;
    }
    const ctx: CanvasRenderingContext2D = SCanvas.current.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    async function run_simulation() {
      await RAPIER.init();
      // Run the simulation.
      let world = new RAPIER.World({ x: 0.0, y: -0.5 });

      function createBody() {
        let rigidBody = world.createRigidBody(
          RAPIER.RigidBodyDesc.dynamic()
            .setAngularDamping(0)
            .setCanSleep(false)
            .setCcdEnabled(true)
            .setTranslation(50, 0)
        );

        let collider = world.createCollider(
          RAPIER.ColliderDesc.ball(10).setFriction(0).setRestitution(1),
          rigidBody
        );
        return rigidBody;
      }
      let rigidBody = createBody();

      const ridgedBodiesRender = [rigidBody];
      // set up the rendering
      function drawFromRapierrigidBody(bodies: RAPIER.RigidBody[]) {
        bodies.forEach((body) => {
          let position = body.translation();
          let angle = body.rotation();
          ctx.save();
          ctx.translate(position.x, -position.y);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.arc(0, 0, 10, 0, 2 * Math.PI);
          ctx.fillStyle = "red";
          ctx.fill();
          ctx.restore();
        });
      }
      function animate(time: unknown) {
        requestAnimationFrame(animate);
        world.step();
        ctx.clearRect(
          0,
          0,
          SCanvas.current?.width as number,
          SCanvas.current?.height as number
        );
        drawFromRapierrigidBody(ridgedBodiesRender);

        // Get the rigid-body position.
        let position = rigidBody.translation();
        console.log("Rigid-body position: ", position.x, position.y);
      }
      requestAnimationFrame(animate);
    }
    run_simulation();
  }, []);
  return (
    <>
      <h1>test</h1>
      <canvas height={500} width={500} ref={SCanvas}></canvas>
    </>
  );
}

export default App;
