import React, { useState, useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export default function EasyMarker() {
  const { camera } = useThree();
  const [locationName, setLocationName] = useState("");
  const [marks, setMarks] = useState([]);
  const keysPressed = useRef({});
  const cameraSpeed = 0.5;

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key.toLowerCase()] = true;

      // SPACEBAR to mark
      if (e.key === " ") {
        e.preventDefault();
        if (locationName.trim()) {
          const newMark = {
            name: locationName,
            x: parseFloat(camera.position.x.toFixed(1)),
            y: parseFloat(camera.position.y.toFixed(1)),
            z: parseFloat(camera.position.z.toFixed(1)),
          };
          setMarks([...marks, newMark]);
          setLocationName("");
        }
      }
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
  }, [locationName, camera.position]);

  // Camera movement loop
  useEffect(() => {
    const interval = setInterval(() => {
      const direction = new THREE.Vector3();
      const right = new THREE.Vector3();
      const up = new THREE.Vector3(0, 1, 0);

      camera.getWorldDirection(direction);
      right.crossVectors(direction, up).normalize();

      if (keysPressed.current["w"]) camera.position.addScaledVector(direction, cameraSpeed);
      if (keysPressed.current["s"]) camera.position.addScaledVector(direction, -cameraSpeed);
      if (keysPressed.current["a"]) camera.position.addScaledVector(right, -cameraSpeed);
      if (keysPressed.current["d"]) camera.position.addScaledVector(right, cameraSpeed);
      if (keysPressed.current["q"]) camera.position.y += cameraSpeed;
      if (keysPressed.current["e"]) camera.position.y -= cameraSpeed;

      // Rotation with arrow keys
      if (keysPressed.current["arrowup"]) camera.rotation.x -= 0.02;
      if (keysPressed.current["arrowdown"]) camera.rotation.x += 0.02;
      if (keysPressed.current["arrowleft"]) camera.rotation.y += 0.02;
      if (keysPressed.current["arrowright"]) camera.rotation.y -= 0.02;
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [camera]);

  const generateJSON = () => {
    const nodes = {};
    const edges = [];

    marks.forEach((mark, idx) => {
      const key = mark.name.toLowerCase().replace(/\s+/g, "_");
      nodes[key] = {
        x: mark.x,
        y: mark.y,
        z: mark.z,
        label: mark.name,
      };

      // Connect to next point
      if (idx < marks.length - 1) {
        const nextKey = marks[idx + 1].name.toLowerCase().replace(/\s+/g, "_");
        const distance = Math.sqrt(
          Math.pow(mark.x - marks[idx + 1].x, 2) +
          Math.pow(mark.y - marks[idx + 1].y, 2) +
          Math.pow(mark.z - marks[idx + 1].z, 2)
        ).toFixed(1);
        edges.push([key, nextKey, parseFloat(distance)]);
      }
    });

    const config = { nodes, edges };
    const dataStr = JSON.stringify(config, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "campusMap.json";
    link.click();
  };

  return (
    <Html position={[0, 0, 0]} style={{ pointerEvents: "auto" }}>
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          width: "380px",
          backgroundColor: "rgba(15, 23, 42, 0.95)",
          border: "2px solid #3b82f6",
          borderRadius: "12px",
          padding: "20px",
          color: "#e0e7ff",
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
          zIndex: 1000,
        }}
      >
        {/* Title */}
        <h2 style={{ margin: "0 0 15px 0", color: "#60a5fa", fontSize: "16px" }}>
          📍 Mark Locations
        </h2>

        {/* Camera Position Display */}
        <div
          style={{
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            padding: "10px",
            borderRadius: "6px",
            marginBottom: "15px",
            fontSize: "12px",
            fontFamily: "monospace",
          }}
        >
          <div>📷 Position:</div>
          <div style={{ color: "#60a5fa" }}>
            X: {camera.position.x.toFixed(1)}
          </div>
          <div style={{ color: "#60a5fa" }}>
            Y: {camera.position.y.toFixed(1)}
          </div>
          <div style={{ color: "#60a5fa" }}>
            Z: {camera.position.z.toFixed(1)}
          </div>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Location name..."
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const event = new KeyboardEvent("keydown", { key: " " });
              window.dispatchEvent(event);
            }
          }}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            backgroundColor: "#1e293b",
            border: "1px solid #475569",
            borderRadius: "6px",
            color: "#e0e7ff",
            fontSize: "12px",
            boxSizing: "border-box",
          }}
        />

        {/* Mark Button */}
        <button
          onClick={() => {
            const event = new KeyboardEvent("keydown", { key: " " });
            window.dispatchEvent(event);
          }}
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            backgroundColor: "#10b981",
            border: "none",
            borderRadius: "6px",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          ✓ Mark (SPACE)
        </button>

        {/* Marked List */}
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            marginBottom: "10px",
            fontSize: "11px",
          }}
        >
          <div style={{ marginBottom: "8px", color: "#94a3b8" }}>
            Marked ({marks.length}):
          </div>
          {marks.map((mark, idx) => (
            <div
              key={idx}
              style={{
                padding: "6px",
                marginBottom: "4px",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                borderLeft: "3px solid #22c55e",
                fontSize: "11px",
              }}
            >
              <div style={{ fontWeight: "bold", color: "#86efac" }}>
                {idx + 1}. {mark.name}
              </div>
              <div style={{ color: "#cbd5e1", fontFamily: "monospace" }}>
                ({mark.x}, {mark.y}, {mark.z})
              </div>
            </div>
          ))}
        </div>

        {/* Download Button */}
        <button
          onClick={generateJSON}
          disabled={marks.length === 0}
          style={{
            width: "100%",
            padding: "8px",
            backgroundColor: marks.length === 0 ? "#475569" : "#3b82f6",
            border: "none",
            borderRadius: "6px",
            color: "white",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: marks.length === 0 ? "not-allowed" : "pointer",
          }}
        >
          📥 Download JSON ({marks.length})
        </button>

        {/* Controls Info */}
        <div
          style={{
            marginTop: "10px",
            padding: "8px",
            backgroundColor: "rgba(59, 130, 246, 0.05)",
            borderRadius: "6px",
            fontSize: "10px",
            color: "#94a3b8",
          }}
        >
          <div style={{ marginBottom: "4px", fontWeight: "bold" }}>
            🎮 Controls:
          </div>
          <div>W/A/S/D = Move</div>
          <div>Q/E = Up/Down</div>
          <div>Arrow Keys = Rotate</div>
          <div>SPACE = Mark</div>
        </div>
      </div>
    </Html>
  );
}
