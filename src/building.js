export default{
    'residential': ()=>{
        return {
            id : 'residential',
            level : 1,
            powerConsumption : 1,
            waterConsumption : 1,
            updated : true,
            update : function(){
                if(Math.random() < 0.1){
                    if(this.level < 3){
                        this.waterConsumption++;
                        this.powerConsumption++;
                        this.level++;
                        this.updated = true;
                    }
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
            update : function(){
                if(Math.random() < 0.1){
                    if(this.level < 3){
                        this.powerConsumption++;
                        this.waterConsumption++;
                        this.level++;
                        this.updated = true;
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
            update : function(){
                if(Math.random() < 0.1){
                    if(this.level < 3){
                        this.level++;
                        this.powerConsumption++;
                        this.waterConsumption++;
                        this.updated = true;
                    }
                }
            }
        }
    },
    'water': ()=>{
        return {
            id : 'water',
            updated : true,
            update : function(){
                this.updated = false;
            }
        }
    },
    'power': ()=>{
        return {
            id : 'power',
            updated : true,
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