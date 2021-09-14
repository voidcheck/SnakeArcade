module Snake {
    export class Playground extends Phaser.Scene {
        body: any; groundBlock: any; model: any;  api: any;
        game: any; score: any; control: any; gameOverMsg: any; pauseMessage: any; levelUp: any;
        
        constructor(handle: any){
            super(handle)
            this.model = Model.getInstance();
            this.api = new SnakeService();
        }

        preload() {
            
            this.load.image('ground', 'assets/tile.png');
        }

        create() {
            
            this.cameras.main.setViewport(65.5, 93.5, 768, 384);
            this.body = this.add.group();
            for(var x = 0; x < 24; x++) {
                for(var y = 0; y < 12; y++) {
                    this.groundBlock = this.body.create(x*32, y*32, 'ground');
                    this.groundBlock.setOrigin(0);
                }
            }
            
            this.loadScores();
            this.loadController();
            this.levelUpMsg();
            this.createGameOverMsg();
            this.createMsg();
            
        }

        // adding the game scene
        loadGame() {
            let key = "Game";
            this.game = new Game(key);
            this.scene.add(key, this.game, true);
            this.game.events.on('gameevent', this.gameEvents, this);
            
        }

        gameEvents(this: Playground, data: any) {
            console.log(data)
            if( data == 'gameover' ) {

                this.score.timerPause(true);
                this.scene.wake("GameOverMessage");
                this.scene.bringToTop("GameOverMessage");
                this.gameOverMsg.updateText();
                // this.hitapi();

            }

            if( data == 'start' ) {
                console.log(data);
                this.score.timerStart();
            }

            if( data.name == 'score' ) {
                this.score.scoreUpdate( data.num, data.target );   
            }

            if( data == 'levelup' ) {
                this.scene.wake("LevelUp");
                this.scene.bringToTop("LevelUp");
                this.levelUp.updateText();
                // this.hitapi();
            }
        }

        // adding the scores scene 
        loadScores() {
            let key = "Scores";
            this.score = new Scores(key);
            this.scene.add(key, this.score, true);
            this.score.events.on('finish', this.scoreEvents, this);
            this.loadGame();
        }

        scoreEvents(this: Playground, data: any) {
            if(data == 'timeFinish') {
                this.score.gameTimer.paused = true;
                this.game.snake.alive = false;
                this.game.callGameEvent();
            }
        }

        // add controls to the screen
        loadController() {
            let key = "Controller";
            this.control = new Controller(key);
            this.scene.add(key, this.control, true);
            this.control.events.on('side', this.controlerEvent, this)
        }

        controlerEvent(this: Playground, data: any) {
            
            if(data == 'right') {
                this.game.snake.faceRight();  
            }
            if(data == 'left') {
                this.game.snake.faceLeft();  
            }
            if(data == 'up') {
                this.game.snake.faceUp();  
            }
            if(data == 'down') {
                this.game.snake.faceDown();  
            }
            if(data == "pause") {
                this.score.timerPause(true);
                this.game.pause = true;
                this.scene.wake("PauseMessage");
                this.scene.bringToTop("PauseMessage");
            } 
            if(data == 'restart') {
                this.score.reloadScore();
                this.game.restartGame();
            }

        }
        
        // adding game over message box to scene
        createGameOverMsg() {
            let key = "GameOverMessage"
            this.gameOverMsg = new GameOverMessage(key);
            this.scene.add(key, this.gameOverMsg, true);
            this.gameOverMsg.events.on('gameover', this.gameOverMessageEvents, this);
            this.scene.sleep(key);
        }

        gameOverMessageEvents(this: Playground, data: any) {
            
            if(data == "restart") {
                this.score.reloadScore();
                this.game.restartGame();
            }
            if(data == "home") {
                this.removeAllScenes();
                
            }
            this.scene.sleep("GameOverMessage");
        }

        // adding pause message box to scene
        createMsg() {
            let key = "PauseMessage"
            this.pauseMessage = new PauseMessage(key);
            this.scene.add(key, this.pauseMessage, true);
            this.pauseMessage.events.on('pause', this.pauseMessageEvents, this);
            this.scene.sleep('PauseMessage');
        }

        pauseMessageEvents(this: Playground, data: any) {
            
            if(data == 'play') {
                this.score.timerPause(false);
                this.game.pause = false;
            }
            if(data == 'home') {
                this.removeAllScenes();
            }
            if(data == 'restart') {
                this.score.reloadScore();
                this.game.restartGame();
            }
            this.scene.sleep("PauseMessage");
        }
        
        // add level up message
        levelUpMsg() {
            let key = 'LevelUp';
            this.levelUp = new LevelUp(key);
            this.scene.add(key, this.levelUp, true);
            this.levelUp.events.on('levelup', this.levelUpEvents, this);
            this.scene.sleep(key);
        }

        levelUpEvents(this: Playground, data: any) {
            
            if( data == 'home' ) {
                this.removeAllScenes();
            }
            if( data == 'next' ) {
                this.scene.sleep('LevelUp');
                this.loadNextLevel();
            }
        }

        removeAllScenes() {
            this.model.currentTarget = 0;
            this.model.currentScore = 0;
            this.game.destroy();
            this.game = null;
            this.score.destroy();
            this.score = null;
            this.control.destroy();
            this.control = null;
            this.gameOverMsg.destroy();
            this.gameOverMsg = null;
            this.pauseMessage.destroy();
            this.pauseMessage = null;
            this.levelUp.destroy();
            this.levelUp = null;
            this.events.emit('playground', 'home');
        }

        loadNextLevel() {
            
            for(var k = 0; k < this.model.levelSelectionDetail.length; k++) {
                if(this.model.levelSelectionDetail[k].name == this.model.currentLevelData.name) {
                    this.model.currentLevelData = this.model.levelSelectionDetail[ k + 1 ];
                    this.score.reloadScore();
                    this.game.restartGame();
                    break;
                }
            }

        }

        restartPlayground() {
            this.scene.restart();
        }

        hitapi() {
            console.log('gameid is ', this.model.id)
            this.api.updateHighScore(this.model.currentScore, this.model.id, this.model.accessToken);
        }

        destroy() {

            this.events.destroy();

            this.sys.shutdown();

            if(this.time) {
                this.time.clearPendingEvents().removeAllEvents();
            }

            // this.sys.displayList.each(o => o.destroy(true));

            // this.sys.displayList.destroy();
            // this.sys.updateList.destroy();
            this.tweens.destroy();

            this.scene.remove(this);
        }

    }
}