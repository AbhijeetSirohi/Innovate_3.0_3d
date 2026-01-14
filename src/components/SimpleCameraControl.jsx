import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";

export default function SimpleCameraControl() {
  const { camera } = useThree();
  const keysPressed = useRef({});
  const speed = useRef(0.5);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const keys = keysPressed.current;

      // Simple WASD + Arrow movement
      if (keys["w"]) camera.position.z -= speed.current;
      if (keys["s"]) camera.position.z += speed.current;
      if (keys["a"]) camera.position.x -= speed.current;
      if (keys["d"]) camera.position.x += speed.current;
      if (keys["q"]) camera.position.y += speed.current;
      if (keys["e"]) camera.position.y -= speed.current;

      // Arrow keys for rotation
      if (keys["arrowup"]) camera.rotation.x -= 0.02;
      if (keys["arrowdown"]) camera.rotation.x += 0.02;
      if (keys["arrowleft"]) camera.rotation.y -= 0.02;
      if (keys["arrowright"]) camera.rotation.y += 0.02;

      // Speed control with +/-
      if (keys["+"]) speed.current = Math.min(speed.current + 0.01, 2);
      if (keys["-"]) speed.current = Math.max(speed.current - 0.01, 0.1);
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [camera]);

  return null;
}
