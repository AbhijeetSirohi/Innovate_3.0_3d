export function dijkstra(nodes, edges, start, end) {
  const distances = {};
  const previous = {};
  const visited = new Set();

  Object.keys(nodes).forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
  });

  distances[start] = 0;

  while (true) {
    let currentNode = null;
    let smallestDistance = Infinity;

    for (let node in distances) {
      if (!visited.has(node) && distances[node] < smallestDistance) {
        smallestDistance = distances[node];
        currentNode = node;
      }
    }

    if (currentNode === null) break;
    if (currentNode === end) break;

    visited.add(currentNode);

    edges.forEach(([from, to, weight]) => {
      if (from === currentNode || to === currentNode) {
        const neighbor = from === currentNode ? to : from;
        if (visited.has(neighbor)) return;

        const newDist = distances[currentNode] + weight;
        if (newDist < distances[neighbor]) {
          distances[neighbor] = newDist;
          previous[neighbor] = currentNode;
        }
      }
    });
  }

  const path = [];
  let current = end;

  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return path;
}
