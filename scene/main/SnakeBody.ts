module Snake{
    export class SnakeBody {

        reptile: any; body: any; head: any; tail: any;
        alive = true; speed = 200; moveTime = 0;
        heading: any; direction: any; headPosition: any;
        UP = 0; DOWN = 1; LEFT = 2; RIGHT = 3; scene: any; model: any

        constructor( scene: any ) {

            this.model = Model.getInstance();
            this.scene = scene;

        }
        
        create() {

            this.headPosition = new Phaser.Geom.Point(this.model.currentLevelData.detail.snakex, this.model.currentLevelData.detail.snakey);

            this.reptile = this.scene.add.group();
            this.head = this.scene.add.sprite(this.model.currentLevelData.detail.snakex * 32, this.model.currentLevelData.detail.snakey * 32, 'head')
            this.head.setOrigin(0);
            this.head.setFrame(1);
            this.reptile.add(this.head);
            
            this.body = this.reptile.create(this.head.x, this.head.y, 'body')
            this.body.setOrigin(0);
            
            this.alive = true;

            this.speed = 200;

            this.moveTime = 0;
           
            this.tail = new Phaser.Geom.Point(this.model.currentLevelData.detail.snakex, this.model.currentLevelData.detail.snakey);

            this.heading = this.RIGHT;
            this.direction = this.RIGHT;
        }

        update(time: any, tiles: any) {
            
            if (time >= this.moveTime)
            {
                return this.move(time, tiles);
            }
        }

        move(time: any, tiles: any)
        {
            // console.log(time);
            /**
            * Based on the heading property (which is the direction the pgroup pressed)
            * we update the headPosition value accordingly.
            * 
            * The Math.wrap call allow the snake to wrap around the screen, so when
            * it goes off any of the sides it re-appears on the other.
            */
        //    console.log('the heading ',this.heading);
            switch (this.heading)
            {
                case this.LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 24);
                    // this.legs.setFrame(3);
                    break;

                case this.RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 24);
                    // this.legs.setFrame(1);
                    break;

                case this.UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 12);
                    // this.legs.setFrame(0);
                    break;

                case this.DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 12);
                    // this.legs.setFrame(2);
                    break;
            }

            this.direction = this.heading;
            
            //  Update the body segments and place the last coordinate into this.tail
            Phaser.Actions.ShiftPosition(this.reptile.getChildren(), this.headPosition.x * 32, this.headPosition.y * 32, 1, this.tail);
            // console.log(this.legs.x, this.legs.y)
            //  Check to see if any of the body pieces have the same x/y as the head
            //  If they do, the head ran into the body

            var hitBody = Phaser.Actions.GetFirst(this.reptile.getChildren(), { x: this.head.x, y: this.head.y }, 1);

            //check to see if snake hits the block
            // console.log('check to see if snake hits the block ',tiles.body.getChildren());
            // console.log('hit here ',Phaser.Actions.GetFirst(tiles.body.getChildren(), { x: this.head.x, y: this.head.y }, 1))
            var hitBlock = Phaser.Actions.GetFirst(tiles.body.getChildren(), { x: this.head.x, y: this.head.y }, 0);

            if (hitBody || hitBlock)
            {
                console.log('dead');

                this.alive = false;
                
                return false;
            }
            else
            {
                //  Update the timer ready for the next movement
                this.moveTime = time + this.speed;

                return true;
            }
        }

        faceLeft()
        {
            if (this.direction === this.UP || this.direction === this.DOWN)
            {
                this.heading = this.LEFT;
                this.head.setFrame(3);
            }
        }

        faceRight()
        {
            if (this.direction === this.UP || this.direction === this.DOWN)
            {
                this.heading = this.RIGHT;
                this.head.setFrame(1);
            }
        }

        faceUp()
        {
            if (this.direction === this.LEFT || this.direction === this.RIGHT)
            {
                this.heading = this.UP;
                this.head.setFrame(0);
            }
        }

        faceDown()
        {
            if (this.direction === this.LEFT || this.direction === this.RIGHT)
            {
                this.heading = this.DOWN;
                this.head.setFrame(2);
            }
        }

        
        grow()
        {
            // this.legs.destroy();
            var newPart = this.reptile.create(this.body.x, this.body.y, 'body');
            newPart.setOrigin(0);

            // this.legs = this.reptile.create(this.body.x, this.body.y, 'tail');
            // this.legs.setOrigin(0);
        }

        collideWithFood(food: any)
        {
            if (this.head.x === food.food.x && this.head.y === food.food.y)
            {
                this.grow();

                food.eat();

                //  For every 5 items of food eaten we'll increase the snake speed a little
                if (this.speed > 20 && food.total % 5 === 0)
                {
                    this.speed -= 5;
                }

                return true;
            }
            else
            {
                return false;
            }
        }

        // collideWithBlock(tile: any) {
        //     var hitBody = Phaser.Actions.GetFirst(tile.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);

        //     if (hitBody)
        //     {
        //         console.log('dead');

        //         this.alive = false;

        //         return false;
        //     }
        //     else 
        //     {
        //         return true;
        //     }
        // }

        updateGrid(grid: any)
        {
            //  Remove all body pieces from valid positions list
            this.reptile.children.each(function (segment: any) {

                var bx = segment.x / 32;
                var by = segment.y / 32;

                grid[by][bx] = false;

            });

            return grid;
        }
    }
}