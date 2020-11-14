import { recoverPath } from '../../utility/index';

export default function bfsAlgorithm(grid, animate, cooridinates, animateNoPath) {

    const startTime = new Date();
    let startPoint = grid[cooridinates.start[0]][cooridinates.start[1]];
    let endPoint = grid[cooridinates.end[0]][cooridinates.end[1]];
    let queue = [];
    let closedSet = [];
    let stop = false;
    let animationData = {
        openSet: [],
        closedSet: []
    }

    startPoint.distance = 1;
    queue.push(startPoint);

    while(!stop && queue.length > 0) {
        let current = queue.shift();
        closedSet.push(current);

        if(current === endPoint) {
            stop = true;
        } else {
            let validNeighbour = false;
            for(let i = 0; i < current.neighbours.length; i++) {
                let isPushed = false;
                if(!current.neighbours[i].wall && !closedSet.includes(current.neighbours[i])) {
                    validNeighbour = true;
                    if(queue.includes(current.neighbours[i])) {
                        if(current.neighbours[i].distance > current.distance + 1) {
                            current.neighbours[i].distance = current.distance + 1;
                            current.neighbours[i].previous = current;
                        }
                    } else {
                        isPushed = true;
                        queue.push(current.neighbours[i]);
                        current.neighbours[i].distance = current.distance + 1;
                        current.neighbours[i].previous = current;
                    }

                    if(current.neighbours[i] === endPoint) {
                        stop = true;
                    }

                    // Sending data
                    if(isPushed) {
                        animationData.openSet.push(current.neighbours[i]);
                        animationData.closedSet.push(current);
                    }
                }
            }
        }
    }

    /*
    * If endPoint.previous === null, we know that no path is posible
    * because there is no connection with other nodes.
    */
    if(endPoint.previous) {
        const path = recoverPath(endPoint);
        let time = (((new Date()) - startTime)/1000).toFixed(3);
        animate(path, time, animationData);
    } else {
        animateNoPath(animationData);
    }
}