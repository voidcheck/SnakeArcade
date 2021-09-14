module Snake {
    const _global = (window) as any;
    export class Game extends Phaser.Scene{
        alive = true; speed = 50; moveTime = 0;
        heading: any; direction: any; headPosition: any;
        snake: any; food: any; tiles: any; cursors: any; msgBox: any;
        testGrid: any[] = []; target = 0; score = 0; pause = false; model: any; addition: any = 1; scorescene: any;
        
        constructor(handle: any) {
            super(handle)
            this.model = Model.getInstance();
        }

        preload() {
            
            this.load.spritesheet('head','assets/head.png',{ frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('tail','assets/tail.png',{ frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('food','assets/food.png',{ frameWidth: 32, frameHeight: 32 });
            this.load.image('body','assets/body.png');
            this.load.image('hurdle','assets/hurdle.png');
            
        }

        create() {
            
            this.target = 0; 
            this.score = 0; 
            this.addition = this.model.currentLevelData.add;
            this.cameras.main.setViewport(65.5, 93.5, 768, 384);
            this.pause = false;
            this.tiles = new Tiles(this, this.model.currentLevelData.name);
            this.tiles.create();
            this.food = new Food(this)
            this.food.create();
            this.snake = new SnakeBody(this);
            this.snake.create();
            this.cursors = this.input.keyboard.createCursorKeys();
            
        }

        startTimer() {
            this.events.emit('gameevent', 'start');
        }

        update(time: any) {
            
            if(!this.pause) {
                if (!this.snake.alive)
                {
                    return;
                }

                /**
                * Check which key is pressed, and then change the direction the snake
                * is heading based on that. The checks ensure you don't double-back
                * on yourself, for example if you're moving to the right and you press
                * the LEFT cursor, it ignores it, because the only valid directions you
                * can move in at that time is up and down.
                */
                if (this.cursors.left.isDown)
                {
                    this.snake.faceLeft();
                }
                else if (this.cursors.right.isDown)
                {
                    this.snake.faceRight();
                }
                else if (this.cursors.up.isDown)
                {
                    this.snake.faceUp();
                }
                else if (this.cursors.down.isDown)
                {
                    this.snake.faceDown();
                }
                
                if (this.snake.update(time, this.tiles))
                {   
                    //  If the snake updated, we need to check for collision against food
                    if( this.model.currentTarget == this.model.currentLevelData.detail.target) {
                        this.snake.alive = false;
                        // this.events.emit('gameevent', 'levelup');
                    }
                     else if (this.snake.collideWithFood(this.food))
                    {
                        this.repositionFood();
                        this.score = this.score + this.addition;
                        this.target++;
                        this.events.emit('gameevent', {name:'score', num: this.score, target: this.target});
                    }
                } 
                if(this.snake.alive == false) {
                    this.callGameEvent();
                }
            }
        }

        
        callScore() {
            _global.callScore();
        }
        callGameEvent() {
            
            if( this.model.currentTarget >= this.model.currentLevelData.detail.target) {
                this.events.emit('gameevent', 'levelup');
            } else {
                // this.callScore();
                this.events.emit('gameevent', 'gameover');
            }

        }

        repositionFood ()
        {
            //  First create an array that assumes all positions
            //  are valid for the new piece of food

            //  A Grid we'll use to reposition the food each time it's eaten
            this.testGrid = [];

            for (var y = 0; y < 12; y++)
            {
                this.testGrid[y] = [];
                
                for (var x = 0; x < 24; x++)
                {
                    this.testGrid[y][x] = true;
                }
            }

            this.tiles.updateGrid(this.testGrid);
            this.snake.updateGrid(this.testGrid);
            //  Purge out false positions
            var validLocations = [];

            for (var y = 0; y < 12; y++)
            {
                for (var x = 0; x < 24; x++)
                {
                    if (this.testGrid[y][x] === true)
                    {
                        //  Is this position valid for food? If so, add it here ...
                        validLocations.push({ x: x, y: y });
                    }
                }
            }

            if (validLocations.length > 0)
            {
                //  Use the RND to pick a random food position
                var pos = Phaser.Math.RND.pick(validLocations);
                
                //  And place it
                this.food.changePosition(pos.x * 32, pos.y * 32);
                
                return true;
            }
            else
            {
                return false;
            }

        }

        restartGame() {
            
            this.scene.restart();
        }

        destroy() {
            this.events.destroy();

            this.sys.shutdown();

            if(this.time) {
                this.time.clearPendingEvents().removeAllEvents();
            }

            this.tweens.destroy();

            this.scene.remove(this);
        }
    }  
}