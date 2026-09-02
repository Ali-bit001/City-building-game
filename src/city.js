export function createCity(size){
    const cityMetaData = {
        population : 0,
        money : 10000,
        power : 0,
        water : 0
    };
    const data = [];
    let commercialBuildings = new Set();
    let industrialBuildings = new Set();
    let citizens = new Set();
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
        cityMetaData.population = 0;
        for(let x = 0;x < size;++x){
            for(let y = 0;y < size;++y){
                if(data[x][y].building?.id == 'commercial'){
                    let commercialBuilding = data[x][y].building;
                    if(commercialBuilding.currentEmployees < commercialBuilding.maxEmployees){
                        commercialBuildings.add(commercialBuilding);
                    }
                }
                if(data[x][y].building?.id == 'commercial' && data[x][y].building.currentEmployees == data[x][y].building.maxEmployees){
                    commercialBuildings.delete(data[x][y].building);
                }
                if(data[x][y].building?.id == 'industrial' && data[x][y].building.currentEmployees < data[x][y].building.maxEmployees){
                    industrialBuildings.add(data[x][y].building);
                }
                if(data[x][y].building?.id == 'industrial' && data[x][y].building.currentEmployees == data[x][y].building.maxEmployees){
                    industrialBuildings.delete(data[x][y].building);
                }
                data[x][y].building?.update(cityMetaData.power,cityMetaData.water,commercialBuildings,industrialBuildings);
                if(data[x][y].building?.id == 'residential'){
                    cityMetaData.population += data[x][y].building.citizens.length;
                    for(const citizen of data[x][y].building.citizens){
                        citizens.add(citizen);
                    }
                }
            }
        }
    }
    initialize();
    return {
        metaData: cityMetaData,
        size,data,update,citizens
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