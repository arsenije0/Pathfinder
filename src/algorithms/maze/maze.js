import { GRID_SIZE } from '../../constants/index';

/*
* IDEA: 
* => perform randomizedDepthFirstSearch() on the smaller grid
* => transform results into 2x grid
* => use "walls" as path
*/
   
// Grid dimensions should be even numbers for smooth scaling up from 1x to 2x grid.

export default function maze() {

    // Creating 2x grid.
    const GRID = [];
    for(let i = 0; i < GRID_SIZE.rows; i++) {
        GRID[i] = new Array();
        for(let j = 0; j < GRID_SIZE.columns; j++) {
            GRID[i][j] = {};
        }
    }

    // Creating 1x grid.
    // Math.round((GRID_SIZE.rows)/2) + 1 so the last row and column will not be all walls. 
    const grid = [];
    for(let i = 0; i < Math.round((GRID_SIZE.rows)/2) + 1; i++) {
        grid[i] = new Array();
        for(let j = 0; j < Math.round((GRID_SIZE.columns)/2) + 1; j++) {
            grid[i][j] = {
                right: false,
                bottom: false,
                left: false,
                top: false
            };
        }
    }

    randomizedDepthFirstSearch(grid);

    // Transforming the result into 2x grid
    for(let i = 0, I = 0; i < GRID_SIZE.rows; i=i+2, I++) {
        for(let j = 0, J = 0; j < GRID_SIZE.columns; j=j+2, J++) {
            /*
            * 0 => no walll
            * 1 => wall
            */
            GRID[i][j] = 0;
            // RIGHT
            if(grid[I][J].right) {
                GRID[i][j+1] = 0;
            } else {
                GRID[i][j+1] = 1;
            }
            // BOTTOM
            if(grid[I][J].bottom) {
                GRID[i+1][j] = 0;
            } else {
                GRID[i+1][j] = 1;
            }
            // RIGHT-BOTTOM JUNCTION
            if(i+1 < GRID_SIZE.rows && j+1 <  GRID_SIZE.columns) {
                GRID[i+1][j+1] = 1;
            }
        }
    }

    return GRID;
}

/****************************************************************************************/

function randomizedDepthFirstSearch(G) {

    // Creating the grid
    let grid = [];
    for(let i = 0; i <  Math.round((GRID_SIZE.rows)/2) + 1; i++) {
        grid[i] = new Array();
        for(let j = 0; j <  Math.round((GRID_SIZE.columns)/2) + 1; j++) {
            grid[i][j] = createNode(i, j, G[i][j]);
        }
    }

    // Adding neighbours
    for(let i = 0; i <  Math.round((GRID_SIZE.rows)/2) + 1; i++) {
        for(let j = 0; j <  Math.round((GRID_SIZE.columns)/2) + 1; j++) {
           addNeighbours(grid[i][j], grid);
        }
    }

    rdfs(grid[0][0], null);

    function rdfs(node, prev) {
        node.isVisited = true;
        whichNeighbour(node, prev);

        let arr = [ ...node.neighbours ];
        let counter = node.neighbours.length - 1;
        while(counter >= 0) {
            // num is random number in interval [0, arr.length]
            let num = Math.floor(Math.random()*(counter+1));
            if(!arr[num].isVisited) rdfs(arr[num], node);
            arr = arr.filter((x, index) => index !== num);
            counter--;
        }
    }
}

function createNode(i, j, element) {
    return {
        i: i,
        j: j,
        neighbours: [],
        isVisited: false,
        element: element
    };
}

function addNeighbours(node, grid) {
    if(node.i < Math.round((GRID_SIZE.rows)/2)) {
        node.neighbours.push(grid[node.i + 1][node.j]);
    }
    if(node.i > 0) {
        node.neighbours.push(grid[node.i - 1][node.j]);
    }
    if(node.j < Math.round((GRID_SIZE.columns)/2)) {
        node.neighbours.push(grid[node.i][node.j + 1]);
    }
    if(node.j > 0) {
        node.neighbours.push(grid[node.i][node.j - 1]);
    }
}

function whichNeighbourUtil(node, neighbour) {
    if(node.i === neighbour.i) {
        if(node.j > neighbour.j) {
            return "L";
        } else {
            return "R";
        }
    } else if(node.j === neighbour.j) {
        if(node.i > neighbour.i) {
            return "T";
        } else {
            return "B";
        }
    }
}

function whichNeighbour(node, prev) {
    if(prev) {
        switch(whichNeighbourUtil(node, prev)) {
            case "R":
                node.element.right = true;
                prev.element.left = true;
                break;
            case "L":
                node.element.left = true;
                prev.element.right = true;
                break;
            case "T":
                node.element.top = true;
                prev.element.bottom = true;
                break;
            case "L":
                node.element.bottom = true;
                prev.element.top = true;
                break;
        }
    }
}