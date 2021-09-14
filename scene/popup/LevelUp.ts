module Snake {
    export class LevelUp extends Phaser.Scene {

        model: any; msgBox: any; box: any; next: any; home: any; evt: any;
        target: any; score: any; levelStar: any; star: any;

        constructor (handle: any) {

            super(handle);
            this.model = Model.getInstance();

        }

        preload() {

            this.load.image('lvlbg', 'assets/popups/overlay.png');            
            this.load.image('box', 'assets/popups/bg_popup_large.png');
            this.load.spritesheet('next', 'assets/popups/next.png',{ frameWidth: 59, frameHeight: 62 });
            this.load.spritesheet('villa', 'assets/popups/home.png',{ frameWidth: 59, frameHeight: 62 });
            this.load.spritesheet('lvlstars', 'assets/popups/level.png', { frameWidth: 175, frameHeight: 58 });

        }

        create() {

            this.cameras.main.setViewport(0, 0, 900, 640);

            this.msgBox = this.add.group();

            var overlay = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'lvlbg');
            this.msgBox.add(overlay);

            this.box = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'box')
            this.msgBox.add(this.box);
            
            this.levelStar = this.add.image(this.cameras.main.width/2, this.box.y - 175, 'lvlstars');
            this.levelStar.setFrame(0);

            var heading = this.add.text(this.cameras.main.width/2, this.box.y - 130, "LEVEL UP", { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(heading);

            var tar = this.add.text(this.cameras.main.width/2 - 75, this.cameras.main.height/2 - 50, "Target", { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(tar);

            this.target = this.add.text(this.cameras.main.width/2 + 65, this.cameras.main.height/2 - 50, this.model.currentTarget  + " / " + this.model.currentLevelData.detail.target, { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(this.target);
            
            var scr = this.add.text(this.cameras.main.width/2 - 75, this.cameras.main.height/2 , "Score", { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(scr);

            this.score = this.add.text(this.cameras.main.width/2 + 65, this.cameras.main.height/2, this.model.currentScore, { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(this.score);

            this.home = this.add.sprite(this.cameras.main.width/2 - 59, this.cameras.main.height/2 + 93, 'villa').setInteractive();
            this.home.setFrame(0);
            this.home.on('pointerdown', () => this.homeEvents() );
            this.home.on('pointerup', () => this.homeEvents() );
            this.msgBox.add(this.home);

            this.next = this.add.sprite(this.cameras.main.width/2 + 59, this.cameras.main.height/2 + 93, 'next').setInteractive();
            this.next.setFrame(0);
            this.next.on('pointerdown', () => this.nextEvents() );
            this.next.on('pointerup', () => this.nextEvents() );
            this.msgBox.add(this.next);
            
        }

        updateText() {

            if(this.model.currentTarget <= this.model.currentLevelData.detail.target) {
                this.target.text = this.model.currentTarget + " / " + this.model.currentLevelData.detail.target
            } else {
                this.target.text = this.model.currentLevelData.detail.target + " / " + this.model.currentLevelData.detail.target
            }
            this.score.text = this.model.currentScore;
            if(this.model.currentTarget >= this.model.currentLevelData.detail.target) {
                this.levelStar.setFrame(2); this.star = 3;
                for(var k = 0; k < this.model.levelSelectionDetail.length; k++) {
                    if(this.model.currentLevelData.name == this.model.levelSelectionDetail[k].name) { 
                        this.model.levelSelectionDetail[k].detail.star = this.star;
                        if(k != this.model.levelSelectionDetail.length - 1) {
                            this.model.levelSelectionDetail[k+1].lock = false;
                        }
                    } else {
    
                    }
                }
            } else if(this.model.currentTarget > this.model.currentLevelData.detail.target/2 && this.model.currentTarget <= this.model.currentLevelData.detail.target/1.5) {
                this.levelStar.setFrame(1); this.star = 2;
            } else {
                this.levelStar.setFrame(0); this.star = 1;
            }
            
        }
        
        homeEvents() {
            
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.home.setFrame(1);
            } else {
                this.home.setFrame(0);
                this.events.emit('levelup', 'home');
            }
            
        }
        
        nextEvents() {
            
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.next.setFrame(1);
            } else {
                this.next.setFrame(0);
                this.events.emit('levelup', 'next');
            }
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