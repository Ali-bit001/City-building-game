import {createAssetInstance} from "./assets.js";
export default class Vehicle{
    constructor(owner,path,scene,onArrive){
        this.owner = owner;
        this.path = path;
        this.currentIndex = 0;
        this.scene = scene;
        this.speed = 2;
        this.finished = false;
        this.onArrive = onArrive;
        this.mesh = createAssetInstance("vehicle",path[0][0],path[0][1],{owner : owner});
    }
    update(dt){
        if(this.finished)
            return;
        const target = this.path[this.currentIndex];
        const targetX = target[0];
        const targetY = target[1];
        const dx = targetX - this.mesh.position.x;
        const dy = targetY - this.mesh.position.z;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if(distance > 0.000001){
            this.mesh.rotation.y = Math.atan2(dy,dx) - Math.PI/2;
        }
        const movement = this.speed*dt;
        if(distance <= movement){
            this.mesh.position.x = targetX;
            this.mesh.position.z = targetY;
            this.currentIndex++;
            if(this.currentIndex >= this.path.length){
                this.finished = true;
                if(this.onArrive){
                    this.onArrive();
                }
                return;
            }
        }
        this.mesh.position.x += (dx / (distance + 0.000001)) * movement;
        this.mesh.position.z += (dy / (distance + 0.000001)) * movement;

    }
}