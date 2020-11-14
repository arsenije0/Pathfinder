import { recoverPath } from '../../utility/index';

export default function dijkstrasAlgorithm(grid, animate, cooridinates, animateNoPath) {

    const startTime = new Date();
    let startPoint = grid[cooridinates.start[0]][cooridinates.start[1]];
    let endPoint = grid[cooridinates.end[0]][cooridinates.end[1]];
    let openSet = [];
    let closedSet = [];
    let stop = false;
    let animationData = {
        openSet: [],
        closedSet: []
    }

    openSet.push(startPoint);
    startPoint.value = 0;

    while(!stop && openSet.length > 0) {
        let min = 0;
        for(let i = 0; i < openSet.length; i++) {
            if(openSet[i].value < openSet[min].value) {
                min = i;
            }
        }
        let current = openSet[min];

        if(current === endPoint) {
            stop = true;
        } else {
            removeElement(openSet, current);
            closedSet.push(current);
            let neighbours = current.neighbours;
            let isPushed = false;

            for(let i = 0; i < neighbours.length; i++) {
                let neighbour = neighbours[i];
                let isInside = false;
                if(!neighbour.wall && !closedSet.includes(neighbour)) {
                
                    if(!openSet.includes(neighbour)) {
                        openSet.push(neighbour);
                        isInside = true;
                        isPushed = true;
                    }

                    if(neighbour.value > current.value + value(current, neighbour)) {
                        neighbour.value = current.value + value(current, neighbour);
                        neighbour.previous = current;
                    }
                    if(neighbour === endPoint) {
                        stop = true;
                    }

                    // Sending data
                    if(isInside) {
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

function value(node, neighbour) {
    if(node.i !== neighbour.i && node.j !== neighbour.j) {
        return Math.sqrt(2);
    } else {
        return 1;
    }
}