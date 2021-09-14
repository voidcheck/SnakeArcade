module Snake {
    const _global = (window) as any;
    export class PauseMessage extends Phaser.Scene {

        scene: any; evt: any; msgBox: any; box: any; restart: any; home: any; play: any; model: any;
        
        constructor(handle: any) {
            super(handle);
            this.model = Model.getInstance();
        }

        preload() {
            
            this.load.image('overlay', 'assets/popups/overlay.png');
            this.load.image('msgbox', 'assets/popups/bg_pause.png');
            this.load.spritesheet('replay', 'assets/popups/replay.png',{ frameWidth: 59, frameHeight: 62 });
            this.load.spritesheet('home', 'assets/popups/home.png',{ frameWidth: 59, frameHeight: 62 });
            this.load.spritesheet('playlarge', 'assets/popups/play_large.png',{ frameWidth: 77, frameHeight: 80 });
            
        }

        create() {

            this.cameras.main.setViewport(0, 0, 900, 640);

            this.msgBox = this.add.group();

            var overlay = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'overlay');
            this.msgBox.add(overlay);

            this.box = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'msgbox')
            this.msgBox.add(this.box);
            
            var heading = this.add.text(this.cameras.main.width/2, this.box.y - 80, "PAUSE", { fontSize: '30px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(heading);

            this.home = this.add.sprite(this.cameras.main.width/2 - 89, this.cameras.main.height/2 + 31, 'home').setInteractive();
            this.home.setFrame(0);
            this.home.on('pointerdown', () => this.homeEvents() );
            this.home.on('pointerup', () => this.homeEvents() );
            this.msgBox.add(this.home);

            this.play = this.add.sprite(this.cameras.main.width/2, this.cameras.main.height/2 + 31, 'playlarge').setInteractive();
            this.play.setFrame(0);
            this.play.on('pointerdown', () => this.playEvents() );
            this.play.on('pointerup', () => this.playEvents() );
            this.msgBox.add(this.play);

            this.restart = this.add.sprite(this.cameras.main.width/2 + 89, this.cameras.main.height/2 + 31, 'replay').setInteractive();
            this.restart.setFrame(0);
            this.restart.on('pointerdown', () => this.restartEvents() );
            this.restart.on('pointerup', () => this.restartEvents() );
            this.msgBox.add(this.restart);
            
        }

        homeEvents() {
            
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.home.setFrame(1);
            } else {
                this.home.setFrame(0);
                this.events.emit('pause', 'home');
            }
            
        }
        
        playEvents() {
            
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.play.setFrame(1);
            } else {
                this.play.setFrame(0);
                this.events.emit('pause', 'play');
            }
            
        }

        restartEvents() {
            
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.restart.setFrame(1);
            } else {
                this.restart.setFrame(0);
                this.hitPlayApi();
                // this.events.emit('pause', 'restart');
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
                                this.events.emit('pause', 'restart');
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