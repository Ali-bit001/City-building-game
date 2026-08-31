import {createScene} from "./scene.js";
import {createCity} from "./city.js";
import buildingFactory from "./building.js";
import {loadAssets} from "./assets.js";
export async function createGame(){
    try{
        await loadAssets();
    } catch (error) {
        console.error("Error loading assets:", error);
    }
    let activeTool = "";
    const city = createCity(25);
    const scene = createScene();
    scene.initialize(city);

    scene.onObjectSelected = (object)=>{
        console.log(object);
        let {x,y} = object.userData;
        const tile = city.data[x][y];
        if(activeTool === "bulldoze"){
            tile.building = undefined;
            scene.update(city);
        }
        else if(!tile.building){
            tile.building = buildingFactory[activeTool]();
            scene.update(city);
        }
    }
    document.addEventListener("mousedown",scene.onMouseDown.bind(scene),false);
    document.addEventListener("mouseup",scene.onMouseUp.bind(scene),false);
    document.addEventListener("mousemove",scene.onMouseMove.bind(scene),false);
    const game={
        update(){
            city.update();
            scene.update(city);
        },
        setActiveToolId(toolId){
            activeTool = toolId;
        }
    };
    setInterval(()=>{
        game.update();
    },1000);
    scene.start();
    return game;
}