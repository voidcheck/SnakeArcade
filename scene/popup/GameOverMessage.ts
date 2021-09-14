module Snake {
    const _global = (window) as any;
    export class GameOverMessage extends Phaser.Scene {
        msgBox: any; box: any; restart: any; home: any; evt: any;
        target: any; score: any; model: any;

        constructor(handle: any) {
            super(handle) //"GameOverMessage"
            this.model = Model.getInstance();
        }

        preload() {
            this.load.image('bg', 'assets/popups/overlay.png');            
            this.load.image('msgBox', 'assets/popups/bg_popup_large.png');
            this.load.spritesheet('restart', 'assets/popups/replay.png',{ frameWidth: 59, frameHeight: 62 });
            this.load.spritesheet('Home', 'assets/popups/home.png',{ frameWidth: 59, frameHeight: 62 });
        }

        create() {
            this.cameras.main.setViewport(0, 0, 900, 640);

            this.msgBox = this.add.group();

            var overlay = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'bg');
            this.msgBox.add(overlay);

            this.box = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'msgBox')
            this.msgBox.add(this.box);
            
            var heading = this.add.text(this.cameras.main.width/2, this.box.y - 130, "GAME OVER", { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(heading);

            var tar = this.add.text(this.cameras.main.width/2 - 75, this.cameras.main.height/2 - 50, "Target", { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(tar);

       
            this.target = this.add.text(this.cameras.main.width/2 + 65, this.cameras.main.height/2 - 50, this.model.currentTarget+" / "+this.model.currentLevelData.detail.target, { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(this.target);
            
            var scr = this.add.text(this.cameras.main.width/2 - 75, this.cameras.main.height/2 , "Score", { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(scr);

            this.score = this.add.text(this.cameras.main.width/2 + 65, this.cameras.main.height/2, this.model.currentScore, { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(this.score);

            this.home = this.add.sprite(this.cameras.main.width/2 - 59, this.cameras.main.height/2 + 93, 'Home').setInteractive();
            this.home.setFrame(0);
            this.home.on('pointerdown', () => this.homeEvents() ); 
            this.home.on('pointerup', () => this.homeEvents() );
            this.msgBox.add(this.home);

            this.restart = this.add.sprite(this.cameras.main.width/2 + 59, this.cameras.main.height/2 + 93, 'restart').setInteractive();
            this.restart.setFrame(0);
            this.restart.on('pointerdown', () => this.restartEvents() );
            this.restart.on('pointerup', () => this.restartEvents() );
            this.msgBox.add(this.restart);
            
        }

        updateText() {

           if(this.model.currentTarget <= this.model.currentLevelData.detail.target) {
                this.target.text = this.model.currentTarget + " / " + this.model.currentLevelData.detail.target
            } else {
                this.target.text = this.model.currentLevelData.detail.target + " / " + this.model.currentLevelData.detail.target
            }
            this.score.text = this.model.currentScore;

        }

        homeEvents() {
            
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.home.setFrame(1);
            } else {
                this.home.setFrame(0);
                this.events.emit('gameover', 'home');
            }
            
        }
        
        restartEvents() {
            
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.restart.setFrame(1);
            } else {
                this.restart.setFrame(0);
                this.hitPlayApi();
                // this.events.emit('gameover', 'restart');
            }
        }

        callFunc() {
            _global.callcheck();
        }

        hitPlayApi() {
            
            let self = this;
            let request = new XMLHttpRequest();
            let data: any = {
                "accessToken":this.model.accessToken,
                "game_id":this.model.id
                }
                
                    request.open("POST",'http://paarcade.com/api/user_game_scores/gameStart/', true)
                    request.setRequestHeader("Content-type", "application/json");
                    request.onreadystatechange = () => {
                        if (request.readyState == 4 && request.status == 200) {

                            let obj = JSON.parse(request.response);
                            if(obj.data.status == 1) {
                                this.callFunc();
                                this.events.emit('gameover', 'restart');
                            } else {
                                console.log('not allowed ');
                            }
                        }
                    };
                    request.send(JSON.stringify(data));
        }
        
        resetData(obj: any) {
            if(obj != null )
            {
                this.model.gameId = obj.gameId;
                this.model.userId = obj.user_id;
                let level = obj.level.replace(/\,/g,"");
                let star = obj.star.replace(/\,/g,"");
                for(let i = 0; i< level.length; i++) {
                    console.log('numbercheck ', level[i])
                    if(level[i] == this.model.levelSelectionDetail[i].name){
                        this.model.levelSelectionDetail[i].detail.star = star[i];
                        if(star[i] != 0) {
                            this.model.levelSelectionDetail[i+1].lock = false;
                        }
                    }
                }
            }
            this.events.emit('pause', 'restart');
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