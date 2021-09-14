module Snake {
    export class Controller extends Phaser.Scene {
        pause: any; left: any; right: any; up: any; down: any; 
        evt: any; log: any; msg: any;
        constructor(handle: any) {
            super(handle);
        }

        preload() {

            this.cameras.main.setViewport(0, 0, 900, 640);
            this.load.spritesheet('pause','assets/pause.png',{ frameWidth: 34, frameHeight: 35 });
            this.load.spritesheet('left','assets/left.png',{ frameWidth: 51, frameHeight: 53 });
            this.load.spritesheet('right','assets/right.png',{ frameWidth: 51, frameHeight: 53 });
            this.load.spritesheet('up','assets/up.png',{ frameWidth: 51, frameHeight: 53 });
            this.load.spritesheet('down','assets/down.png',{ frameWidth: 51, frameHeight: 53 });

        }

        create() {

            this.pause = this.add.sprite(this.cameras.main.width - 75, 40, 'pause').setInteractive()
            this.pause.on('pointerdown', () => this.pausedDown() );
            this.pause.on('pointerup', () => this.pausedDown() );
            this.pause.setFrame(0);

            this.right = this.add.sprite(this.cameras.main.width/2 + 55 , 557, 'right').setInteractive()
            this.right.on('pointerdown', () => this.rightEvent() );
            this.right.on('pointerup', () => this.rightEvent() );
            this.right.setFrame(0);

            this.left = this.add.sprite(this.cameras.main.width/2 - 55, 557, 'left').setInteractive()
            this.left.on('pointerdown', () => this.leftEvent() );
            this.left.on('pointerup', () => this.leftEvent() );
            this.left.setFrame(0);

            this.up = this.add.sprite(this.cameras.main.width/2, 530, 'up').setInteractive()
            this.up.on('pointerdown', () => this.upEvent() );
            this.up.on('pointerup', () => this.upEvent() );
            this.up.setFrame(0);

            this.down = this.add.sprite(this.cameras.main.width/2, 587, 'down').setInteractive()
            this.down.on('pointerdown', () => this.downEvent() );
            this.down.on('pointerup', () => this.downEvent() );
            this.down.setFrame(0);

        }

        pausedDown() {

            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.pause.setFrame(1);
            } else {
                this.pause.setFrame(0);
                this.events.emit('side', 'pause');
            }
            
        }

        rightEvent() {
            
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.right.setFrame(1);
                this.events.emit('side', 'right');
            } else {
                this.right.setFrame(0);
            }

        }

        leftEvent() {
            
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.left.setFrame(1);
                this.events.emit('side', 'left');
            } else {
                this.left.setFrame(0);
            }

        }

        upEvent() {
            
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.up.setFrame(1);
                this.events.emit('side', 'up');
            } else {
                this.up.setFrame(0);
            }
        }

        downEvent() {
            
            this.evt = event;
            if(this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.down.setFrame(1);
                this.events.emit('side', 'down');
            } else {
                this.down.setFrame(0);
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