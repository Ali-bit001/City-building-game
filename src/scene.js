import * as THREE from "https://unpkg.com/three/build/three.module.js";
import { createCamera } from "./camera.js";
import { createAssetInstance } from "./assets.js";

const powerInfoDiv = document.querySelector("#info-toolbar .toolbar-info-div:nth-child(1)");
const waterInfoDiv = document.querySelector("#info-toolbar .toolbar-info-div:nth-child(2)");
const populationInfoDiv = document.querySelector("#info-toolbar .toolbar-info-div:nth-child(3)");
const moneyInfoDiv = document.querySelector("#info-toolbar .toolbar-info-div:nth-child(4)");
let terrain = [];
let buildings = [];
let vehicles = [];
export function createScene(){
    const gameWindow = document.getElementById("render-target");

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x777777);

    const camera = createCamera(gameWindow);

    const renderer = new THREE.WebGLRenderer();
    const pixelRatio = Math.min(window.devicePixelRatio,2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(gameWindow.offsetWidth,gameWindow.offsetHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    gameWindow.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedObject = undefined;


    let clock = new THREE.Clock();
    let onObjectSelected = undefined;
    function addVehicle(vehicle){
        vehicles.push(vehicle);
        scene.add(vehicle.mesh);
    }
    function removeVehicle(vehicle){
        const index = vehicles.indexOf(vehicle);
        if(index !== -1){
            vehicles.splice(index,1);
            scene.remove(vehicle.mesh);
        }
    }
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
                grassMesh.receiveShadow = true;
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
                    buildings[x][y].castShadow = true;
                    buildings[x][y].receiveShadow = true;
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
        const ambientLight = new THREE.AmbientLight(0xffffff,0.35);
        scene.add(ambientLight);
        const sun = new THREE.DirectionalLight(0xffffff,0.8);
        sun.position.set(10,20,10);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;

        sun.shadow.camera.left = -30;
        sun.shadow.camera.right = 30;
        sun.shadow.camera.top = 30;
        sun.shadow.camera.bottom = -30;
        sun.shadow.camera.near = 1;
        sun.shadow.camera.far = 100;
        scene.add(sun);
        const helper = new THREE.CameraHelper(sun.shadow.camera);
        scene.add(helper);
    }
    function draw(){
        const dt = clock.getDelta();
        updateVehicles(dt);
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
    return {removeVehicle,addVehicle,onObjectSelected,update,start,stop,onMouseDown,onMouseUp,onMouseMove,initialize};
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

function updateVehicles(dt){
    for(const vehicle of vehicles){
        vehicle.update(dt);
    }
}