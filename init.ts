module Snake{
    declare var globalVariable: any;
    export class InitPhaser {
        static gameRef:Phaser.Game;
        start = 1
        public static initGame() {

            let config = {
                type: Phaser.AUTO,
                scale: {
                    mode: Phaser.Scale.FIT,
                    autoCenter: Phaser.Scale.CENTER_BOTH,
                    width: 900,
                    height: 640,
                },
                physics: {
                    default: 'arcade',
                },
                scene: [Background],
                backgroundColor: '#000000',
                banner: true,
                title: 'Snake',
                parent: 'game'
            }
            this.gameRef = new Phaser.Game(config);
            // this.gameRef.scale.pageAlignHorizontally = true;
            // game.scale.pageAlignVertically = true;
            // game.scale.refresh();
    
            // //stop game from pausing when browser is minimized
            // game.stage.disableVisibilityChange = false;
    
            // // Maintain aspect ratio with a minimum and maximum value
            // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // game.scale.setMinMax( 300, 200, 1000, 625 );
        }
    }
}
window.onload = () => {
    
    Snake.InitPhaser.initGame();
};