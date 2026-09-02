import Citizen from "./citizen.js";
export default{
    'residential': ()=>{
        return {
            id : 'residential',
            level : 1,
            powerConsumption : 1,
            waterConsumption : 1,
            updated : true,
            citizens : [],
            maxCitizens : 5,
            buildingId : undefined,
            update : function(availablePower,availableWater,availableCommercialBuildings,availableIndustrialBuildings){
                if(Math.random() < 0.1){
                    if(this.level < 3){
                        if(availablePower > 0 && availableWater > 0){
                            this.waterConsumption++;
                            this.powerConsumption++;
                            this.level++;
                            this.updated = true;
                            this.maxCitizens += 5;
                        }
                    }
                }
                if(this.citizens.length < this.maxCitizens && shouldSpawnCitizen() && (availableCommercialBuildings.size > 0 || availableIndustrialBuildings.size > 0)){
                    const work = availableCommercialBuildings.size > 0 ? availableCommercialBuildings.values().next().value : availableIndustrialBuildings.values().next().value;
                    const citizen = new Citizen(`Citizen ${Date.now()}`,Math.floor(Math.random() * 60) + 18,work, this,"sedan");
                    work.currentEmployees++;
                    this.citizens.push(citizen);
                    this.updated = true;
                }
            }
        }
    },
    'commercial': ()=>{
        return {
            id : 'commercial',
            powerConsumption : 1,
            waterConsumption : 1,
            level : 1,
            updated : true,
            buildingId : undefined,
            currentEmployees : 0,
            maxEmployees : 5,
            taxPaid : 0,
            update : function(availablePower,availableWater){
                this.taxPaid = this.currentEmployees * 5 + this.level * 10;
                if(Math.random() < 0.1){
                    if(this.level < 3 && availablePower > 0 && availableWater > 0){
                        this.powerConsumption++;
                        this.waterConsumption++;
                        this.level++;
                        this.updated = true;
                        this.maxEmployees += 5;
                    }
                }
            }
        }
    },
    'industrial': ()=>{
        return {
            id : 'industrial',
            powerConsumption : 1,
            waterConsumption : 1,
            level : 1,
            updated : true,
            buildingId : undefined,
            currentEmployees : 0,
            maxEmployees : 5,
            taxPaid : 0,
            update : function(availablePower,availableWater){
                this.taxPaid = this.currentEmployees * 5 + this.level * 10;
                if(Math.random() < 0.1){
                    if(this.level < 3 && availablePower > 0 && availableWater > 0){
                        this.level++;
                        this.powerConsumption++;
                        this.waterConsumption++;
                        this.updated = true;
                        this.maxEmployees += 5;
                    }
                }
            }
        }
    },
    'water': ()=>{
        return {
            id : 'water',
            buildingId : undefined,
            updated : true,
            maintenanceCost : 10,
            update : function(){
                this.updated = false;
            }
        }
    },
    'power': ()=>{
        return {
            id : 'power',
            updated : true,
            buildingId : undefined,
            maintenanceCost : 10,
            update : function(){
                this.updated = false;
            }
        }
    },
    'road': ()=>{
        return {
            id: 'road',
            updated : true,
            update : function(){
                this.updated = false;
            }
        }
    }
}
function shouldSpawnCitizen(){
    return Math.random() < 0.1;
}