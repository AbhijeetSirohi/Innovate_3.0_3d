import React, { useState, useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export default function CoordinateViewer() {
  const { camera, gl } = useThree();
  const [cameraPos, setCameraPos] = useState({ x: 0, y: 0, z: 0 });
  const [markers, setMarkers] = useState([]);
  const [markerName, setMarkerName] = useState("");
  const canvasRef = useRef(gl.domElement);
  const keysPressed = useRef({});
  const moveSpeed = useRef(0.5);

  // Keyboard camera movement
  useFrame(() => {
    const speed = moveSpeed.current;
    if (keysPressed.current["w"] || keysPressed.current["W"]) camera.position.z -= speed;
    if (keysPressed.current["s"] || keysPressed.current["S"]) camera.position.z += speed;
    if (keysPressed.current["a"] || keysPressed.current["A"]) camera.position.x -= speed;
    if (keysPressed.current["d"] || keysPressed.current["D"]) camera.position.x += speed;
    if (keysPressed.current["q"] || keysPressed.current["Q"]) camera.position.y += speed;
    if (keysPressed.current["e"] || keysPressed.current["E"]) camera.position.y -= speed;

    setCameraPos({
      x: parseFloat(camera.position.x.toFixed(2)),
      y: parseFloat(camera.position.y.toFixed(2)),
      z: parseFloat(camera.position.z.toFixed(2)),
    });
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      
      if (e.code === "Space") {
        e.preventDefault();
        addMarkerAtCamera();
      }
    };
    
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [cameraPos, markerName, markers]);

  const addMarkerAtCamera = () => {
    if (!markerName.trim()) {
      alert("Please enter a location name first");
      return;
    }

    const newMarker = {
      id: `marker_${Date.now()}`,
      name: markerName,
      x: cameraPos.x,
      y: cameraPos.y,
      z: cameraPos.z,
    };

    setMarkers([...markers, newMarker]);
    setMarkerName("");
    alert(
      `✓ Marked: ${newMarker.name}\nPosition: (${newMarker.x}, ${newMarker.y}, ${newMarker.z})`
    );
  };

  const generateConfig = () => {
    if (markers.length === 0) {
      alert("Mark at least one location first!");
      return;
    }

    const nodes = {};
    const edges = [];

    // Create nodes
    markers.forEach((marker) => {
      const key = marker.name.toLowerCase().replace(/\s+/g, "_");
      nodes[key] = {
        x: marker.x,
        y: marker.y,
        z: marker.z,
        label: marker.name,
      };
    });

    // Create edges between consecutive markers
    for (let i = 0; i < markers.length - 1; i++) {
      const from = markers[i].name.toLowerCase().replace(/\s+/g, "_");
      const to = markers[i + 1].name.toLowerCase().replace(/\s+/g, "_");

      const dx = markers[i + 1].x - markers[i].x;
      const dy = markers[i + 1].y - markers[i].y;
      const dz = markers[i + 1].z - markers[i].z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      edges.push([from, to, parseFloat(distance.toFixed(2))]);
      edges.push([to, from, parseFloat(distance.toFixed(2))]);
    }

    const config = { nodes, edges };
    const json = JSON.stringify(config, null, 2);

    navigator.clipboard.writeText(json).then(() => {
      console.log(config);
      alert(`✓ Config copied!\n\nMarked ${markers.length} locations`);
    });
  };

  return (
    <>
      {/* Visual markers in 3D space */}
      {markers.map((marker) => (
        <group key={marker.id}>
          <mesh position={[marker.x, marker.y, marker.z]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial color="#10b981" emissive="#059669" />
          </mesh>
          <Html position={[marker.x, marker.y + 0.7, marker.z]} center>
            <div
              style={{
                fontSize: 10,
                fontWeight: "bold",
                color: "#10b981",
                background: "rgba(0,0,0,0.9)",
                padding: "4px 8px",
                borderRadius: 4,
                border: "2px solid #10b981",
                whiteSpace: "nowrap",
              }}
            >
              {marker.name}
            </div>
          </Html>
        </group>
      ))}

      {/* Control Panel */}
      <Html
        position={[0, 0, 0]}
        scale={1}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "20px",
          pointerEvents: "auto",
          zIndex: 100,
        }}
      >
        <div
          style={{
            width: 380,
            background: "rgba(10,10,10,0.95)",
            padding: 14,
            borderRadius: 8,
            color: "#10b981",
            fontFamily: "monospace",
            fontSize: 11,
            border: "2px solid #10b981",
            boxShadow: "0 0 15px rgba(16,185,129,0.3)",
          }}
        >
          <h3
            style={{ margin: "0 0 10px 0", fontSize: 12, fontWeight: "bold" }}
          >
            📍 Campus Point Mapper
          </h3>

          <div style={{ fontSize: 9, background: "rgba(16,185,129,0.1)", padding: 8, borderRadius: 4, marginBottom: 8 }}>
            <div style={{ fontWeight: "bold", marginBottom: 4 }}>🎮 KEYBOARD CONTROLS:</div>
            <div style={{ opacity: 0.8 }}>
              <div>W/S - Forward/Back | A/D - Left/Right</div>
              <div>Q/E - Up/Down | SPACE - Mark Location</div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(16,185,129,0.1)",
              padding: 8,
              borderRadius: 4,
              marginBottom: 10,
            }}
          >
            <p style={{ margin: "0 0 4px 0", fontSize: 10 }}>
              Current Camera Position:
            </p>
            <div style={{ fontSize: 9, opacity: 0.8, fontFamily: "courier" }}>
              X: {cameraPos.x.toFixed(2)} | Y: {cameraPos.y.toFixed(2)} | Z:{" "}
              {cameraPos.z.toFixed(2)}
            </div>
          </div>

          <input
            type="text"
            placeholder="Location name (e.g., Main Hallway)"
            value={markerName}
            onChange={(e) => setMarkerName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addMarkerAtCamera()}
            style={{
              width: "100%",
              padding: "6px",
              marginBottom: 8,
              background: "#1e293b",
              color: "#10b981",
              border: "1px solid #10b981",
              borderRadius: "4px",
              fontSize: 11,
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={addMarkerAtCamera}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: 10,
              background: "#10b981",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            ✓ Mark Current Position (Space Key or Button)
          </button>

          <div
            style={{
              background: "rgba(16,185,129,0.1)",
              padding: 8,
              borderRadius: 4,
              marginBottom: 10,
              maxHeight: 150,
              overflow: "auto",
            }}
          >
            <p
              style={{ margin: "0 0 6px 0", fontWeight: "bold", fontSize: 10 }}
            >
              Marked: {markers.length}
            </p>
            {markers.map((m, i) => (
              <div
                key={m.id}
                style={{ fontSize: 9, marginBottom: 4, opacity: 0.8 }}
              >
                {i + 1}. {m.name}
                <div style={{ fontSize: 8, opacity: 0.6, marginLeft: 8 }}>
                  ({m.x.toFixed(1)}, {m.y.toFixed(1)}, {m.z.toFixed(1)})
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <button
              onClick={generateConfig}
              disabled={markers.length === 0}
              style={{
                padding: "6px",
                background: markers.length > 0 ? "#10b981" : "#6b7280",
                color: "#000",
                border: "none",
                borderRadius: "4px",
                cursor: markers.length > 0 ? "pointer" : "not-allowed",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              📋 Generate Config
            </button>
            <button
              onClick={() => setMarkers([])}
              style={{
                padding: "6px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              🗑️ Clear All
            </button>
          </div>

          <div
            style={{
              fontSize: 9,
              opacity: 0.7,
              textAlign: "center",
              lineHeight: "1.4",
            }}
          >
            <strong>How to use:</strong>
            <br />
            1. Move camera to location
            <br />
            2. Type location name
            <br />
            3. Press SPACE to mark
            <br />
            <br />
            <span style={{ color: "#fbbf24" }}>
              TIP: Use arrow keys to move camera around the model
            </span>
          </div>
        </div>
      </Html>
    </>
  );
}
