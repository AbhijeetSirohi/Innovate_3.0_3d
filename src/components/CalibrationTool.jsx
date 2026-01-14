import React, { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export default function CalibrationTool() {
  const [points, setPoints] = useState([]);
  const [calibrating, setCalibrating] = useState(false);
  const { camera, scene } = useThree();
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  const handleCanvasClick = (event) => {
    if (!calibrating) return;

    // Get canvas and calculate normalized device coordinates
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Perform raycasting
    raycasterRef.current.setFromCamera(mouseRef.current, camera);
    const intersects = raycasterRef.current.intersectObjects(
      scene.children,
      true
    );

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const newPoints = [
        ...points,
        {
          id: `point_${Date.now()}`,
          x: point.x,
          y: point.y,
          z: point.z,
          label: `Landmark ${points.length + 1}`,
        },
      ];
      setPoints(newPoints);
      console.log(
        `Captured point: x=${point.x.toFixed(2)}, y=${point.y.toFixed(
          2
        )}, z=${point.z.toFixed(2)}`
      );
    }
  };

  const exportPoints = () => {
    const json = JSON.stringify(points, null, 2);
    console.log("Calibration points:", json);
    // Copy to clipboard
    navigator.clipboard.writeText(json);
    alert("Points copied to clipboard!");
  };

  const clearPoints = () => {
    setPoints([]);
  };

  return (
    <>
      {/* Click handler on canvas */}
      <mesh onClick={handleCanvasClick} position={[0, 0, 0]}>
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Visualization of captured points */}
      {points.map((pt) => (
        <group key={pt.id}>
          <mesh position={[pt.x, pt.y, pt.z]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#fbbf24" />
          </mesh>
          <Html position={[pt.x, pt.y + 0.7, pt.z]} center>
            <div
              style={{
                fontSize: 11,
                color: "#fef3c7",
                background: "rgba(20,20,20,0.8)",
                padding: "2px 5px",
                borderRadius: 3,
                whiteSpace: "nowrap",
              }}
            >
              {pt.label}
            </div>
          </Html>
        </group>
      ))}

      {/* UI Panel */}
      <Html position={[0, 6, 0]} style={{ pointerEvents: "auto" }}>
        <div
          style={{
            background: "rgba(20,20,20,0.95)",
            padding: 15,
            borderRadius: 8,
            color: "#e6eef8",
            fontFamily: "monospace",
            fontSize: 12,
            maxWidth: 400,
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>🎯 Calibration Tool</h3>
          <p style={{ margin: "0 0 10px 0", opacity: 0.8 }}>
            {calibrating
              ? "✓ Click on landmarks in the 3D model to capture their coordinates"
              : "Start calibration to capture coordinates"}
          </p>

          <button
            onClick={() => setCalibrating(!calibrating)}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: 8,
              background: calibrating ? "#ef4444" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {calibrating ? "Stop Calibration" : "Start Calibration"}
          </button>

          <div
            style={{
              background: "rgba(0,0,0,0.3)",
              padding: 8,
              borderRadius: 4,
              marginBottom: 8,
            }}
          >
            <p style={{ margin: "0 0 6px 0", fontWeight: "bold" }}>
              Captured Points: {points.length}
            </p>
            {points.map((pt, idx) => (
              <div
                key={pt.id}
                style={{ fontSize: 10, opacity: 0.8, marginBottom: 3 }}
              >
                {idx + 1}. x={pt.x.toFixed(2)} y={pt.y.toFixed(2)} z=
                {pt.z.toFixed(2)}
              </div>
            ))}
          </div>

          <button
            onClick={exportPoints}
            disabled={points.length === 0}
            style={{
              width: "100%",
              padding: "6px",
              marginBottom: 6,
              background: points.length > 0 ? "#10b981" : "#6b7280",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: points.length > 0 ? "pointer" : "not-allowed",
              fontSize: 11,
            }}
          >
            Export to Clipboard
          </button>

          <button
            onClick={clearPoints}
            disabled={points.length === 0}
            style={{
              width: "100%",
              padding: "6px",
              background: points.length > 0 ? "#f87171" : "#6b7280",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: points.length > 0 ? "pointer" : "not-allowed",
              fontSize: 11,
            }}
          >
            Clear All
          </button>
        </div>
      </Html>
    </>
  );
}
