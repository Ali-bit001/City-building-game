import minHeap from "./minHeap.js";
/*
    start is {x,y}
    end is {x,y}
*/
const dx = [0,0,1,-1];
const dy = [1,-1,0,0];
export default function shortestPath(start,end,city){
    const heap = new minHeap();
    const bestCost = new Map();
    const parent = new Map();
    for(let i = 0;i < 4;++i){
        let x = start[0] + dx[i];
        let y = start[1] + dy[i];
        if(x < 0 || x >= city.size || y < 0 || y >= city.size || city.data[x][y].building?.id !== 'road'){
            continue;
        }
        else{
            heap.push([x,y,0]);
            bestCost.set(`${x},${y}`,0);
            parent.set(`${x},${y}`,`${start[0]},${start[1]}`);
        }
    }
    while(!heap.isEmpty()){
        const [x,y,cost] = heap.pop();
        if(isAdjacentToTarget(x,y,end)){
            const path = [];
            let current = `${x},${y}`;
            while(current !== `${start[0]},${start[1]}`){
                const [cx,cy] = current.split(",").map(Number);
                path.push([cx,cy]);
                current = parent.get(current);
            }
            path.reverse();
            return path;
        }   
        for(let i = 0;i < 4;++i){
            let tx = x + dx[i];
            let ty = y + dy[i];
            if(tx < 0 || tx >= city.size || ty < 0 || ty >= city.size || city.data[tx][ty].building?.id !== 'road'){
                continue;
            }
            else{
                const newCost = cost + 1;
                if(!bestCost.has(`${tx},${ty}`) || newCost < bestCost.get(`${tx},${ty}`)){
                    bestCost.set(`${tx},${ty}`,newCost);
                    parent.set(`${tx},${ty}`,`${x},${y}`);
                    heap.push([tx,ty,newCost]);
                }
            }
        }
    }
    return undefined;
}
function isAdjacentToTarget(x,y,end){
    for(let i = 0;i < 4;++i){
        let tx = x + dx[i];
        let ty = y + dy[i];
        if(tx == end[0] && ty == end[1]){
            return true;
        }
    }
    return false;
}