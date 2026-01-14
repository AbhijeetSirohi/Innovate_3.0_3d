import React, { useRef, useState, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import campusMap from "../data/campusMap.json";
import { dijkstra } from "../navigation/dijkstra";

export default function Navigation3D({ followCameraDefault = true }) {
  const nodeKeys = Object.keys(campusMap.nodes);
  const [start, setStart] = useState(nodeKeys[0]);
  const [end, setEnd] = useState(nodeKeys[1] || nodeKeys[0]);
  const [path, setPath] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [follow, setFollow] = useState(followCameraDefault);

  const markerRef = useRef();
  const curveRef = useRef(null);
  const progressRef = useRef(0);
  const { camera } = useThree();

  useEffect(() => {
    const p = dijkstra(campusMap.nodes, campusMap.edges, start, end);
    setPath(p);
    progressRef.current = 0;
  }, [start, end]);

  const curve = useMemo(() => {
    if (!path || path.length < 2) return null;
    const points = path.map((key) => {
      const n = campusMap.nodes[key];
      return new THREE.Vector3(n.x, n.y, n.z);
    });
    const c = new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
    curveRef.current = c;
    return c;
  }, [path]);

  const totalLengthRef = useRef(1);
  useEffect(() => {
    if (curve) totalLengthRef.current = curve.getLength();
    else totalLengthRef.current = 1;
  }, [curve]);

  useFrame((state, delta) => {
    if (!playing || !curve) return;
    const distancePerFrame = (speed * delta) / totalLengthRef.current;
    progressRef.current = Math.min(1, progressRef.current + distancePerFrame);

    const p = curve.getPointAt(progressRef.current);
    if (markerRef.current) markerRef.current.position.copy(p);

    if (follow) {
      const offset = new THREE.Vector3(p.x, p.y + 4, p.z + 6);
      camera.position.lerp(offset, 0.1);
      camera.lookAt(new THREE.Vector3(p.x, p.y + 1, p.z));
    }

    if (progressRef.current >= 1) {
      setPlaying(false);
    }
  });

  const linePoints = useMemo(() => {
    if (!curve) return null;
    const pts = curve.getPoints(64);
    const arr = new Float32Array(pts.length * 3);
    pts.forEach((v, i) => {
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    });
    return arr;
  }, [curve]);

  const reset = () => {
    progressRef.current = 0;
    setPlaying(false);
    if (markerRef.current && curve)
      markerRef.current.position.copy(curve.getPointAt(0));
  };

  useEffect(() => {
    if (markerRef.current && curve)
      markerRef.current.position.copy(curve.getPointAt(0));
  }, [curve]);

  return (
    <group>
      {/* Landmark markers */}
      {Object.entries(campusMap.nodes).map(([key, n]) => (
        <group key={key}>
          <mesh position={[n.x, 0.3, n.z]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial
              color={
                key === start ? "#3b82f6" : key === end ? "#10b981" : "#94a3b8"
              }
              emissive={key === start ? "#1e40af" : key === end ? "#065f46" : "#475569"}
            />
          </mesh>
          <Html position={[n.x, 1.2, n.z]} center>
            <div
              style={{
                fontSize: 11,
                fontWeight: "bold",
                color: "#e6eef8",
                background: "rgba(2,6,23,0.8)",
                padding: "4px 8px",
                borderRadius: 4,
                border: "1px solid #3b82f6",
                whiteSpace: "nowrap",
              }}
            >
              {n.label}
            </div>
          </Html>
        </group>
      ))}

      {/* Path visualization */}
      {curve && (
        <>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[linePoints, 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#22c55e" linewidth={3} />
          </line>

          <mesh ref={markerRef} position={curve.getPointAt(0)}>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial 
              color="#ef4444" 
              emissive="#7f1d1d"
              metalness={0.3}
            />
          </mesh>
        </>
      )}

      {/* Navigation UI Panel */}
      <Html position={[0, 0, 0]} distanceToCamera={1.5} scale={1} style={{ pointerEvents: "auto" }}>
          <div
            style={{
              width: 360,
              background: "rgba(2,6,23,0.97)",
              padding: 16,
              borderRadius: 10,
              color: "#e6eef8",
              fontFamily: "system-ui, sans-serif",
              border: "2px solid #3b82f6",
              boxShadow: "0 0 20px rgba(59,130,246,0.2)",
            }}
        >
          <h2 style={{ margin: "0 0 14px 0", color: "#60a5fa", fontSize: 15, fontWeight: "bold" }}>
            🗺️ Campus Navigation
          </h2>

          <label style={{ fontSize: 11, opacity: 0.85, display: "block", marginBottom: 5, fontWeight: "600" }}>
            📍 From:
          </label>
          <select
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "8px", 
              marginBottom: 12,
              borderRadius: "6px", 
              fontSize: 12,
              background: "#1e293b",
              color: "#e6eef8",
              border: "1px solid #475569",
              cursor: "pointer",
            }}
          >
            {nodeKeys.map((k) => (
              <option value={k} key={k}>
                {campusMap.nodes[k].label}
              </option>
            ))}
          </select>

          <label style={{ fontSize: 11, opacity: 0.85, display: "block", marginBottom: 5, fontWeight: "600" }}>
            📍 To:
          </label>
          <select
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            style={{ 
              width: "100%", 
              padding: "8px", 
              marginBottom: 12,
              borderRadius: "6px", 
              fontSize: 12,
              background: "#1e293b",
              color: "#e6eef8",
              border: "1px solid #475569",
              cursor: "pointer",
            }}
          >
            {nodeKeys.map((k) => (
              <option value={k} key={k}>
                {campusMap.nodes[k].label}
              </option>
            ))}
          </select>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
            <button
              onClick={() => {
                if (curve) setPlaying(true);
              }}
              style={{ 
                padding: "10px 8px",
                background: playing ? "#059669" : "#10b981",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 12,
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => e.target.style.background = "#047857"}
              onMouseOut={(e) => e.target.style.background = playing ? "#059669" : "#10b981"}
            >
              ▶ Start
            </button>
            <button 
              onClick={() => setPlaying(false)} 
              style={{ 
                padding: "10px 8px",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 12,
              }}
              onMouseOver={(e) => e.target.style.background = "#dc2626"}
              onMouseOut={(e) => e.target.style.background = "#ef4444"}
            >
              ⏸ Stop
            </button>
            <button 
              onClick={reset} 
              style={{ 
                padding: "10px 8px",
                background: "#6b7280",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: 12,
              }}
              onMouseOver={(e) => e.target.style.background = "#4b5563"}
              onMouseOut={(e) => e.target.style.background = "#6b7280"}
            >
              ↺ Reset
            </button>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
            <label style={{ fontSize: 11, fontWeight: "600", minWidth: "50px" }}>⚡ Speed:</label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              style={{ flex: 1, cursor: "pointer" }}
            />
            <span style={{ width: 35, textAlign: "right", fontSize: 11, fontWeight: "bold" }}>
              {speed.toFixed(1)}x
            </span>
          </div>

          <label style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px", background: "rgba(96,165,250,0.1)", borderRadius: "6px", cursor: "pointer", fontSize: 12 }}>
            <input
              type="checkbox"
              checked={follow}
              onChange={(e) => setFollow(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <span style={{ fontWeight: "600" }}>📹 Follow Camera</span>
          </label>

          {path.length > 0 && (
            <div style={{ marginTop: 10, fontSize: 11, opacity: 0.7, textAlign: "center", padding: "6px", background: "rgba(34,197,94,0.1)", borderRadius: "4px" }}>
              ✓ Route found: {path.length} waypoints
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
