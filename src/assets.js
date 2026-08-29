import * as THREE from "https://unpkg.com/three/build/three.module.js";
const geometry = new THREE.BoxGeometry(1,1,1);
const assets = {
    'grass' : (x,y)=>{
        //grass geometry
        const material = new THREE.MeshLambertMaterial({color:0x00aa00});
        const mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(x,-0.5,y);
        mesh.userData = {assetId : "grass",x,y};
        return mesh;
    },
    'residential' : (x,y)=>{
        //residential building geometry
        const material = new THREE.MeshLambertMaterial({color : 0x00ff00});
        const mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(x,0.5,y);
        mesh.userData = {assetId : "residential",x,y};
        return mesh;

    },
    'industrial' : (x,y)=>{
        const material = new THREE.MeshLambertMaterial({color : 0x0000ff});
        const mesh = new THREE.Mesh(geometry,material);
        mesh.position.set(x,0.5,y);
        mesh.userData = {assetId : "industrial",x,y};
        return mesh;
    },
    'commercial' : (x,y)=>{
        const material = new THREE.MeshLambertMaterial({color : 0xffff00});
        const mesh = new THREE.Mesh(geometry,material);
        mesh.userData = {assetId : "commercial",x,y};
        mesh.position.set(x,0.5,y);
        return mesh;
    },
    'road' : (x,y)=>{
        const material = new THREE.MeshLambertMaterial({color : 0x444440});
        const mesh = new THREE.Mesh(geometry,material);
        mesh.userData = {assetId : "road",x,y};
        mesh.position.set(x,0.5,y);
        mesh.scale.set(1,0.1,1);
        return mesh;
    }
}

export function createAssetInstance(assetId,x,y){
    if(assetId in assets){
        return assets[assetId](x,y);
    }
    else{
        console.warn(`Asset Id ${assetId} is not found`);
        return undefined;
    }
}