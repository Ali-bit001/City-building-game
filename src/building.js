export default{
    'residential': ()=>{
        return {
            id : 'residential',
            level : 1,
            updated : true,
            update : function(){
                if(Math.random() < 0.1){
                    if(this.level < 3){
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
            level : 1,
            updated : true,
            update : function(){
                if(Math.random() < 0.1){
                    if(this.level < 3){
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
            level : 1,
            updated : true,
            update : function(){
                if(Math.random() < 0.1){
                    if(this.level < 3){
                        this.level++;
                        this.updated = true;
                    }
                }
            }
        }
    },
    'road': ()=>{
        return {
            id: 'road',
            updated : true,
            update : ()=>{
                this.updated = false;
            }
        }
    }
}