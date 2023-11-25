/**
 * Breadth-First Search Algorithm
 *
 * Finds the shortest path from the startNode to the endNode on the given grid.
 */

var dx = [0, 0, +1, -1];
var dy = [+1, -1, 0, 0];

function BFS(Grid, startNode, endNode, N, M) {
  // Initialize the grid to store predecessors and visited status
  var grid = new Array(N);
  for (let i = 0; i < N; i++) {
    let arr = [];
    for (let j = 0; j < M; j++) {
      arr.push({ x: -1, y: -1, visited: 0 });
    }
    grid[i] = arr;
  }

  var visitedNodes = [];
  var path = [];

  // Initialize the queue with the start node
  var queue = [];
  queue.push({ x: startNode.x, y: startNode.y });
  grid[startNode.x][startNode.y].visited = 1;
  visitedNodes.push({ x: startNode.x, y: startNode.y });

  while (queue.length > 0) {
    // Dequeue the front node from the queue
    var front = queue.shift();

    for (let i = 0; i < 4; i++) {
      var x = dx[i] + front.x;
      var y = dy[i] + front.y;

      if (x === endNode.x && y === endNode.y) {
        visitedNodes.push({ x, y });
        grid[x][y].x = front.x;
        grid[x][y].y = front.y;
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

        // Return the path and explored nodes
        return { path, visitedNodes, error: "" };
      } else if (
        x >= 0 &&
        y >= 0 &&
        x < N &&
        y < M &&
        !Grid[x][y].isWall &&
        !grid[x][y].visited
      ) {
        // Mark the neighbor as visited
        grid[x][y].visited = 1;
        visitedNodes.push({ x, y });

        // Store the predecessor
        grid[x][y].x = front.x;
        grid[x][y].y = front.y;

        // Enqueue the neighbor for further exploration
        queue.push({ x, y });
      }
    }
  }

  return { path, visitedNodes, error: "Path is not found" };
}

export default BFS;
