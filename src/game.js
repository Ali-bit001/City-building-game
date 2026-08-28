import {createScene} from "./scene.js";
import {createCity} from "./city.js";
export function createGame(){
    const city = createCity(25);
    const scene = createScene();
    scene.initialize(city);

    document.addEventListener("mousedown",scene.onMouseDown,false);
    document.addEventListener("mouseup",scene.onMouseUp,false);
    document.addEventListener("mousemove",scene.onMouseMove,false);
    const game={
        update(){
            city.update();
            scene.update(city);
        }
    };
    setInterval(()=>{
        game.update();
    },1000);
    scene.start();
    return {game}
}