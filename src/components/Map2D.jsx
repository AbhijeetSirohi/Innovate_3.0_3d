

import campusMap from "../data/campusMap.json";

export default function Map2D({ path }) {
  const scale = 40;
  const padding = 2; // logical units padding

  const nodesArr = Object.values(campusMap.nodes);

  // compute bounds
  const xs = nodesArr.map(n => n.x);
  const ys = nodesArr.map(n => n.y);

  const minX = Math.min(...xs) - padding;
  const maxX = Math.max(...xs) + padding;
  const minY = Math.min(...ys) - padding;
  const maxY = Math.max(...ys) + padding;

  const width = (maxX - minX) * scale;
  const height = (maxY - minY) * scale;

  const mapX = (x) => (x - minX) * scale;
  const mapY = (y) => height - (y - minY) * scale;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="700"
      height="450"
      style={{
        border: "1px solid #334155",
        background: "#020617",
        marginTop: "12px"
      }}
    >
      {/* edges */}
      {campusMap.edges.map(([from, to], idx) => {
        const a = campusMap.nodes[from];
        const b = campusMap.nodes[to];
        return (
          <line
            key={idx}
            x1={mapX(a.x)}
            y1={mapY(a.y)}
            x2={mapX(b.x)}
            y2={mapY(b.y)}
            stroke="#475569"
            strokeWidth="4"
          />
        );
      })}

      {/* path */}
      {path.map((node, i) => {
        if (i === 0) return null;
        const a = campusMap.nodes[path[i - 1]];
        const b = campusMap.nodes[node];
        return (
          <line
            key={"p" + i}
            x1={mapX(a.x)}
            y1={mapY(a.y)}
            x2={mapX(b.x)}
            y2={mapY(b.y)}
            stroke="#22c55e"
            strokeWidth="6"
          />
        );
      })}

      {/* nodes */}
      {Object.entries(campusMap.nodes).map(([key, node]) => (
        <g key={key}>
          <circle
            cx={mapX(node.x)}
            cy={mapY(node.y)}
            r="6"
            fill="#38bdf8"
          />
          <text
            x={mapX(node.x) + 8}
            y={mapY(node.y) - 8}
            fontSize="12"
            fill="#e5e7eb"
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
