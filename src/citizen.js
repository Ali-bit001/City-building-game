import shortestPath from "./navigation.js";
import Vehicle from "./vehicle.js";
class Citizen{
    constructor(name,age,worksat,livesat,carmodel){
        this.name = name;
        this.age = age;
        this.worksat = worksat;
        this.livesat = livesat;
        this.athome = true;
        this.inTransit = false;
        this.stayTime = 0;
        this.carmodel = carmodel;
        this.vehicle = undefined;
        this.destination = undefined;
    }
    update(city,scene){
        if(this.athome){
            if(this.stayTime < 14){
                this.stayTime++;
                return;
            }
            this.startTrip(city,scene,[this.livesat.x,this.livesat.y],[this.worksat.x,this.worksat.y]);

        }
        else if(!this.inTransit){
            if(this.stayTime < 8){
                this.stayTime++;
                return;
            }
            this.startTrip(city,scene,[this.worksat.x,this.worksat.y],[this.livesat.x,this.livesat.y]);
        }
    }
    startTrip(city,scene,from,to){
        if(!from || !to || from[0] === undefined || from[1] === undefined || to[0] === undefined || to[1] === undefined){
            console.log("Bad trip coordinates", from, to);
            return;
        }
        const path = shortestPath(from,to,city);
        if(!path){
            console.log("No path found");
            return;
        }
        this.inTransit = true;

        this.athome = false;

        this.stayTime = 0;

        this.destination = to;
        const goingHome = (to[0] === this.livesat.x && to[1] === this.livesat.y);
        this.vehicle = new Vehicle(
            this,
            path,
            scene,
            ()=>{
                this.inTransit = false;
                this.stayTime = 0;
                if(goingHome){
                    this.athome = true;
                }
                else{
                    this.athome = false;
                }
                this.vehicle = undefined;
            }
        );

        scene.addVehicle(this.vehicle);
    }
}
export default Citizen;