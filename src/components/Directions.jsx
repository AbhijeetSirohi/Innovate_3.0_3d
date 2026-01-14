import campusMap from "../data/campusMap.json";

export default function Directions({ path }) {
  if (!path || path.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "12px",
        border: "1px solid #334155",
        borderRadius: "6px",
        maxWidth: "700px",
        background: "#020617"
      }}
    >
      <h3 style={{ marginBottom: "8px" }}>Directions</h3>

      <ol style={{ paddingLeft: "18px" }}>
        {path.map((nodeKey, index) => {
          const label = campusMap.nodes[nodeKey].label;

          if (index === 0) {
            return <li key={index}>Start at <b>{label}</b></li>;
          }

          if (index === path.length - 1) {
            return <li key={index}>Reach <b>{label}</b></li>;
          }

          return <li key={index}>Go to <b>{label}</b></li>;
        })}
      </ol>
    </div>
  );
}
