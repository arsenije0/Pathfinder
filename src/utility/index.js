import React from 'react';
import styled from 'styled-components';
import { 
    WALL_COLOR,
    START_COLOR,
    END_COLOR,
    BOX_COLOR
} from '../constants/index';

export function makePath(current, next, arr, color) {
    const options = {};
    options.backgroundColor = color;
    options.transformOrigin = "initial";
    options.width = "1px";
    options.height = "1px";
    options.boxShadow = "0px 0px 12px 4px " + color;

    if(current.i === next.i) {
        if(current.j < next.j) {
            options.width = 100 + "%";
            options.left = "50%";
            options.top = "50%";
            options.transform = "translateY(-50%)";
        } else {
            options.width = 100 + "%";
            options.left = "-50%";
            options.top = "50%";
            options.transform = "translateY(-50%)";
        }
    } else if(current.j === next.j) {
        if(current.i < next.i) {
            options.height = 100 + "%";
            options.left = "50%";
            options.top = "50%";
            options.transform = "translateX(-50%)";
        } else {
            options.height = 100 + "%";
            options.left = "50%";
            options.top = "-50%";
            options.transform = "translateX(-50%)";
        }   
    } else {
        // Math.sqrt(100**2 + 100**2) ~ 141
        options.width = 141 + "%";
        options.left = "50%";
        options.top = "50%";
        options.transformOrigin = "top left";

        if(current.j === next.j + 1 && current.i === next.i + 1) {
            options.transform = "rotate(-135deg)";
        }
        if(current.j === next.j + 1 && current.i === next.i - 1) {
            options.transform = "rotate(-225deg)";
        }
        if(current.j === next.j - 1 && current.i === next.i + 1) {
            options.transform = "rotate(-45deg)";
        }
        if(current.j === next.j - 1 && current.i === next.i - 1) {
            options.transform = "rotate(45deg)";
        }
    }
    arr.push([ options, [current.i, current.j] ]);
}

export function addRandSquares(num, gridSize, cooridinates) {
    const start = cooridinates.start;
    const end = cooridinates.end;

    if(num <= gridSize.columns*gridSize.rows - 2) {
        const map = new Map();
        for(let i = 0; i < num; i++) {
            let x = Math.round(Math.random()*(gridSize.rows - 1));
            let y = Math.round(Math.random()*(gridSize.columns - 1));

            while(map.has(x.toString() + " " + y.toString()) ||
                (x === start[0] && y === start[1]) || 
                (x === end[0] && y === end[1]) ) 
            {
                x = Math.round(Math.random()*(gridSize.rows - 1));
                y = Math.round(Math.random()*(gridSize.columns - 1));
            }
            
            map.set(x.toString() + " " + y.toString(), [x,y]);
        }
        return map;
    } else {
        return null;
    }
}

function isPathPossible(start, end) {
    const stack = [];
    stack.push(start);
    let map = new Map();
    map.set(start, true);

    while(stack.length > 0) {
        const el = stack.pop();
        map.set(el, true);

        if(el === end) {
            return true;
        } else {
            for(let i = 0; i < el.neighbours.length; i++) {
                if(el.neighbours[i].wall === false && !map.has(el.neighbours[i])) {
                    stack.push(el.neighbours[i]);
                }
            }
        }
    }
    return false;
}

export function uniqueBoxKey(x, y) {
    return x.toString() + " " + y.toString();
}

export function shortestPath(cooridinates) {
    let sX = cooridinates.start[0];
    let sY = cooridinates.start[1];
    let eX = cooridinates.end[0];
    let eY = cooridinates.end[1];
    return Math.abs(sX - eX) > Math.abs(sY - eY) ? Math.abs(sX - eX) : Math.abs(sY - eY);
}

export function makeGrid(blocks, gridSize, cooridinates) {

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

    const boxes = {};
    let counter = 0;
    for(let i = 0; i < gridSize.rows; i++) {
        for(let j = 0; j < gridSize.columns; j++) {
            if(i === cooridinates.start[0] && j === cooridinates.start[1]) {
                boxes[uniqueBoxKey(i,j)] = <Box
                    color={START_COLOR}
                    cursor={"move"}
                    key={uniqueBoxKey(i,j)}
                    id={uniqueBoxKey(i,j)} 
                    width={100/gridSize.columns} />;
            } else if(i === cooridinates.end[0] && j === cooridinates.end[1]) {
                boxes[uniqueBoxKey(i,j)] = <Box
                    color={END_COLOR}
                    cursor={"move"}
                    key={uniqueBoxKey(i,j)}
                    id={uniqueBoxKey(i,j)} 
                    width={100/gridSize.columns} />;
            } else if(blocks.has(i.toString() + " " + j.toString())) {
                //Blocking squares here...
                boxes[uniqueBoxKey(i,j)] = <Box 
                    color={WALL_COLOR}
                    key={uniqueBoxKey(i,j)}
                    id={uniqueBoxKey(i,j)} 
                    width={100/gridSize.columns} />;
            } else {
                boxes[uniqueBoxKey(i,j)] = <Box
                    key={uniqueBoxKey(i,j)}
                    id={uniqueBoxKey(i,j)}
                    width={100/gridSize.columns} />;
            }
            counter++;
        }
    }
    return boxes;
}

function Node(i, j, element, rows, columns, blocks, startOrEnd) {
    
    this.i = i;
    this.j = j;
    this.element = element;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.distance = 0;
    this.value = Infinity;
    this.neighbours = [];
    this.previous = null;
    this.wall = false;
    this.rows = rows;
    this.columns = columns;
    this.startOrEnd = startOrEnd;
    this.visited = false;

    
    if(blocks.has(i.toString() + " " + j.toString())) {
        this.wall = true;
    }

    this.addNeighbours = function(grid) {
        if(this.i < rows - 1) {
            this.neighbours.push(grid[this.i + 1][this.j]);
        }
        if(this.i > 0) {
            this.neighbours.push(grid[this.i - 1][this.j]);
        }
        if(this.j < columns - 1) {
            this.neighbours.push(grid[this.i][this.j + 1]);
        }
        if(this.j > 0) {
            this.neighbours.push(grid[this.i][this.j - 1]);
        }
        if(this.i > 0 && this.j > 0) {
            this.neighbours.push(grid[this.i - 1][this.j - 1]);
        }
        if(this.i < rows - 1 && this.j > 0) {
            this.neighbours.push(grid[this.i + 1][this.j - 1]);
        }
        if(this.i > 0 && this.j < columns - 1) {
            this.neighbours.push(grid[this.i - 1][this.j + 1]);
        }
        if(this.i < rows - 1 && this.j < columns - 1) {
            this.neighbours.push(grid[this.i + 1][this.j + 1]);
        }
    }
}

export function createNodes(gridSize, boxes, blocks, cooridinates) {
    let rows = gridSize.rows;
    let columns = gridSize.columns;
    const grid = [];

    for(let i = 0; i < rows; i++) {
        grid[i] = new Array(columns);
    }
    for(let i = 0; i < rows; i++) {
        for(let j = 0; j < columns; j++) {
            let startOrEnd = null;
            if(i === cooridinates.start[0] && j === cooridinates.start[1]) {
                startOrEnd = "start";
            }
            if(i === cooridinates.end[0] && j === cooridinates.end[1]) {
                startOrEnd = "end";
            }
            grid[i][j] = new Node(i, j, boxes[uniqueBoxKey(i,j)], rows, columns, blocks, startOrEnd);
        }
    }
    return grid;
}

export function createNeighbours(grid, gridSize) {
    let rows = gridSize.rows;
    let columns = gridSize.columns;
    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < columns; j++) {
          grid[i][j].addNeighbours(grid);
      }
   }
}

export function resetGrid(grid, gridSize) {
    let rows = gridSize.rows;
    let columns = gridSize.columns;
    for(let i = 0; i < rows; i++) {
      for(let j = 0; j < columns; j++) {
            grid[i][j].f = 0;
            grid[i][j].g = 0;
            grid[i][j].h = 0;
            grid[i][j].distance = 0;
            grid[i][j].value = Infinity;
            grid[i][j].previous = null;
            grid[i][j].visited = false;
      }
   }
}

export function isStartOrEnd(cooridinates, point) {
    if(point[0] === cooridinates.start[0] && point[1] === cooridinates.start[1]) return "start";
    if(point[0] === cooridinates.end[0] && point[1] === cooridinates.end[1]) return "end";
    return false;
}

export function recoverPath(point) {
    const path = [];
    let temp = point;
    path.push(temp);
    while(temp.previous) {
        path.push(temp.previous);
        temp = temp.previous;
    }
    return path;
}