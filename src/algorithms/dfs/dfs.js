import { recoverPath } from '../../utility/index';

export default function dfsAlgorithm(grid, animate, cooridinates, animateNoPath) {

    const startTime = new Date();
    let startPoint = grid[cooridinates.start[0]][cooridinates.start[1]];
    let endPoint = grid[cooridinates.end[0]][cooridinates.end[1]];
    let end = false;
    let animationData = {
        openSet: [],
        closedSet: []
    }

    dfs(startPoint);
    if(!end) {
        animateNoPath(animationData);
    }

    function dfs(node, lastCall = false) {
        if(!end || lastCall) {
            node.visited = true;
            if(node !== endPoint) {
                for(let i = 0; i < node.neighbours.length; i++) {
                    if(!node.neighbours[i].visited && !node.neighbours[i].wall) {
                        node.neighbours[i].previous = node;
                        animationData.openSet.push(node.neighbours[i]);
                        animationData.closedSet.push(node);

                        if(node.neighbours[i] === endPoint) {
                            end = true;
                            dfs(node.neighbours[i], true);
                        } else {
                            dfs(node.neighbours[i]);
                        }
                    }
                }
            } else {
                end = true;
                const path = recoverPath(endPoint);
                let time = (((new Date()) - startTime)/1000).toFixed(3);
                animate(path, time, animationData);
            }
        }
    }
}