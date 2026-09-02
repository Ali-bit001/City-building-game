import * as THREE from "https://unpkg.com/three/build/three.module.js";
import {GLTFLoader} from "https://unpkg.com/three/addons/loaders/GLTFLoader.js";
const geometry = new THREE.BoxGeometry(1,1,1);
const loader = new GLTFLoader();
const models = {
    residential : [],
    commercial : [],
    industrial : [],
    roads : [],
    water: [],
    power: [],
    vehicles: []
};
export async function loadAssets(){
    models.residential = [];
    models.commercial = [];
    models.industrial = [];
    models.roads = [];
    models.power = [];
    models.water = [];
    models.vehicles = [];

    const residential = [
        modelPaths("./public/residential/Models/GLTF format/house_type", 1, 6),
        modelPaths("./public/residential/Models/GLTF format/house_type", 7, 14),
        modelPaths("./public/residential/Models/GLTF format/house_type", 15, 21)
    ];
    const commercial = [
        letterModelPaths("./public/commercial/Models/GLB format/building-", "a", "f"),
        letterModelPaths("./public/commercial/Models/GLB format/building-", "g", "n"),
        letterModelPaths("./public/commercial/Models/GLB format/building-skyscraper-", "a", "e")
    ];
    const industrial = [
        letterModelPaths("./public/industrial/Models/GLB format/building-", "a", "f"),
        letterModelPaths("./public/industrial/Models/GLB format/building-", "g", "n"),
        letterModelPaths("./public/industrial/Models/GLB format/building-", "o", "t")
    ];
    const roadPath = "./public/roads/Models/GLB format/road-straight.glb";

    for(const [target, paths] of [
        [models.residential, residential],
        [models.commercial, commercial],
        [models.industrial, industrial]
    ]){
        for(const levelPaths of paths){
            target.push(await Promise.all(levelPaths.map(loadModel)));
        }
    }
    models.roads = [await loadModel(roadPath)];
    models.power = [await loadModel("./public/industrial/Models/GLB format/windmill.glb")];
    models.water = [await loadModel("./public/industrial/Models/GLB format/water-tower.glb")];
    models.vehicles = [await loadModel("./public/vehicles/Models/GLB format/sedan.glb")];
}
function modelPaths(prefix, first, last){
    return Array.from({length: last - first + 1}, (_, index) => {
        const number = String(first + index).padStart(2, "0");
        return `${prefix}${number}.glb`;
    });
}
function letterModelPaths(prefix, first, last){
    const firstCode = first.charCodeAt(0);
    const lastCode = last.charCodeAt(0);
    return Array.from({length: lastCode - firstCode + 1}, (_, index) =>
        `${prefix}${String.fromCharCode(firstCode + index)}.glb`
    );
}
function randomModel(modelList){
    return modelList[Math.floor(Math.random() * modelList.length)];
}
function loadModel(path){
    return new Promise((resolve,reject)=>{
        loader.load(path,(gltf)=>{
            gltf.scene.traverse((child)=>{
                if(child.isMesh){
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            const box = new THREE.Box3().setFromObject(gltf.scene);
            const size = new THREE.Vector3();
            box.getSize(size);
            gltf.scene.scale.x *= 1/size.x;
            gltf.scene.scale.z *= 1/size.z;
            resolve(gltf.scene);

        },undefined,(error)=>{
            console.log("Error loading model:",error);
            reject(error);
        })
    });
}
const assets = {
    'grass' : (x,y)=>{
        const material = new THREE.MeshLambertMaterial({color:0x00aa00});
        const mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(x,-0.5,y);
        mesh.userData = {
            assetId : "grass",
            x,y
        };
        return mesh;
    },
    'road' : (x,y)=>{
        const mesh = models.roads[0].clone();
        mesh.userData = {
            assetId : "road",
            x,y
        };
        mesh.position.set(x,0.05,y);
        mesh.scale.set(1,0.1,1);
        return mesh;
    },
    'residential' : (x,y,data)=>{
        const mesh = randomModel(models.residential[data.level - 1]).clone();
        mesh.userData = {
            assetId : "residential",
            x,y,powerConsumption : data.powerConsumption,
            waterConsumption : data.waterConsumption
        };
        mesh.position.set(x,0,y);
        return mesh;
    },
    'commercial' : (x,y,data)=>{
        const mesh = randomModel(models.commercial[data.level - 1]).clone();
        mesh.userData = {
            assetId : "commercial",
            x,y,powerConsumption : data.powerConsumption,
            waterConsumption : data.waterConsumption
        };
        mesh.position.set(x,0,y);
        return mesh;
    },
    'industrial' : (x,y,data)=>{
        const mesh = randomModel(models.industrial[data.level - 1]).clone();
        mesh.userData = {
            assetId : "industrial",
            x,y,powerConsumption : data.powerConsumption,
            waterConsumption : data.waterConsumption
        };
        mesh.position.set(x,0,y);
        return mesh;
    },
    'power' : (x,y,data)=>{
        const mesh = models.power[0].clone();
        mesh.userData = {
            assetId : "power",
            x,y,powerConsumption : data.powerConsumption,
            waterConsumption : data.waterConsumption
        };
        mesh.position.set(x,0,y);
        return mesh;
    },
    'water' : (x,y,data)=>{
        const mesh = models.water[0].clone();
        mesh.userData = {
            assetId : "water",
            x,y,powerConsumption : data.powerConsumption,
            waterConsumption : data.waterConsumption
        };
        mesh.position.set(x,0,y);
        return mesh;
    },
    'vehicle' : (x,y,data)=>{
        const mesh = randomModel(models.vehicles).clone();
        mesh.userData = {
            assetId : "vehicle",
            x,y,owner : data.owner
        };
        mesh.position.set(x,0.1,y);
        return mesh;
    }
}
export function createAssetInstance(assetId,x,y,data){
    if(assetId in assets){
        return assets[assetId](x,y,data);
    }
    console.warn(`Asset with id ${assetId} not found`);
    return undefined;
}