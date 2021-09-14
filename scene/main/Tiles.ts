module Snake {
    export class Tiles{

        scene: any; level: any; body: any; xt = 24; yt = 12; block: any; lvlObj: any;

        constructor(scene: any, level: any ){
            this.level = level;
            this.scene = scene;
            this.lvlObj = new Levels();
        }

        create() {
           
            this.body = this.scene.add.group();
            for(var i = 0; i < this.lvlObj.levels.length; i++){
                
                if(this.lvlObj.levels[i].name == this.level) {
                    
                    if(this.lvlObj.levels[i].list.length != 0) {
                    
                        for(var j = 0; j < this.lvlObj.levels[i].list.length; j++) {
                        
                            for(var x = 0; x < this.xt; x ++) {
                                for(var y = 0; y < this.yt; y ++) {
                                    
                                    if(this.lvlObj.levels[i].list[j].type == "col") {                
                    
                                        if(x == this.lvlObj.levels[i].list[j].index.start.x ) {
                                            if(y >= this.lvlObj.levels[i].list[j].index.start.y && y <= this.lvlObj.levels[i].list[j].index.end.y) { 
                                                this.block = this.body.create(x*32, y*32, 'hurdle')
                                                this.block.setOrigin(0);
                                            }
                                        } 

                                    }

                                    if(this.lvlObj.levels[i].list[j].type == "row") {                
                    
                                        if(y == this.lvlObj.levels[i].list[j].index.start.y ) {
                                            if(x >= this.lvlObj.levels[i].list[j].index.start.x && x <= this.lvlObj.levels[i].list[j].index.end.x) { 
                                                this.block = this.body.create(x*32, y*32, 'hurdle')
                                                this.block.setOrigin(0);
                                            }
                                        } 
                                        
                                    }
                                }
                            }
                        
                        }
                    }
                    
                }
            
            }

                    
        }

        updateGrid(grid: any)
        {
            //  Remove all body pieces from valid positions list
            this.body.children.each(function (segment: any) {

                var bx = segment.x / 32;
                var by = segment.y / 32;

                grid[by][bx] = false;

            });

            return grid;
        }

    }
}