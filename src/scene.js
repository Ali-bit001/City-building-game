import * as THREE from "https://unpkg.com/three/build/three.module.js";
import { createCamera } from "./camera.js";
import { createAssetInstance } from "./assets.js";

const powerInfoDiv = document.querySelector("#info-toolbar .toolbar-info-div:nth-child(1)");
const waterInfoDiv = document.querySelector("#info-toolbar .toolbar-info-div:nth-child(2)");
const populationInfoDiv = document.querySelector("#info-toolbar .toolbar-info-div:nth-child(3)");
const moneyInfoDiv = document.querySelector("#info-toolbar .toolbar-info-div:nth-child(4)");
export function createScene(){
    const gameWindow = document.getElementById("render-target");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x777777);

    const camera = createCamera(gameWindow);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(gameWindow.offsetWidth,gameWindow.offsetHeight);
    gameWindow.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedObject = undefined;

    let terrain = [];
    let buildings = [];

    let onObjectSelected = undefined;
    function initialize(city){
        scene.clear();
        setupLights();
        terrain = [];
        buildings = [];

        for(let x = 0;x < city.size;++x){
            const column = [];
            for(let y = 0;y < city.size;++y){
                //load the mesh/3d object corresponding to tile
                //add the mesh to the scene
                //add the mesh to meshes array
                const terrainId = city.data[x][y].terrainId;
                //grass geometry
                const grassMesh = createAssetInstance(terrainId,x,y,city.data[x][y].building);
                if(grassMesh){
                    scene.add(grassMesh);
                }
                column.push(grassMesh);

            }
            terrain.push(column);
            buildings.push([...Array(city.size)]);
        }
    }
    function update(city){
        for(let x = 0;x < city.size;++x){
            for(let y = 0;y < city.size;++y){
                const tile = city.data[x][y];
                const existingBuildingMesh = buildings[x][y];
                //if player removes a building, remove it from scene
                if(!tile.building && existingBuildingMesh){
                    scene.remove(existingBuildingMesh);
                    city.metaData.power += existingBuildingMesh.userData.powerConsumption || 0;
                    city.metaData.water += existingBuildingMesh.userData.waterConsumption || 0;
                    buildings[x][y] = undefined;
                }
                //update
                if(tile.building && tile.building.updated){
                    city.metaData.power += existingBuildingMesh?.userData.powerConsumption || 0;
                    city.metaData.water += existingBuildingMesh?.userData.waterConsumption || 0;
                    scene.remove(existingBuildingMesh);
                    buildings[x][y] = createAssetInstance(tile.building.id,x,y,tile.building);
                    scene.add(buildings[x][y]);
                    buildings[x][y].userData.powerConsumption = tile.building.powerConsumption || 0;
                    buildings[x][y].userData.waterConsumption = tile.building.waterConsumption || 0;
                    city.metaData.power -= tile.building.powerConsumption || 0;
                    city.metaData.water -= tile.building.waterConsumption || 0;
                    tile.building.updated = false;
                }
            }
        }
        powerInfoDiv.textContent = `power : ${city.metaData.power}`;
        waterInfoDiv.textContent = `water : ${city.metaData.water}`;
        populationInfoDiv.textContent = `population : ${city.metaData.population}`;
        moneyInfoDiv.textContent = `money : ${city.metaData.money}`;
    }
    function setupLights(){
        const lights = [new THREE.AmbientLight(0xffffff,0.2),
            new THREE.DirectionalLight(0xffffff,0.3),
            new THREE.DirectionalLight(0xffffff,0.3),
            new THREE.DirectionalLight(0xffffff,0.3)
        ]
        //top down light
        lights[1].position.set(0,1,0);
        //random
        lights[2].position.set(1,1,0);
        lights[3].position.set(0,1,1);
        scene.add(...lights);
    }
    function draw(){
        renderer.render(scene,camera.camera);
    }
    function start(){
        renderer.setAnimationLoop(draw);
    }
    function stop(){
        renderer.setAnimationLoop(null);
    }
    function onMouseDown(event){
        mouse.x = (event.clientX/renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY/renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse,camera.camera);
        const intersects = raycaster.intersectObjects(scene.children,true);
        if(intersects.length > 0){
            const object = findSelectableObject(intersects[0].object);
            if(object){
                if(selectedObject){
                    selectedObject.traverse(child=>{
                        if(child.isMesh && child.material && child.material.emissive){
                            child.material.emissive.set(0x000000);
                        }
                    })
                }
                selectedObject = object;
                selectedObject.traverse(child=>{
                    if(child.isMesh && child.material && child.material.emissive){
                        child.material.emissive.set(0x555555);
                    }
                });
                if(this.onObjectSelected){
                    this.onObjectSelected(selectedObject);
                }
            }
            
        }
        camera.onMouseDown(event);
    }
    function onMouseUp(event){
        camera.onMouseUp(event);
    }
    function onMouseMove(event){
        camera.onMouseMove(event);
    }
    return {onObjectSelected,update,start,stop,onMouseDown,onMouseUp,onMouseMove,initialize};
}
function findSelectableObject(object){
    while(object){
        if(object.userData && object.userData.assetId){
            return object;
        }
        object = object.parent;
    }
    return undefined;
}