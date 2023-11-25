/**
 * A* Pathfinding Algorithm
 *
 * Finds the shortest path from the startNode to the endNode on the given grid.
 */

var dx = [0, 0, +1, -1];
var dy = [+1, -1, 0, 0];

function Astar(Grid, startNode, endNode, N, M) {
  // Initialize the grid to store g-scores, predecessors, and the path
  var grid = new Array(N);
  for (let i = 0; i < N; i++) {
    let arr = [];
    for (let j = 0; j < M; j++) {
      arr.push({ gScore: 1e9, x: -1, y: -1 });
    }
    grid[i] = arr;
  }

  let path = [],
    close_list = [];
  var open_list = [];
  let h = Math.abs(startNode.x - endNode.x) + Math.abs(startNode.y - endNode.y);

  // Add the start node to the open list
  open_list.push({ f: h, x: startNode.x, y: startNode.y });
  grid[startNode.x][startNode.y].gScore = 0;

  while (open_list.length > 0) {
    // Find the node with the least f-score in the open list
    var atLeastValueIdx = 0;
    for (let i = 0; i < open_list.length; i++) {
      if (open_list[atLeastValueIdx].f > open_list[i].f) {
        atLeastValueIdx = i;
      }
    }
    var curr_node = open_list[atLeastValueIdx];
    close_list.push(curr_node);

    // Remove the current node from the open list
    var newOpen_list = [];
    for (var i = 0; i < open_list.length; i++)
      if (i !== atLeastValueIdx) newOpen_list.push(open_list[i]);
    open_list = newOpen_list;

    // Check if the current node is the destination
    if (curr_node.x === endNode.x && curr_node.y === endNode.y) {
      var tmp = { x: curr_node.x, y: curr_node.y };
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
      return { path, close_list, error: "" };
    }

    // Explore neighbors of the current node
    for (let i = 0; i < 4; i++) {
      let x = dx[i] + curr_node.x;
      let y = dy[i] + curr_node.y;

      // Check if the neighbor is within the grid and not a wall
      if (!(x >= 0 && x < N && y >= 0 && y < M) || Grid[x][y].isWall) continue;

      let newGScore = grid[curr_node.x][curr_node.y].gScore + 1;
      let HScore = Math.abs(x - endNode.x) + Math.abs(y - endNode.y);
      let newFScore = newGScore + HScore;

      // Update the g-score and predecessor if a better path is found
      if (grid[x][y].gScore > newGScore) {
        grid[x][y].gScore = newGScore;
        grid[x][y].x = curr_node.x;
        grid[x][y].y = curr_node.y;
        // Add the neighbor to the open list if not already present
        if (!open_list.includes({ f: newFScore, x, y }))
          open_list.push({ f: newFScore, x, y });
      }
    }
  }

  return { path, close_list, error: "Path is not found" };
}

export default Astar;
