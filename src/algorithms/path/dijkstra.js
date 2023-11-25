/**
 * Dijkstra's Algorithm
 *
 * Finds the shortest path from the startNode to the endNode on the given grid using Dijkstra's algorithm.

 */
var dx = [0, 0, +1, -1];
var dy = [+1, -1, 0, 0];

function Dijkstra(Grid, startNode, endNode, N, M) {
  var visitedNodes = [];
  var path = [];

  // Create a 2D array to store distance and parent information for each node
  var grid = new Array(N);
  for (let i = 0; i < N; i++) {
    let arr = [];
    for (let j = 0; j < M; j++) {
      arr.push({ distance: 1e9, x: -1, y: -1 });
    }
    grid[i] = arr;
  }

  // Priority queue to store nodes with their distance for efficient processing
  var priority_queue = [];
  priority_queue.push({ cost: 0, x: startNode.x, y: startNode.y });
  grid[startNode.x][startNode.y].distance = 0;
  visitedNodes.push({ x: startNode.x, y: startNode.y });

  while (priority_queue.length > 0) {
    // Sort the priority queue based on cost
    priority_queue.sort((a, b) => a.cost - b.cost);

    // Extract the node with the lowest cost
    var top = priority_queue.shift();

    // Check if the extracted cost matches the stored distance for the node
    if (top.cost !== grid[top.x][top.y].distance) continue;

    // Explore neighbors
    for (let i = 0; i < 4; i++) {
      var x = dx[i] + top.x;
      var y = dy[i] + top.y;

      // Check boundary and wall conditions
      if (!(x >= 0 && x < N && y >= 0 && y < M) || Grid[x][y].isWall) continue;

      // Destination reached
      if (x === endNode.x && y === endNode.y) {
        visitedNodes.push({ x, y });
        grid[x][y].x = top.x;
        grid[x][y].y = top.y;
        var tmp = { x, y };
        path.push({ x: tmp.x, y: tmp.y });

        // Reconstruct the path from the end to the start
        while (grid[tmp.x][tmp.y].x !== -1 || grid[tmp.x][tmp.y].y !== -1) {
          let tmpX = grid[tmp.x][tmp.y].x;
          let tmpY = grid[tmp.x][tmp.y].y;
          tmp.x = tmpX;
          tmp.y = tmpY;
          path.push({ x: tmp.x, y: tmp.y });
        }

        return { path, visitedNodes, error: "" };
      } else if (grid[x][y].distance > 1 + grid[top.x][top.y].distance) {
        // Relaxation step: Update distance and parent information
        grid[x][y].distance = 1 + grid[top.x][top.y].distance;
        grid[x][y].x = top.x;
        grid[x][y].y = top.y;

        visitedNodes.push({ x, y });
        priority_queue.push({ cost: grid[x][y].distance, x, y });
      }
    }
  }

  return { path, visitedNodes, error: "Path is not found" };
}

export default Dijkstra;
