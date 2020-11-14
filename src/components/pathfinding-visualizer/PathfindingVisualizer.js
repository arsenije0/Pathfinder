import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import UserInterface from './../UI/UserInterface';
import Modal from './../others/Modal';
import Result from './../others/Result';
import OperationStatus from './../others/OperationStatus';
import Tutorial from './../tutorial/index';
import { 
    makePath, 
    addRandSquares,
    uniqueBoxKey,
    makeGrid,
    createNodes,
    createNeighbours,
    resetGrid,
    isStartOrEnd
} from '../../utility/index'
import { 
    WALL_COLOR, 
    ALGO_COLORS,
    PATH_COLOR,
    START_COLOR,
    END_COLOR,
    BOX_COLOR,
    COORIDINATES,
    GRID_SIZE,
    ANIMATION_SPEED
} from '../../constants/index';

import astar from '../../algorithms/astar/astar';
import bfs from '../../algorithms/bfs/bfs';
import dfs from '../../algorithms/dfs/dfs';
import dijkstra from '../../algorithms/dijkstra/dijkstra';
import maze from '../../algorithms/maze/maze';

const BoardContainer = styled.div`
    display: flex;
    flex-flow: wrap;
    margin: auto;
    position: relative;
`;

const InnerWrapper = styled.div`
    margin: auto;
    position: relative;
    border: 2px solid aqua;
    box-sizing: border-box;
`;

const Wrapper = styled.div`
    margin: auto;
    width: 100%;
    position: relative;
    overflow: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar { 
        display: none;
    }
`;

const Line = styled.div`
    position: absolute;
    z-index: 2;
    width: ${props => props.width ? props.width : "1px"};
    height: ${props => props.height ? props.height : "1px"};
    background-color: ${props => props.backgroundColor};
    left: ${props => props.left ? props.left : "0"};
    top: ${props => props.top ? props.top : "0"};
    box-shadow: ${props => props.boxShadow};
    transform-origin: ${props => props.transformOrigin ? props.transformOrigin : "initial"};
    transform: ${props => props.transform ? props.transform : "translateX(0)"};
`;

const Box = styled.div`
    background-color: ${props => props.color ? props.color : BOX_COLOR};
    width: ${props => props.width + "%"};
    box-sizing: border-box;
    border: 1px solid ${WALL_COLOR};
    position: relative;

    &:hover {
        cursor: ${props => props.cursor ? props.cursor : "default"};
    }

    &:after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }
`;

const CenterParagraph = styled.p`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: aqua;
    font-weight: bold;
    text-align: center;
`;

const MainWrapper = styled.div`
    position: relative;
`;

export default class PathfindingVisualizer extends Component {

    constructor(props) {
        super(props);
        // blocks map holds the positions of all walls on the grid.
        let blocks = new Map();
        // boxes are box elements of which the grid is made of.
        // They are scattered in state obj, rather than in 2d arr, for preformance gains
        const boxes = makeGrid(blocks, GRID_SIZE, COORIDINATES);
        // This grid is used for algorithms.
        const grid = createNodes(GRID_SIZE, boxes, blocks, COORIDINATES);
        createNeighbours(grid, GRID_SIZE);

        // This array is used to avoid state updates in "wall writting" process.
        this.up = [];
        
        this.state = {
            ...boxes,
            algorithms: ["dijkstra", "bfs", "dfs", "astar"],
            blocks: blocks,
            cooridinates: { ...COORIDINATES },
            grid: grid,
            chosenAlgo: "dijkstra",
            /* Boolean that tells us if the animation is happening. */
            ongoingAnimation: false,
            /* mouseClicked is used for drag feature in creating the walls. */
            mouseClicked: false,
            /*  writtingWalls is used for switching between writting and deleting. */
            writtingWalls: false,

            /* These booleans are used for OperatinoStatus modals. */
            generatingWalls: false,
            failedPathfinding: false,
            generatingPath: false,
            gridCleanUp: false,
            clearWalls: false,
            generatingMaze: false,

            /* path stores location of the algorithm path for the purpose of deleting
            it in reset() */
            path: new Map(),
            /* movingPoint stores cooridinates of start or end when we decide to move them. */
            movingPoint: {
                start: false,
                end: false
            },
            /* tutorial tells us when to display guide. */
            tutorial: true,
            /* If algorithm is succesfull, here we store info for displaying. */
            result: {
                length: 0,
                time: 0
            },
            /* Boolean which tells us when to display results. */
            resultHere: false
        };
    }

    createBox = (id, color, cursor="default") => {
        return (<Box 
            color={color}
            cursor={cursor}
            key={id}
            id={id}
            width={100/GRID_SIZE.columns}
            onMouseDown={this.mouseDown}
            onMouseEnter={this.mouseDrag}
            onMouseUp={this.mouseUp} />);
    }

    itemClick = (event) => {
        this.setState({ chosenAlgo: event.target.id });
    }

    getOngoingAnimation = () => {
        return this.state.ongoingAnimation;
    }

    toggleFailedPathfinding = () => {
        let temp = !this.state.failedPathfinding;
        this.setState({ failedPathfinding: temp });
    }

    toggleTutorial = () => {
        let temp = !this.state.tutorial;
        this.setState({ tutorial: temp });
    }

    /*******************************************************************************/

    // Function that returns our app to initial state, located in "Clear" button.
    reset = () => {
        this.setState({ gridCleanUp: true }, () => {
            setTimeout(() => {
                resetGrid(this.state.grid, GRID_SIZE);
                let boxesForUpdate = {};
                let map = new Map(this.state.path);
                
                for(let [key, val] of map) {
                    let arr = [
                        parseInt(key.split(" ")[0]),
                        parseInt(key.split(" ")[1])
                    ];
                    if(!isStartOrEnd(this.state.cooridinates, arr)) {
                        boxesForUpdate[key] = this.createBox(key, "");
                    } else {
                        let color = isStartOrEnd(this.state.cooridinates, arr) === "start" ?
                            START_COLOR : END_COLOR;
                        boxesForUpdate[key] = this.createBox(key, color, "move");
                    }
                }
                this.setState({ 
                    ...boxesForUpdate, 
                    ongoingAnimation: false, 
                    path: new Map(),
                    failedPathfinding: false,
                    resultHere: false,
                    result: {
                        time: 0,
                        length: 0
                    }
                });
                setTimeout(() => {
                    this.clearGrid();
                    this.setState({ gridCleanUp: false });
                }, 0);
            }, 0);
        });
    }

    // This function only changes background colors of boxes through their ids, it doesn't update the state.
    clearGrid = () => {
        for(let i = 0; i < GRID_SIZE.rows; i++) {
            for(let j = 0; j < GRID_SIZE.columns; j++) {
                if((i === this.state.cooridinates.start[0] && j === this.state.cooridinates.start[1])
                || (i === this.state.cooridinates.end[0] && j === this.state.cooridinates.end[1])) {
                    //...
                } else {
                    if(this.state.blocks.has(i.toString() + " " + j.toString())) {
                        document.getElementById(uniqueBoxKey(i,j)).style.backgroundColor = WALL_COLOR;
                    } else {
                        document.getElementById(uniqueBoxKey(i,j)).style.backgroundColor = BOX_COLOR;
                    }
                }
            }
        }
    }

    /*************************************************************************************************/
    // Functions that animate the data received when the algorithm is done.

    animate = (path, time, animationData) => {

        let colors = [ ...ALGO_COLORS ];
        let pathInfo = [];
        if(path) {
            for(let i = path.length - 1; i > 0; i--) {
                makePath(path[i], path[i-1], pathInfo, PATH_COLOR);
            }
        }

        // Here we create the path
        const boxesForUpdate = {};
        let map = new Map();
        for(let i = 0; i < pathInfo.length; i++) {
            let c = i === 0 ? START_COLOR : colors[2];
            let x = pathInfo[i][1][0];
            let y = pathInfo[i][1][1];
            map.set(uniqueBoxKey(x, y), true);
            boxesForUpdate[uniqueBoxKey(x, y)] = 
                <Box 
                    key={uniqueBoxKey(x,y)} 
                    width={100/GRID_SIZE.columns}
                    color={c} >
                    <Line 
                        width={pathInfo[i][0].width}
                        height={pathInfo[i][0].height}
                        backgroundColor={pathInfo[i][0].backgroundColor}
                        left={pathInfo[i][0].left}
                        top={pathInfo[i][0].top}
                        transformOrigin={pathInfo[i][0].transformOrigin}
                        transform={pathInfo[i][0].transform}
                        boxShadow={pathInfo[i][0].boxShadow} />
                </Box>
        }

        // Animation part
        let counter = 0;
        let interval = setInterval(() => {
            // When clear button is pressed.
            if(!this.state.ongoingAnimation) {
                return clearInterval(interval);
            }
            // End conditions.
            if(counter === animationData.openSet.length) {
                clearInterval(interval);
                this.setState({ generatingPath: true }, () => {
                    setTimeout( () => {
                        this.setState({
                            ...boxesForUpdate,
                            path: map,
                            resultHere: true,
                            result: {
                                time: time,
                                length: path.length
                            },
                            generatingPath: false
                        });
                }, 0);
                });
            } else {
            // Updating the grid accordingly, without state updates.
                let closed = animationData.closedSet[counter];
                let open = animationData.openSet[counter];
                if(closed.startOrEnd === null) {
                    document.getElementById(uniqueBoxKey(closed.i, closed.j)).style.backgroundColor = colors[2];
                }
                if(open.startOrEnd === null) {
                    document.getElementById(uniqueBoxKey(open.i, open.j)).style.backgroundColor = colors[1];
                }
            }
            counter++;
        }, ANIMATION_SPEED);
    }

    animateNoPath = (animationData) => {
        let colors = [ ...ALGO_COLORS ];
        let counter = 0;
        let interval = setInterval(() => {
            // When clear button is pressed.
            if(!this.state.ongoingAnimation) {
                return clearInterval(interval);
            }
            // End conditions.
            if(counter === animationData.openSet.length) {
                this.toggleFailedPathfinding();
                clearInterval(interval);
            } else {
            // Updating the grid accordingly, without state updates.
                let closed = animationData.closedSet[counter];
                let open = animationData.openSet[counter];
                if(closed.startOrEnd === null) {
                    document.getElementById(uniqueBoxKey(closed.i, closed.j)).style.backgroundColor = colors[2];
                }
                if(open.startOrEnd === null) {
                    document.getElementById(uniqueBoxKey(open.i, open.j)).style.backgroundColor = colors[1];
                }
            }
            counter++;
        }, ANIMATION_SPEED);
    }

    /*************************************************************************************************/

    // Start Function
    initiatePathfinding = () => {
        this.clearGrid();
        this.setState({ 
            ongoingAnimation: true,
            movingPoint: {
                start: false,
                end: false
            }
        });
        this.up = [];

        setTimeout(() => {
            switch(this.state.chosenAlgo) {
                case "astar":
                    astar(this.state.grid, this.animate, this.state.cooridinates, this.animateNoPath);
                    break;
                case "bfs":
                    bfs(this.state.grid, this.animate, this.state.cooridinates, this.animateNoPath);
                    break;
                case "dijkstra":
                    dijkstra(this.state.grid, this.animate, this.state.cooridinates, this.animateNoPath);
                    break;
                case "dfs":
                    dfs(this.state.grid, this.animate, this.state.cooridinates, this.animateNoPath);
                    break;
                default:
                    break;
            }
        }, 0);
    }

    /*******************************************************************************/
    // Functions that creates functionality for "writing" walls on the grid and for moving Start and End points

    mouseDown = (event) => {
        let arr = [
            parseInt(event.target.id.split(" ")[0]), 
            parseInt(event.target.id.split(" ")[1])
        ];

        // Drawing of Walls
        if((!isStartOrEnd(this.state.cooridinates, arr) && !this.state.ongoingAnimation)
        && (!this.state.movingPoint.start && !this.state.movingPoint.end)) {
            this.up.push(event.target.id);
            let writtingWalls = true;
            if(this.state.grid[parseInt(arr[0])][parseInt(arr[1])].wall === true) {
                document.getElementById(event.target.id).style.backgroundColor = BOX_COLOR;
                writtingWalls = false;
            } else {
                document.getElementById(event.target.id).style.backgroundColor = WALL_COLOR;
            }
            this.setState({ 
                mouseClicked: true,
                writtingWalls: writtingWalls
            });

        // Moving of Start or End
        } else if(isStartOrEnd(this.state.cooridinates, arr) && !this.state.ongoingAnimation) {
            let movingPoint = { ...this.state.movingPoint };
            movingPoint.start = isStartOrEnd(this.state.cooridinates, arr) === "start" ?
                true : false;
            movingPoint.end = isStartOrEnd(this.state.cooridinates, arr) === "end"?
                true : false;
           this.prev = event.target.id;
           this.setState({ movingPoint: movingPoint, mouseClicked: false });
        }
    }

    mouseDrag = (event) => {
        let arr = [
            parseInt(event.target.id.split(" ")[0]), 
            parseInt(event.target.id.split(" ")[1])
        ];

        // Moving of Start or End
        if(this.state.movingPoint.start || this.state.movingPoint.end) {
            // This long condition below factors out the case when Start and End are coliding(in that case no change is made)
            if(!((this.state.movingPoint.start && 
                isStartOrEnd(this.state.cooridinates, arr) === "end") || 
                (this.state.movingPoint.end && 
                isStartOrEnd(this.state.cooridinates, arr) === "start"))) 
            {
                if(this.state.grid[this.prev.split(" ")[0]][this.prev.split(" ")[1]].wall) {
                    document.getElementById(this.prev).style.backgroundColor = WALL_COLOR;
                } else {
                    document.getElementById(this.prev).style.backgroundColor = BOX_COLOR;
                }

                if(this.state.movingPoint.start) {
                    document.getElementById(event.target.id).style.backgroundColor = START_COLOR;
                }
                if(this.state.movingPoint.end) {
                    document.getElementById(event.target.id).style.backgroundColor = END_COLOR;
                }
                this.prev = event.target.id;
            }

        // Drawing of Walls
        } else if(this.state.mouseClicked && !isStartOrEnd(this.state.cooridinates, arr)) {
            this.up.push(event.target.id);
            if(this.state.writtingWalls) {
                document.getElementById(event.target.id).style.backgroundColor = WALL_COLOR;
            } else {
                document.getElementById(event.target.id).style.backgroundColor = BOX_COLOR;
            }
        }
    }

    mouseUp = (event) => {
        // Here we update the changes caused by: 
        // 1. Moving of Start or End
        // 2. Drawing or deliting Walls
        if(this.state.movingPoint.start || this.state.movingPoint.end) {
            this.updateAfterPointMove(event.target.id);
        } else if(this.state.mouseClicked) {
            this.updateAfterWallInesrtions(this.up);
            this.up = [];
            this.setState({ mouseClicked: false });
        }
    }

    updateAfterPointMove = (id) => {
        let a = [
            parseInt(id.split(" ")[0]), 
            parseInt(id.split(" ")[1])
        ];
        // Edge case: moving from Start to Start(and for End)
        if((this.state.movingPoint.start && isStartOrEnd(this.state.cooridinates, a) === "start") ||  (this.state.movingPoint.end && isStartOrEnd(this.state.cooridinates, a) === "end")){
            this.setState({
                movingPoint: {
                    start: false,
                    end: false
                },
                mouseClicked: false
            });
            return;
        }
        // Edg case: is Start is prev and location is End, and vice versa.
        if(((this.state.movingPoint.start && isStartOrEnd(this.state.cooridinates, a) === "end") || (this.state.movingPoint.end && isStartOrEnd(this.state.cooridinates, a) === "start")))
        {
            id = this.prev;
        }

        let boxesForUpdate = {};
        let movingPoint = { 
            start: false,
            end: false
        };
        let grid = [ ...this.state.grid ];
        let blocks = new Map(this.state.blocks);
        let newPosition = [
            parseInt(id.split(" ")[0]), 
            parseInt(id.split(" ")[1])
        ]; 

        // If box was a wall...
        if(this.state.grid[newPosition[0]][newPosition[1]].wall) {
            blocks.delete(id);
            grid[newPosition[0]][newPosition[1]].wall = false;
        }

        let color = this.state.movingPoint.start === true ? START_COLOR : END_COLOR;
        boxesForUpdate[id] = this.createBox(id, color, "move");
        grid[newPosition[0]][newPosition[1]].startOrEnd = this.state.movingPoint.start === true ? "start" : "end";

        let arr = this.state.movingPoint.start ? [...this.state.cooridinates.start]
            : [...this.state.cooridinates.end];
        boxesForUpdate[uniqueBoxKey(arr[0], arr[1])] = this.createBox(uniqueBoxKey(arr[0], arr[1]), "");
        grid[arr[0]][arr[1]].startOrEnd = null;
        
        let cooridinates = { 
            start: this.state.movingPoint.start ? newPosition : [...this.state.cooridinates.start],
            end: !this.state.movingPoint.start ? newPosition : [...this.state.cooridinates.end]
        };

        this.prev = null;
        this.setState({ 
            ...boxesForUpdate,
            movingPoint: movingPoint,
            blocks: new Map(blocks),
            grid: grid,
            cooridinates: cooridinates,
            mouseClicked: false
        });
    }

    updateAfterWallInesrtions = (arr) => {
        let blocks = new Map(this.state.blocks);
        let grid = [];
        for(let i = 0; i < GRID_SIZE.rows; i++) {
            grid[i] = [ ...this.state.grid[i] ];
        }
        let boxesForUpdate = {};
        for(let i = 0; i < arr.length; i++) {
            let color = "";
            if(this.state.writtingWalls) {
                blocks.set(arr[i]);
                grid[parseInt(arr[i].split(" ")[0])][parseInt(arr[i].split(" ")[1])].wall = true;
                color = WALL_COLOR;
            } else {
                blocks.delete(arr[i]);
                grid[parseInt(arr[i].split(" ")[0])][parseInt(arr[i].split(" ")[1])].wall = false;
                color = BOX_COLOR;
            }
            boxesForUpdate[arr[i]] = this.createBox(arr[i], color);
        }
        this.setState({ 
            ...boxesForUpdate,
            blocks: blocks,
            grid: grid 
        });
    }

    /*******************************************************************************/

    // Function that removes all walls from the grid
    clearWalls = () => {
        this.setState({ clearWalls: true });
        setTimeout(() => {
            let blocks = new Map(this.state.blocks);
            let grid = [];
            for(let i = 0; i < GRID_SIZE.rows; i++) {
                grid[i] = [ ...this.state.grid[i] ];
            }
            let boxesForUpdate = {};

            for(let [key, val] of blocks) {
                boxesForUpdate[key] = this.createBox(key, "");
                grid[parseInt(key.split(" ")[0])][parseInt(key.split(" ")[1])].wall = false;
            }

            this.setState({
                ...boxesForUpdate,
                blocks: new Map(),
                grid: grid
            });
            setTimeout(() => { 
                this.clearGrid();
                this.setState({ clearWalls: false }); 
            }, 0);
        }, 0);
    }

    clearWallsUtil = () => {
        let blocks = new Map(this.state.blocks);
        let grid = [];

        for(let i = 0; i < GRID_SIZE.rows; i++) {
            grid[i] = [ ...this.state.grid[i] ];
        }
        let boxesForUpdate = {};
        for(let [key, val] of blocks) {
            boxesForUpdate[key] = this.createBox(key, "");
            grid[parseInt(key.split(" ")[0])][parseInt(key.split(" ")[1])].wall = false;
        }

        this.setState({
            ...boxesForUpdate,
            blocks: new Map(),
            grid: grid
        });
        setTimeout(() => { 
            this.clearGrid();
        }, 0);
    }

    // Function that adds 650 randomly placed walls on the grid
    addWallsRandomly = () => {
        this.setState({ generatingWalls: true });
        setTimeout(() => {
            let blocks = addRandSquares(650, GRID_SIZE, this.state.cooridinates);
            let boxes = makeGrid(blocks, GRID_SIZE, this.state.cooridinates);
            boxes = this.addEvents(boxes);
            const grid = createNodes(GRID_SIZE, boxes, blocks, this.state.cooridinates);
            createNeighbours(grid, GRID_SIZE);
            this.setState({
                ...boxes,
                blocks: blocks,
                grid: grid,
                generatingWalls: false
            });
            this.clearGrid();
        }, 0);
    }

    // Function that creates maze pattern
    generateMaze = () => {
        this.setState({ generatingMaze: true }, () => {
            this.clearWallsUtil();
            setTimeout(() => {
                let blocks = new Map();
                let grid = [ ...this.state.grid ];
                let boxesForUpdate = {};
                let mazeCooridinates = maze();
                for(let i = 0; i < GRID_SIZE.rows; i++) {
                    for(let j = 0; j < GRID_SIZE.columns; j++) {
                        if(mazeCooridinates[i][j] === 0 && !isStartOrEnd(this.state.cooridinates, [i, j])) {
                            blocks.set(uniqueBoxKey(i, j), true);
                            grid[i][j].wall = true;
                            boxesForUpdate[uniqueBoxKey(i, j)] = this.createBox(uniqueBoxKey(i, j), WALL_COLOR);
                        }
                    }
                }

                this.setState({ 
                    ...boxesForUpdate,
                    blocks: blocks,
                    grid: grid,
                    generatingMaze: false
                }, () => this.clearGrid());
            }, 0);
        });
    }

    /*******************************************************************************/

    // Function that adappts the grid according to the size of the screen
    resizingOperations = () => {
        // Keep the height of the board the size of the screen. 
        let v = window.innerHeight - document.getElementById("ui").offsetHeight;
        if(document.getElementById("wrapper").offsetHeight !== v) {
           document.getElementById("wrapper").style.height = v + "px";
        }

        if(!this.state.ongoingAnimation) {
            // Calculating start and end positions based on screen size
            let b = document.getElementById("0 0").offsetWidth;
            let w = document.getElementById("wrapper").offsetWidth;
            let h = document.getElementById("wrapper").offsetHeight;
            if(h > document.getElementById("inner-wrapper").offsetHeight) {
                h = document.getElementById("inner-wrapper").offsetHeight;
            }
            let s = [parseInt((h/b)/2), parseInt((w/b)/3)];
            let e = [parseInt((h/b)/2), parseInt((2*w/b)/3)];

            const cooridinates = { ...this.state.cooridinates };
            let boxesForUpdate = {};
            let grid = [ ...this.state.grid ];
            let blocks = new Map(this.state.blocks);

            // Old position back to normal box
            if(s[0] !== cooridinates.start[0] || s[1] !== cooridinates.start[1]) {
                boxesForUpdate[uniqueBoxKey(cooridinates.start[0], cooridinates.start[1])] = this.createBox(uniqueBoxKey(cooridinates.start[0], cooridinates.start[1]), BOX_COLOR);
                boxesForUpdate[uniqueBoxKey(s[0], s[1])] = this.createBox(uniqueBoxKey(s[0], s[1]), START_COLOR, "move");
                grid[cooridinates.start[0]][cooridinates.start[1]].startOrEnd = null;
                grid[s[0]][s[1]].startOrEnd = "start";
                document.getElementById(uniqueBoxKey(s[0], s[1])).style.backgroundColor = START_COLOR;
            }
            if(e[0] !== cooridinates.end[0] || e[1] !== cooridinates.end[1]) {
                boxesForUpdate[uniqueBoxKey(cooridinates.end[0], cooridinates.end[1])] = this.createBox(uniqueBoxKey(cooridinates.end[0], cooridinates.end[1]), BOX_COLOR);
                boxesForUpdate[uniqueBoxKey(e[0], e[1])] = this.createBox(uniqueBoxKey(e[0], e[1]), END_COLOR, "move");
                grid[cooridinates.end[0]][cooridinates.end[1]].startOrEnd = null;
                grid[e[0]][e[1]].startOrEnd = "end";
                document.getElementById(uniqueBoxKey(e[0], e[1])).style.backgroundColor = END_COLOR;
            }
            
            // Update blocks if new position was a wall...
            if(grid[s[0]][s[1]].wall) {
                blocks.delete(uniqueBoxKey(s[0], s[1]));
            }
            if(grid[e[0]][e[1]].wall) {
                blocks.delete(uniqueBoxKey(e[0], e[1]));
            }

            // Update cooridinates
            let c = {
                start: [ ...s ],
                end: [ ...e ]
            }

            // UPDATE
            this.setState({
                ...boxesForUpdate,
                grid: grid,
                blocks: blocks,
                cooridinates: c
            });

            // Clear grid
            setTimeout(this.clearGrid, 0);
        }
    }

    /*******************************************************************************/

    componentDidMount = () => {
        // Setting the size of the grid.
        let width = window.screen.width;
        if(width < 1200) width = 1200;
        document.getElementById("wrapper").style.maxWidth = width + "px";
        document.getElementById("inner-wrapper").style.width = width + "px";

        //Keeping an eye on resizing...
        setTimeout(this.resizingOperations, 0);
        window.addEventListener('resize', this.resizingOperations);

        // Here we put mouse event functions in box elements
        this.setState( { ...this.addEvents() });
    }

    addEvents = (b = null) => {
        let boxes = {};
        if(b) boxes = b;
        for(let i = 0; i < GRID_SIZE.rows; i++) {
            for(let j = 0; j < GRID_SIZE.columns; j++) {
                let startOrEnd = isStartOrEnd(this.state.cooridinates, [i, j]);
                if(startOrEnd) {
                    boxes[uniqueBoxKey(i ,j)] = React.cloneElement(
                        this.state[uniqueBoxKey(i ,j)],
                        {
                            onMouseDown: this.mouseDown,
                            onMouseEnter: this.mouseDrag,
                            onMouseUp: this.mouseUp
                        }
                    );
                } else {
                    boxes[uniqueBoxKey(i ,j)] = React.cloneElement(
                        this.state[uniqueBoxKey(i ,j)],
                        {
                            onMouseDown: this.mouseDown,
                            onMouseEnter: this.mouseDrag,
                            onMouseUp: this.mouseUp
                        }
                    );
                }
            }
        }
        return boxes;
    }

    render() {
        let grid = [];
        for(let i = 0; i < GRID_SIZE.rows; i++) {
            grid[i] = new Array();
            for(let j = 0; j < GRID_SIZE.columns; j++) {
                grid[i][j] = this.state[uniqueBoxKey(i ,j)];
            }
        }

        let tutorial = null;
        if(this.state.tutorial) {
            tutorial = <Tutorial end={this.toggleTutorial} />;
        }

        let result = null;
        if(this.state.resultHere) {
            result = <Result result={this.state.result} />;
        }

        return (
            <MainWrapper>
                { tutorial }
                <UserInterface
                    id={"ui"}
                    initiatePathfinding={this.initiatePathfinding}
                    ongoingAnimation={this.state.ongoingAnimation}
                    reset={this.reset}
                    algorithms={this.state.algorithms}
                    chosenAlgo={this.state.chosenAlgo}
                    itemClick={this.itemClick}
                    clearWalls={this.clearWalls}
                    addWallsRandomly={this.addWallsRandomly}
                    tutorial={this.state.tutorial}
                    toggleTutorial={this.toggleTutorial}
                    generateMaze={this.generateMaze} />
                <Wrapper id={"wrapper"}>
                    <InnerWrapper id={"inner-wrapper"}>
                        <BoardContainer>
                            { grid }
                        </BoardContainer>
                    </InnerWrapper>
                    <OperationStatus 
                        txt="GENERATING WALLS..." 
                        on={this.state.generatingWalls} />
                    <OperationStatus 
                        txt="NO PATH IS POSSIBLE" 
                        on={this.state.failedPathfinding}
                        functionality={this.reset} />
                    <OperationStatus 
                        txt="ERASING WALLS..." 
                        on={this.state.clearWalls} />
                    <OperationStatus 
                        txt="GENERATING PATH..." 
                        on={this.state.generatingPath} />
                    <OperationStatus 
                        txt="CLEANING..." 
                        on={this.state.gridCleanUp} />
                    <OperationStatus 
                        txt="GENERATING MAZE..." 
                        on={this.state.generatingMaze} />
                    { result }
                </Wrapper>
            </MainWrapper>
        );
    }
}