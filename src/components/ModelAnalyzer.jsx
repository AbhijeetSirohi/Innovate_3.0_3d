import React, { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Html } from "@react-three/drei";
import * as THREE from "three";

export default function ModelAnalyzer() {
  const { scene } = useGLTF("/models/campus.glb");
  const [landmarks, setLandmarks] = useState([]);
  const [configJson, setConfigJson] = useState("");

  useEffect(() => {
    const extracted = [];

    const extractNamedObjects = (object, depth = 0) => {
      // Look for objects with meaningful names
      const name = object.name?.trim() || "";

      if (name && name !== "Scene" && depth > 0) {
        // Calculate bounding box to get approximate center
        const box = new THREE.Box3().setFromObject(object);
        const center = box.getCenter(new THREE.Vector3());

        extracted.push({
          name,
          type: object.type,
          x: parseFloat(center.x.toFixed(3)),
          y: parseFloat(center.y.toFixed(3)),
          z: parseFloat(center.z.toFixed(3)),
          hasChildren: object.children?.length > 0,
        });
      }

      if (object.children && depth < 10) {
        object.children.forEach((child) =>
          extractNamedObjects(child, depth + 1)
        );
      }
    };

    extractNamedObjects(scene);

    // Filter and sort by name
    const filtered = extracted.filter((l) => l.name.length > 0);
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    setLandmarks(filtered);

    // Generate potential config
    if (filtered.length > 0) {
      const nodes = {};
      filtered.forEach((landmark, idx) => {
        const key = landmark.name.toLowerCase().replace(/\s+/g, "_");
        nodes[key] = {
          x: landmark.x,
          y: landmark.y,
          z: landmark.z,
          label: landmark.name,
        };
      });

      const config = {
        nodes,
        edges: [], // User needs to define connections
      };

      setConfigJson(JSON.stringify(config, null, 2));
    }
  }, [scene]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(configJson);
    alert("Config copied to clipboard!");
  };

  const downloadConfig = () => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/plain;charset=utf-8,${encodeURIComponent(configJson)}`
    );
    element.setAttribute("download", "campusMap.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Html position={[0, 8, 0]} style={{ pointerEvents: "auto" }}>
      <div
        style={{
          background: "rgba(10, 10, 10, 0.95)",
          color: "#e6eef8",
          fontFamily: "monospace",
          fontSize: 11,
          maxHeight: "650px",
          maxWidth: "600px",
          overflow: "auto",
          padding: 14,
          borderRadius: 6,
          border: "2px solid #10b981",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", fontSize: 13, color: "#10b981" }}>
          🏗️ Model Analyzer - Named Landmarks
        </h3>

        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            padding: 10,
            borderRadius: 4,
            marginBottom: 12,
            maxHeight: 250,
            overflow: "auto",
          }}
        >
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold", fontSize: 10 }}>
            Found {landmarks.length} named objects:
          </p>
          {landmarks.map((landmark, idx) => (
            <div
              key={idx}
              style={{
                fontSize: 9,
                marginBottom: 6,
                padding: 6,
                background: "rgba(96,165,250,0.1)",
                borderLeft: "2px solid #60a5fa",
                paddingLeft: 8,
              }}
            >
              <div style={{ color: "#60a5fa", fontWeight: "bold" }}>
                {landmark.name}
              </div>
              <div style={{ fontSize: 8, opacity: 0.8, marginTop: 2 }}>
                x={landmark.x.toFixed(2)}, y={landmark.y.toFixed(2)}, z=
                {landmark.z.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "rgba(0,0,0,0.4)",
            padding: 10,
            borderRadius: 4,
            marginBottom: 12,
            maxHeight: 200,
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: 8,
          }}
        >
          <p style={{ margin: "0 0 6px 0", fontWeight: "bold" }}>
            Generated Config:
          </p>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              color: "#10b981",
              fontSize: 8,
            }}
          >
            {configJson.substring(0, 300)}...
          </pre>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={copyToClipboard}
            style={{
              flex: 1,
              padding: "6px 8px",
              background: "#10b981",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 10,
              fontWeight: "bold",
            }}
          >
            Copy Config
          </button>
          <button
            onClick={downloadConfig}
            style={{
              flex: 1,
              padding: "6px 8px",
              background: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 10,
              fontWeight: "bold",
            }}
          >
            Download JSON
          </button>
        </div>

        <p style={{ margin: "8px 0 0 0", fontSize: 9, opacity: 0.7 }}>
          ⚠️ Next: Define edges between landmarks in campusMap.json
        </p>
      </div>
    </Html>
  );
}
