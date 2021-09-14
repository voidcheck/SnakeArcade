module Snake {
    export class Selection extends Phaser.Scene {

        lvlbg: any; home: any; left: any; right: any; evt: any; container: any; btn: any;
        lvl: any; star: any; timenumber: any; trgtnumber: any; starGrp: any; starArr:any;
        count: any; model: any; unlock: any;

        constructor(handle: any) {
            super(handle);
            this.starArr = [];
            this.unlock = true;
            this.model = Model.getInstance();
        }

        preload() {

            this.count = 0;
            this.cameras.main.setViewport(0, 0, 900, 640);
            this.load.image('levelbg', 'assets/level/bglevel.png');
            this.load.image('leveldetailbg', 'assets/level/leveldetail.png');
            this.load.image('titlelvl', 'assets/level/titlelvl.png');
            this.load.spritesheet('star', 'assets/level/level_star.png', {frameWidth: 44, frameHeight: 40});
            this.load.spritesheet('btnhome', 'assets/level/btn_home.png', {frameWidth: 62, frameHeight: 64});
            this.load.spritesheet('navleft', 'assets/level/navleft.png', {frameWidth: 50, frameHeight: 81});
            this.load.spritesheet('navright', 'assets/level/navright.png', {frameWidth: 50, frameHeight: 81});
            this.load.spritesheet('playsmall', 'assets/popups/play_small.png', {frameWidth: 59, frameHeight: 62});
        }

        create() {

            this.add.image(0, 0, 'levelbg' ).setOrigin(0);
            this.lvlbg = this.add.image(this.cameras.main.width/2, this.cameras.main.height/2, 'leveldetailbg' );
            this.add.image(this.cameras.main.width/2, this.cameras.main.height/2 - 250, 'titlelvl')

            this.home = this.add.sprite(this.cameras.main.width - 50, 50, 'btnhome').setInteractive();
            this.home.setFrame(0);
            this.home.on('pointerdown', () => this.homeDown() );
            this.home.on('pointerup', () => this.homeDown() );

            this.left = this.add.sprite(this.cameras.main.width/2 - 275, this.cameras.main.height/2, 'navleft').setInteractive();
            this.left.setFrame(0);
            this.left.on('pointerdown', () => this.leftDown() );
            this.left.on('pointerup', () => this.leftDown() );

            this.right = this.add.sprite(this.cameras.main.width/2 + 275, this.cameras.main.height/2, 'navright').setInteractive();
            this.right.setFrame(0);
            this.right.on('pointerdown', () => this.rightDown() );
            this.right.on('pointerup', () => this.rightDown() );

            if(this.count == 0) {
                this.left.setFrame(2);
            }

            this.model.currentLevelData = this.model.levelSelectionDetail[0];
            this.container = this.add.container(this.lvlbg.x - this.lvlbg.width/2, this.lvlbg.y - this.lvlbg.height/2);
            this.addLevels();
        }

        addLevels() {
            
            this.lvl = this.add.text(80, 60, this.model.levelSelectionDetail[0].detail.name, { fontSize: '30px', fontFamily: 'CarterOne' , fill: '#ffffff' }); //Bold'
            this.container.add(this.lvl);

            var x = 305;
            for(var k = 0; k < 3; k++) {
                
                this.star = this.add.sprite(x, 80, 'star').setInteractive();
                this.star.setFrame(1);
                this.container.add(this.star);
        
                x = x + 50;
                this.starArr.push(this.star);
            } 
            
            if(this.model.levelSelectionDetail[0].detail.star != 0) {
                for(var i = 0; i < this.model.levelSelectionDetail[0].detail.star; i++) {
                    this.starArr[i].setFrame(0);
                }
            } 
            
            var trgt = this.add.text(80, 175, 'Target', { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' });
            this.container.add(trgt);

            this.trgtnumber = this.add.text(300, 175, this.model.levelSelectionDetail[0].detail.target, { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' });
            this.container.add(this.trgtnumber);

            var time = this.add.text(80, 225, 'Time', { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' });
            this.container.add(time);

            this.timenumber = this.add.text(300, 225, this.model.levelSelectionDetail[0].detail.time + ' sec', { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' });
            this.container.add(this.timenumber);

            this.btn = this.add.sprite(this.lvlbg.width/2, this.lvlbg.height - 75, 'playsmall' ).setInteractive();
            this.btn.setFrame(0);
            this.btn.name = this.model.levelSelectionDetail[0].name;
            this.container.add(this.btn);
            this.btn.on('pointerdown', () => this.playBtnEvent() );
            this.btn.on('pointerup', () => this.playBtnEvent() );
            
        }

        playBtnEvent() {
            this.evt = event;
            
            if(this.unlock == true) {
                if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                    this.btn.setFrame(1);
                } else {
                    this.btn.setFrame(0);
                    this.events.emit('play',this.btn.name);
                }
            } else {
                console.log(this.unlock)
            }
        }

        homeDown() {

            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.home.setFrame(1);
            } else {
                this.home.setFrame(0);
                this.events.emit('play', 'home')
            }

        }

        leftDown() {

            if(this.count == 0) {
                this.left.setFrame(2);
            } else {

                this.evt = event;
                if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                    this.left.setFrame(1);
                } else {
                    this.left.setFrame(0);
                    this.count-- ;
                    this.getLevel();
                }
            }
        }

        rightDown() {

            if(this.count == this.model.levelSelectionDetail.length - 1) {
                this.right.setFrame(2);
            } else {

                this.evt = event;
                if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                    this.right.setFrame(1);
                } else {
                    this.right.setFrame(0);
                    this.count++ ;
                    this.getLevel();
                }
            }
            
        }

        getLevel() {
            
            if(this.count == this.model.levelSelectionDetail.length -1) {
                this.right.setFrame(2);
            } else {
                this.right.setFrame(0);
            }

            if(this.count == 0) {
                this.left.setFrame(2);
            } else {
                this.left.setFrame(0);
            }

            
            for(var k = 0; k < this.model.levelSelectionDetail.length; k++) {
                if(k == this.count) {
                    this.model.currentLevelData = this.model.levelSelectionDetail[k];
                }
            }
            this.lvlUpdate(this.model.currentLevelData);
        }

        lvlUpdate(data: any) {

            this.lvl.text = data.detail.name;
            this.trgtnumber.text = data.detail.target;
            this.timenumber.text = data.detail.time + ' sec';
            
            if(data.detail.star != 0) {
                for(var i = 0; i < data.detail.star; i++) {
                    console.log('detail star if ', data.detail.star);
                    this.starArr[i].setFrame(0);
                }
            } else {
                for(var i = 0; i < this.starArr.length; i++) {
                    console.log('detail star else ', data.detail.star);
                    this.starArr[i].setFrame(1);
                }
            }

            this.btn.name = data.name;
            if(data.lock == true) {
                this.unlock = false;
                this.btn.setFrame(1);
            } else {
                this.unlock = true;
                this.btn.setFrame(0);
            }
        }

        refreshLevels() {
            for(let k = 0; k < this.model.levelSelectionDetail.length; k++) {
                for(let i = 0; i < this.model.levelSelectionDetail[k].detail.star; i++) {
                    this.starArr[i].setFrame(0);
                }
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
