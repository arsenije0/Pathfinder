import { recoverPath } from '../../utility/index';

export default function astar(grid, animate, cooridinates, animateNoPath) {
    
    const startTime = new Date();
    const openSet = [];
    const closedSet = [];
    let stop = false;
    let startPoint = grid[cooridinates.start[0]][cooridinates.start[1]];
    let endPoint = grid[cooridinates.end[0]][cooridinates.end[1]];
    let animationData = {
        openSet: [],
        closedSet: []
    }
    
    openSet.push(startPoint);

    while(!stop && openSet.length > 0) {
        // Finding element with minimum "distance" to the end point
        // Should be done with minHeap...
        let min = 0;
        for(let i = 0; i < openSet.length; i++) {
            if(openSet[i].f < openSet[min].f) {
                min = i;
            }
        }
        let current = openSet[min];
        
        if(current === endPoint) {
            stop = true;
        } else {

            removeElement(openSet, current);
            closedSet.push(current);
            let validNeighbour = false;

            for(let i = 0; i < current.neighbours.length; i++) {
                let neighbour = current.neighbours[i];
                let isPushed = false;

                if(!closedSet.includes(neighbour) && !neighbour.wall) {
                    validNeighbour = true;
                    let tempG = current.g + 1;
    
                    if(openSet.includes(neighbour)) {
                        if(tempG < neighbour.g) {
                            neighbour.g = tempG;
                            neighbour.previous = current;
                        }
                    } else {
                        isPushed = true;
                        neighbour.g = tempG;
                        neighbour.previous = current;
                        openSet.push(neighbour);
                    }
    
                    neighbour.h = heuristic(neighbour, endPoint);
                    neighbour.f = neighbour.g + neighbour.h;

                    // Sending data
                    if(isPushed) {
                        animationData.openSet.push(neighbour);
                        animationData.closedSet.push(current);
                    }
                }
            }
        }
    }

    if(endPoint.previous) {
        const path = recoverPath(endPoint);
        let time = (((new Date()) - startTime)/1000).toFixed(3);
        animate(path, time, animationData);
    } else {
        animateNoPath(animationData);
    }
}

function removeElement(arr, element) {
    for(let i = arr.length - 1; i >= 0; i--) {
        if(arr[i] === element) {
            arr.splice(i, 1);
            break;
        }
    }
}

function heuristic(a, b) {
    // Manhattan heuristic
    return Math.abs(a.i - b.i) + Math.abs(a.j - b.j);
}
