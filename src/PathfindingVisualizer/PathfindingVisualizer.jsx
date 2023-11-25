import React,{useEffect, useState} from 'react'
import './PathfindingVisualizer.css';
import Astar from '../algorithms/path/A_star';
import basicMaze from '../algorithms/maze/basic-maze';
import BFS from '../algorithms/path/bfs';
import DFS from '../algorithms/path/dfs';
import Dijkstra from '../algorithms/path/dijkstra';
import Randomized_dfs from '../algorithms/maze/randomized_dfs';
import recursiveDivision from '../algorithms/maze/recursive_division';
import Navbar from '../components/Navbar';

var rows = 17;
var cols = 31;

var START_NODE_ROW = 4, START_NODE_COL = 6;
var END_NODE_ROW = rows-6, END_NODE_COL = cols-6;
var InitSR = START_NODE_ROW, InitSC = START_NODE_COL;
var InitER = END_NODE_ROW, InitEC = END_NODE_COL;

var animateTime = 35; // Slow, Average, Fast: 8,35,80

function App(){
// State variables to manage the grid, mouse press status, maze and path IDs, and animation type
    const [Grid,setGrid] = useState([]);  
    const [isMousePress,setIsMousePress] = useState(false);
    const [mazeID,setMazeID] = useState(0);
    const [pathID,setPathID] = useState(0);
    const [animateType,setAnimateTimeType] = useState(2);


    useEffect(()=>{
        gridInitialize();
    },[])

    const gridInitialize =()=>{
        var grid = new Array(rows);
        for(let i=0; i<rows; i++) grid[i] = new Array(cols);

        for(let i=0; i<rows; i++){
            for(let j=0; j<cols; j++){
                grid[i][j] = new Spot(i,j);
            }
        }

        setGrid(grid);
    }

    async function animateVisitedNodes(visitedNodes){
        for(let i=0; i<visitedNodes.length; i++){
            const node = visitedNodes[i];
            await waitForAnimatoin(animateTime);
            if(node.x === START_NODE_ROW && node.y === START_NODE_COL)
            document.getElementById(`row${node.x}_col${node.y}`).className = "node-visited START_NODE";

            else if(node.x === END_NODE_ROW && node.y === END_NODE_COL)
            document.getElementById(`row${node.x}_col${node.y}`).className = "node-visited END_NODE";

            else document.getElementById(`row${node.x}_col${node.y}`).className = "node-visited";
        }
    }
    async function animateShortestPath(pathNode){
        pathNode.reverse();
        for(let i=0; i<pathNode.length; i++){
            const node = pathNode[i];
            await waitForAnimatoin(animateTime);
            if(i===0) 
            document.getElementById(`row${node.x}_col${node.y}`).className = "shortestPath START_NODE";
            else if(i+1 === pathNode.length) 
            document.getElementById(`row${node.x}_col${node.y}`).className = "shortestPath END_NODE";
            else document.getElementById(`row${node.x}_col${node.y}`).className = "shortestPath";
        }
    }
// Function to trigger pathfinding based on the selected algorithm
const pathFinding = async () => {
    var btns = document.getElementsByClassName('button-4');
    document.getElementsByTagName('select')[0].disabled = true;
    document.getElementsByTagName('select')[1].disabled = true;
    for (let i = 0; i < btns.length; i++) {
      btns[i].disabled = true;
    }
  
    var startNode = Grid[START_NODE_ROW][START_NODE_COL];
    var endNode = Grid[END_NODE_ROW][END_NODE_COL];
  
    // Perform pathfinding based on the selected algorithm
    switch (pathID) {
      case 1:
        var obj = BFS(Grid, startNode, endNode, rows, cols);
        if (obj.error) {
          alert("Path not found!");
        } else {
          await animateVisitedNodes(obj.visitedNodes);
          await animateShortestPath(obj.path);
        }
        break;
      case 2:
        obj = DFS(Grid, startNode, endNode, rows, cols);
        if (obj.error) {
          alert("Path not found!");
        } else {
          await animateVisitedNodes(obj.visitedNodes);
          await animateShortestPath(obj.path);
        }
        break;
      case 3:
        obj = Dijkstra(Grid, startNode, endNode, rows, cols);
        if (obj.error) {
          alert("Path not found!");
        } else {
          await animateVisitedNodes(obj.visitedNodes);
          await animateShortestPath(obj.path);
        }
        break;
      default:
        obj = Astar(Grid, startNode, endNode, rows, cols);
        if (obj.error) {
          alert("Path not found!");
        } else {
          await animateVisitedNodes(obj.close_list);
          await animateShortestPath(obj.path);
        }
        break;
    }
    document.getElementsByTagName('select')[0].disabled = false;
    document.getElementsByTagName('select')[1].disabled = false;
    for (let i = 0; i < btns.length; i++) {
      btns[i].disabled = false;
    }
  };
  


    const mazeGenerator = async (ar) =>{
        for(var i=0; i<ar.length; i++){
            if((ar[i].r===START_NODE_ROW && ar[i].c===START_NODE_COL) || 
            (ar[i].r===END_NODE_ROW && ar[i].c===END_NODE_COL)) continue;
                await waitForAnimatoin(animateTime);
                createWall(ar[i].r,ar[i].c);
        }
    }
    const makeAllCellAsAWall = () =>{
        for(let i=0; i<rows; i++){
            for(let j=0; j<cols; j++){
                if(!((i===START_NODE_ROW && j===START_NODE_COL) || (i===END_NODE_ROW && j===END_NODE_COL))){
                    createWall(i,j);
                }
            }
        }
    }
    const mazeHandle = async () =>{        
        var arr = [];
        switch(mazeID){
            case 1:
                arr = basicMaze(rows,cols);
                mazeGenerator(arr);
            break;
            case 2:
                makeAllCellAsAWall();
                arr = Randomized_dfs(rows,cols);
                mazeGenerator(arr);
            break;
            case 3: // recursive division
                arr = recursiveDivision(rows,cols);
                mazeGenerator(arr);
            break;
            default:
        }
    }
    const clearPathHandle = () =>{
        for(let i=0; i<rows; i++){
            for(let j=0; j<cols; j++){
                if(i===START_NODE_ROW && j===START_NODE_COL){
                    document.getElementById(`row${i}_col${j}`).className = "square START_NODE";
                }
                else if(i===END_NODE_ROW && j===END_NODE_COL){
                    document.getElementById(`row${i}_col${j}`).className = "square END_NODE";
                }
                else if(!Grid[i][j].isWall)
                document.getElementById(`row${i}_col${j}`).className = "square";
            }
        }
    }
// Function to toggle the wall status of a cell
    const createWall=(row,col)=>{

        var newGrid = [...Grid] 
        var node = newGrid[row][col];
        node.isWall = !node.isWall;
        newGrid[row][col] = node;
        setGrid(newGrid);
    }
// Event handlers for mouse actions on the grid cells
    const onMouseDown = (row,col)=>{
        if(isValid(row,col)){
            setIsMousePress(true);
            createWall(row,col);
        }
    }
    const onMouseEnter = (row,col)=>{
        if(isMousePress === true && isValid(row,col)){
            createWall(row,col);
        }
    }
    const onMouseUp = ()=>{
        setIsMousePress(()=>false);
    }
    const animationTimeHandle = (type) =>{
        if(type === 1) animateTime = 8;
        else if(type === 2) animateTime = 35;
        else animateTime = 80;
        setAnimateTimeType(type);
    }

    const setStartEndNode = (id, r, c) =>{
        if(id === 1){
            let newGrid = [...Grid] 
            let preStartNode = newGrid[START_NODE_ROW][START_NODE_COL];
            let curStartNode = newGrid[r][c];
            preStartNode.isStart = !preStartNode.isStart;
            curStartNode.isStart = !curStartNode.isStart;
            setGrid(newGrid);

            START_NODE_ROW = r;
            START_NODE_COL = c;
        }
        else{
            let newGrid = [...Grid] 
            let preEndNode = newGrid[END_NODE_ROW][END_NODE_COL];
            let curEndNode = newGrid[r][c];
            preEndNode.isEnd = !preEndNode.isEnd;
            curEndNode.isEnd = !curEndNode.isEnd;
            setGrid(newGrid);

            END_NODE_ROW = r;
            END_NODE_COL = c;
        } 
    }

    return (
    <>

    <div id="Container-blur">
        <Navbar/>
        <div className='path-container'>
            <div className='path-header'>
                    <div>
                        <div style={{"display":"flex","margin":"6px auto"}}>

                              

                                <select className='my-drop-down' value={pathID} onChange={(e)=>{setPathID(parseInt(e.target.value))}}>
                                    <option value="0">A* Search</option>
                                    <option value="1">Dijkstra</option>
                                    <option value="2">Depth-First Search</option>
                                    <option value="3">Breadth-First Search</option>
                                    
                                </select>
                                <button className='button-4 start-btn' class="btn btn-primary" onClick={pathFinding}>Find the possible path</button>

                        </div>
                            <div className='path-speed-btns' style={{ marginTop: '12px' }}>
                            <button className={`button-1 ${animateType===1 && 'curr-speed-btn'} mr-2 btn btn-secondary`} onClick={()=>animationTimeHandle(1)}>Fast</button>
                            <button className={`button-1 ${animateType===2 && 'curr-speed-btn'} mr-2 btn btn-secondary`} onClick={()=>animationTimeHandle(2)}>Average</button>
                            <button className={`button-1 ${animateType===3 && 'curr-speed-btn'} btn btn-secondary`} onClick={()=>animationTimeHandle(3)}>Slow</button>
                        </div>
                    </div>
                    <div>
                    <div className="d-flex mb-3">
                    <select className='my-drop-down mr-2' value={mazeID} onChange={(e)=>{setMazeID(parseInt(e.target.value))}}>
                        <option className='my-drop-down-option' disabled value="0">Select Maze</option>
                        <option value="1">Randomized maze</option>
                        <option value="2">Randomized DFS maze</option>
                        <option value="3">Recursive division</option>
                    </select>
                    <div className="mr-2">
                        <button className='button-4 start-maze-btn btn btn-dark' onClick={mazeHandle}>Create Maze</button>
                    </div>
                    <button className='button-4 btn btn-light btn-outline-dark' onClick={gridInitialize}>Clear walls</button>
                </div>

                        {/* <option value="4">Kruskal's algorithm</option>
                                <option value="5">Prim's algorithm</option> */}
                        <div className="d-flex">
                            <button className='button-4 btn btn-light btn-outline-dark mr-2' onClick={clearPathHandle}>Clear path</button>
                            <button className='button-4 btn btn-light btn-outline-dark' onClick={()=>{
                                START_NODE_ROW = InitSR;
                                START_NODE_ROW = InitSC;
                                END_NODE_ROW = InitER;
                                END_NODE_COL = InitEC;
                                clearPathHandle();
                                gridInitialize();
                            }}>
                                Reset board
                            </button>
                        </div>
                    </div>
            </div>
            <div className='grid'>
                <div onMouseLeave={()=>{setIsMousePress(false)}}>
                {/* JSX Node Of Grid (2D Array) */}
                {Grid.map((R,idx_r)=>{
                return (<div key={idx_r} className='ROW'>
                            {R.map((Value,idx_c)=>{
                                    const {x,y,isStart,isEnd,isWall} = Value;
                                    return <Node key={idx_c} 
                                    pv={{x,y,isStart,isEnd,isWall,onMouseDown,onMouseEnter,onMouseUp,setStartEndNode}}>
                                    </Node>
                                })
                            }
                        </div>)
                })}
                </div>
            </div>
        </div>
    </div>
    </>
    )
}

class Spot {
    constructor(i, j) {
        this.x = i;
        this.y = j;
        this.isWall = false;
        this.isStart = (i===START_NODE_ROW && j===START_NODE_COL);
        this.isEnd = (i===END_NODE_ROW && j===END_NODE_COL);
    }
}

function Node({pv}){
    const {x,y,isStart,isEnd,isWall,onMouseDown,onMouseEnter,onMouseUp,setStartEndNode} = pv;
    const allowDrop=(e)=>{e.preventDefault();}
    const drag=(e)=>{e.dataTransfer.setData("myID", e.target.id);}
    const drop=(e)=>{
        e.preventDefault();
        var data = e.dataTransfer.getData("myID");
        var dom = document.getElementById(data);
        var id = parseInt(dom.attributes.data_type.value);
        if(e.target.attributes.data_type.value !== "3" || e.target.attributes.wall.value === "true") return;
        
        // call the function
        var r = parseInt(e.target.attributes.data_x.value)
        var c = parseInt(e.target.attributes.data_y.value)
        setStartEndNode(id,r,c);
    }

    var classNode = isStart?"START_NODE":(isEnd?"END_NODE":(isWall?"obtacle":""));
    var typeId = isStart?"1":(isEnd?"2":"3");

    if(isStart || isEnd){
        return (
            <div 
            className={'square '+classNode} id={'row'+x+'_col'+y}
            data_x={x} 
            data_y={y} 
            data_type={typeId} 
            wall="false"
            draggable="true"
            onDragStart={drag} 
            onDrop={drop} 
            onDragOver={allowDrop}
            >
            </div>
        )
    }
    else{
        return(
            <div onMouseDown={(e)=>{
                e.preventDefault(); 
                onMouseDown(x,y)}
            } 
            onMouseEnter={(e)=>{
                e.preventDefault();
                onMouseEnter(x,y)}
            } 
            onMouseUp={(e)=>{
                e.preventDefault();
                onMouseUp()}
            } 
            className={'square '+classNode} id={'row'+x+'_col'+y}
            data_x={x} 
            data_y={y} 
            data_type={typeId} 
            wall={isWall.toString()}
            onDrop={drop} 
            onDragOver={allowDrop}
            >
            </div>
        )
    }
}

async function waitForAnimatoin(time){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve('');
        },time)
    })
}
const isValid = (r,c) =>{
    if((r===START_NODE_ROW && c===START_NODE_COL) || (r===END_NODE_ROW && c===END_NODE_COL)) return 0;
    else return 1;
}
export default App;