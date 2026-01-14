import React, { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { Html } from "@react-three/drei";

export default function ModelInspector() {
  const { scene } = useGLTF("/models/campus.glb");
  const [nodeData, setNodeData] = useState([]);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  useEffect(() => {
    const nodes = [];

    const inspect = (object, depth = 0) => {
      nodes.push({
        id: `${depth}-${nodes.length}`,
        name: object.name || "unnamed",
        type: object.type,
        depth,
        position: object.position
          ? `(${object.position.x.toFixed(2)}, ${object.position.y.toFixed(
              2
            )}, ${object.position.z.toFixed(2)})`
          : "N/A",
        userData: object.userData,
      });

      if (object.children && depth < 8) {
        object.children.forEach((child) => inspect(child, depth + 1));
      }
    };

    inspect(scene);
    setNodeData(nodes);
  }, [scene]);

  return (
    <Html position={[0, 10, 0]} style={{ pointerEvents: "auto" }}>
      <div
        style={{
          background: "rgba(10, 10, 10, 0.95)",
          color: "#e6eef8",
          fontFamily: "monospace",
          fontSize: 10,
          maxHeight: "600px",
          maxWidth: "500px",
          overflow: "auto",
          padding: 12,
          borderRadius: 6,
          border: "1px solid #475569",
        }}
      >
        <h3 style={{ margin: "0 0 10px 0", fontSize: 12, color: "#fbbf24" }}>
          🔍 Model Structure Inspector
        </h3>
        <p style={{ margin: "0 0 10px 0", fontSize: 9, opacity: 0.7 }}>
          Total objects: {nodeData.length}
        </p>

        <div style={{ maxHeight: "500px", overflow: "auto" }}>
          {nodeData.slice(0, 100).map((node) => (
            <div
              key={node.id}
              style={{
                paddingLeft: `${node.depth * 12}px`,
                marginBottom: 4,
                padding: "4px 0",
                borderBottom: "1px solid #1e293b",
              }}
            >
              <span style={{ color: "#60a5fa" }}>{node.type}</span>
              <span style={{ color: "#34d399", marginLeft: 6 }}>
                {node.name}
              </span>
              <span style={{ color: "#94a3b8", fontSize: 9, marginLeft: 6 }}>
                {node.position}
              </span>
              {node.userData && Object.keys(node.userData).length > 0 && (
                <div style={{ fontSize: 8, color: "#fbbf24", marginTop: 2 }}>
                  userData: {JSON.stringify(node.userData).substring(0, 60)}...
                </div>
              )}
            </div>
          ))}
          {nodeData.length > 100 && (
            <div style={{ color: "#f87171", marginTop: 8 }}>
              ... and {nodeData.length - 100} more objects
            </div>
          )}
        </div>
      </div>
    </Html>
  );
}
