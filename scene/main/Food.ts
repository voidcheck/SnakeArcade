module Snake {
    export class Food {

        scene: any; total: any; food: any; model: any;

        constructor(scene: any) {
            this.model = Model.getInstance();
            this.scene = scene;
        }

        create() {

            this.food = this.scene.add.sprite(this.model.currentLevelData.detail.foodx, this.model.currentLevelData.detail.foody, 'food');
            this.food.setPosition(this.model.currentLevelData.detail.foodx * 32, this.model.currentLevelData.detail.foody * 32);
            this.food.setOrigin(0);
            this.food.setFrame(0);

            this.total = 0;
        }

        eat() {
            this.total++;
        }

        changePosition(x: any, y: any) {
            
            this.food.setFrame(Phaser.Math.RND.integerInRange(0,5));
            this.food.setPosition(x, y);
        }
    }
}