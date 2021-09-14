module Snake {
    let globalVariable: any = 1;
    const _global = (window) as any;
    export class IntroPage extends Phaser.Scene {

        soundOn: any; soundOff: any; help: any; share: any; exit: any; play: any; evt: any; api: any; model: any;
        // start: any = 1;

        constructor(handle: any) {
            super(handle);
            this.model = Model.getInstance();
            this.api = new SnakeService();
        }

        preload() {
            this.cameras.main.setViewport(0, 0, 900, 640);

            this.load.image('mbg', 'assets/BGScreen.jpg');
            this.load.spritesheet('exit', 'assets/intro/btn_exit.png', {frameWidth: 62, frameHeight: 64});
            this.load.spritesheet('help', 'assets/intro/btn_help.png', {frameWidth: 62, frameHeight: 64});
            this.load.spritesheet('play', 'assets/intro/btn_playMenu.png', {frameWidth: 105, frameHeight: 108});
            this.load.spritesheet('share', 'assets/intro/btn_share.png', {frameWidth: 62, frameHeight: 64});
            this.load.spritesheet('soundon', 'assets/intro/btn_soundOff.png', {frameWidth: 62, frameHeight: 64});
            this.load.spritesheet('soundoff', 'assets/intro/btn_soundon.png', {frameWidth: 62, frameHeight: 64});
        }

        create() {

            this.add.image(0, 0, 'mbg' ).setOrigin(0);
            this.soundOn = this.add.sprite(this.cameras.main.width - 62, 64, 'soundon').setInteractive();
            this.soundOn.on('pointerdown', () => this.soundOnDown() );
            this.soundOn.on('pointerup', () => this.soundOnDown() );
            this.soundOn.setFrame(0)
            this.soundOn.visible = false;

            this.soundOff = this.add.sprite(this.cameras.main.width - 62, 64, 'soundoff').setInteractive();
            this.soundOff.on('pointerdown', () => this.soundOffDown() );
            this.soundOff.on('pointerup', () => this.soundOffDown() );
            this.soundOff.setFrame(0)
            this.soundOff.visible = false;

            this.help = this.add.sprite(this.cameras.main.width - 62, 140, 'help').setInteractive();
            this.help.on('pointerdown', () => this.helpDown() );
            this.help.on('pointerup', () => this.helpDown() );
            this.help.setFrame(0)
            this.help.visible = false;

            this.share = this.add.sprite(this.cameras.main.width - 62, 215, 'share').setInteractive();
            this.share.on('pointerdown', () => this.shareDown() );
            this.share.on('pointerup', () => this.shareDown() );
            this.share.setFrame(0)
            this.share.visible = false;

            this.exit = this.add.sprite(this.cameras.main.width - 62, 290, 'exit').setInteractive();
            this.exit.on('pointerdown', () => this.exitDown() );
            this.exit.on('pointerup', () => this.exitDown() );
            this.exit.setFrame(0)
            this.exit.visible = false;

            this.play = this.add.sprite(this.cameras.main.width/2, this.cameras.main.height/2 + 108, 'play').setInteractive();
            this.play.on('pointerdown', () => this.playDown() );
            this.play.on('pointerup', () => this.playDown() );
            this.play.setFrame(0)
        }

        soundOnDown() {
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.soundOn.setFrame(1);
            } else {
                this.soundOn.setFrame(0);
                this.soundOn.visible = false;
                this.soundOff.visible = true;
                // this.events.emit('side', 'pause');
            }
        }

        soundOffDown() {
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.soundOff.setFrame(1);
            } else {
                this.soundOff.setFrame(0);
                this.soundOn.visible = true;
                this.soundOff.visible = false;
                // this.events.emit('side', 'pause');
            }
        }

        shareDown() {
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.share.setFrame(1);
            } else {
                // this.share.setFrame(0);
                this.events.emit('side', 'pause');
            }
        }

        exitDown() {
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.exit.setFrame(1);
            } else {
                this.exit.setFrame(0);
                // this.events.emit('side', 'pause');
            }
        }

        helpDown() {
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.help.setFrame(1);
            } else {
                this.help.setFrame(0);
                // this.events.emit('side', 'pause');
            }
        }

        playDown() {

            if(globalVariable == 1) 
            {
                this.evt = event;
                if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                    this.play.setFrame(1);
                } else {
                    this.play.setFrame(0);
                    // this.hitPlayApi();
                    this.events.emit('intro', 'play');
                }
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
                                this.resetData(obj.data.data);
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
            this.events.emit('intro', 'play');
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