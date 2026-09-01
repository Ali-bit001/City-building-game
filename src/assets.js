import * as THREE from "https://unpkg.com/three/build/three.module.js";
import {GLTFLoader} from "https://unpkg.com/three/addons/loaders/GLTFLoader.js";
const geometry = new THREE.BoxGeometry(1,1,1);
const loader = new GLTFLoader();
const models = {
    residential : [],
    commercial : [],
    industrial : [],
    water: [],
    power: [],
    vehicles: []
};
export async function loadAssets(){
    const residential = {        
        'level1': ()=>{
            let num = Math.floor(Math.random() * 6 % 6 + 1);
            let temp = `0${num}`;
            return `./public/residential/Models/GLTF format/house_type${temp}.glb`;
        },
        'level2': ()=>{
            let num = Math.floor(Math.random() * 11 % 11 + 6);
            let temp = '0';
            if(num >= 10)
                temp = `${num}`;
            else
                temp = `0${num}`;
            return `./public/residential/Models/GLTF format/house_type${temp}.glb`;
        },
        'level3': ()=>{
            let num = Math.floor(Math.random() * 11 % 11 + 11);
            let temp = '0';
            if(num >= 10)
                temp = `${num}`;
            else
                temp = `0${num}`;
            return `./public/residential/Models/GLTF format/house_type${temp}.glb`;
        }
    };
    const commercial = {
        'level1': ()=>{
            let num = Math.random() * 6 % 6 + 1;
            let temp = `0${num}`;
            return `./public/commercial/Models/GLB format/building-a.glb`;
        },
        'level2': ()=>{
            let num = Math.random() * 11 % 11 + 6;
            let temp = '0';
            if(num >= 10)
                temp = `${num}`;
            else
                temp = `0${num}`;
            return `./public/commercial/Models/GLB format/building-g.glb`;
        },
        'level3': ()=>{
            let num = Math.random() * 11 % 11 + 16;
            let temp = '0';
            if(num >= 10)
                temp = `${num}`;
            else
                temp = `0${num}`;
            return `./public/commercial/Models/GLB format/building-skyscraper-a.glb`;
        }
    };
    const industrial = {
        'level1': ()=>{
            let num = Math.random() * 6 % 6 + 1;
            let temp = `0${num}`;
            return `./public/industrial/Models/GLB format/building-a.glb`;
        },
        'level2': ()=>{
            let num = Math.random() * 11 % 11 + 6;
            let temp = '0';
            if(num >= 10)
                temp = `${num}`;
            else
                temp = `0${num}`;
            return `./public/industrial/Models/GLB format/building-g.glb`;
        },
        'level3': ()=>{
            let num = Math.random() * 11 % 11 + 16;
            let temp = '0';
            if(num >= 10)
                temp = `${num}`;
            else
                temp = `0${num}`;
            return `./public/industrial/Models/GLB format/building-t.glb`;
        }
    }
    for(let i = 1;i <= 3;++i){
        models.residential.push(await loadModel(residential[`level${i}`]()));
        models.commercial.push(await loadModel(commercial[`level${i}`]()));
        models.industrial.push(await loadModel(industrial[`level${i}`]()));
        models.power.push(await loadModel("./public/industrial/Models/GLB format/windmill.glb"));
        models.water.push(await loadModel("./public/industrial/Models/GLB format/water-tower.glb"));
        models.vehicles.push(await loadModel("./public/vehicles/Models/GLB format/sedan.glb"));
    }
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
        const material = new THREE.MeshLambertMaterial({color:0x444400});
        const mesh = new THREE.Mesh(geometry,material);
        mesh.userData = {
            assetId : "road",
            x,y
        };
        mesh.position.set(x,0.05,y);
        mesh.scale.set(1,0.1,1);
        return mesh;
    },
    'residential' : (x,y,data)=>{
        const mesh = models.residential[data.level - 1].clone();
        mesh.userData = {
            assetId : "residential",
            x,y,powerConsumption : data.powerConsumption,
            waterConsumption : data.waterConsumption
        };
        mesh.position.set(x,0,y);
        return mesh;
    },
    'commercial' : (x,y,data)=>{
        const mesh = models.commercial[data.level - 1].clone();
        mesh.userData = {
            assetId : "commercial",
            x,y,powerConsumption : data.powerConsumption,
            waterConsumption : data.waterConsumption
        };
        mesh.position.set(x,0,y);
        return mesh;
    },
    'industrial' : (x,y,data)=>{
        const mesh = models.industrial[data.level - 1].clone();
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
        const mesh = models.vehicles[0].clone();
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