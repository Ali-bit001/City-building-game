export function createCity(size){
    const cityMetaData = {
        population : 0,
        money : 1000,
        power : 0,
        water : 0
    };
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
                data[x][y].building?.update();
            }
        }
    }
    initialize();
    return {
        metaData: cityMetaData,
        size,data,update
    };
}
function createTile(x,y){
    return {
        x,
        y,
        building : undefined,
        terrainId : "grass",
    };
}