import * as THREE from "https://unpkg.com/three/build/three.module.js";
import { createCamera } from "./camera.js";
import { createAssetInstance } from "./assets.js";
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
                const grassMesh = createAssetInstance(terrainId,x,y);
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
                const currentBuildingId = buildings[x][y]?.userData.assetId;
                const newBuildingId = city.data[x][y].buildingId;
                //if player removes a building, remove it from scene
                if(!newBuildingId && currentBuildingId){
                    scene.remove(buildings[x][y]);
                    buildings[x][y] = undefined;
                }
                //update
                if(newBuildingId !== currentBuildingId){
                    if(buildings[x][y]){
                        scene.remove(buildings[x][y]);
                    }
                    const mesh = createAssetInstance(newBuildingId,x,y);
                    if(mesh){
                        scene.add(mesh);
                    }
                    buildings[x][y] = mesh;
                }
            }
        }
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
        const intersects = raycaster.intersectObjects(scene.children,false);
        if(intersects.length > 0){
            if(selectedObject){
                selectedObject.material.emissive.setHex(0x000000);
            }
            selectedObject = intersects[0].object;
            selectedObject.material.emissive.setHex(0x555555);
            console.log(`Selected object at (${selectedObject.userData.x},${selectedObject.userData.y}) with assetId ${selectedObject.userData.assetId}`);
            if(this.onObjectSelected){
                this.onObjectSelected(selectedObject);
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