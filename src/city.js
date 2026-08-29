export function createCity(size){
    const data = [];
    function initialize(){
        for(let x = 0;x < size;++x){
            const column = [];
            for(let y = 0;y < size;++y){
                const tile = createTile(x,y);
                column.push(tile);
            }
            data.push(column);
        }
    }
    function update(){
        for(let x = 0;x < size;++x){
            for(let y = 0;y < size;++y){
                data[x][y].update();
            }
        }
    }
    initialize();
    return {
        size,data,update
    };
}
function createTile(x,y){
    return {
        x,
        y,
        buildingId : undefined,
        terrainId : "grass",
        update(){

        }
    };
}