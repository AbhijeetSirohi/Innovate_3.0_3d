import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import CampusModel from "./CampusModel";
import Navigation3D from "./Navigation3D";
import CoordinateViewer from "./CoordinateViewer";
import SimpleCameraControl from "./SimpleCameraControl";
import { useState } from "react";

export default function Map3D() {
  const [mode, setMode] = useState("mapping"); // "mapping" or "navigation"

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {mode === "mapping" && (
        <button
          onClick={() => setMode("navigation")}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            padding: "10px 16px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            zIndex: 100,
            fontSize: "12px",
          }}
        >
          ✓ Done Mapping → Navigate
        </button>
      )}

      {mode === "navigation" && (
        <button
          onClick={() => setMode("mapping")}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            padding: "10px 16px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
            zIndex: 100,
            fontSize: "12px",
          }}
        >
          ← Back to Mapping
        </button>
      )}

      <Canvas camera={{ position: [0, 15, 20], fov: 50 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[20, 30, 20]} intensity={1.2} />
        <CampusModel />
        <SimpleCameraControl />
        {mode === "mapping" ? <CoordinateViewer /> : <Navigation3D />}
        <OrbitControls autoRotate={false} />
      </Canvas>
    </div>
  );
}
