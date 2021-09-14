module Snake {
    export class Background extends Phaser.Scene {

        selection: any; playground: any; model: any; intro: any;
       
        constructor() {
            super({key: "Background", active: true})
            this.model = Model.getInstance();
        }

        preload() {
            this.load.image('background', 'assets/background.png');
            this.load.image('gamearea', 'assets/gamearea.png');
        }

        create() {
            
            this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
            this.add.image(52, 80, 'gamearea').setOrigin(0);
            this.getLocalStorage();
            // this.setLocalStorage()
            this.introPage();
            // this.createPlayground();
            // this.createLevelGround();
            // this.hitapi();
        }
        
        setLocalStorage() {
            let gameId = 'gameId';
            localStorage.setItem(gameId, '2');

            let accessToken = 'accessToken';
            localStorage.setItem(accessToken, this.model.accessToken);
            this.getLocalStorage();
        }
        
        getLocalStorage() {
            this.model.accessToken = localStorage.getItem('accessToken');
            this.model.id = localStorage.getItem('gameId');
        }

        introPage() {

            let key = "IntroPage";
            this.intro = new IntroPage(key);
            this.scene.add(key, this.intro, true);
            this.intro.events.on('intro', this.introEvents, this);

        }

        introEvents(this: Background, data: any) {
            if(data == 'play') {
                this.createLevelGround();
                this.intro.destroy();
            }
        }

        createPlayground() {
         
            let key = "Playground";
            this.playground = new Playground(key);
            this.scene.add(key, this.playground, true);
            this.playground.events.on('playground', this.playGroundEvents, this);

        }

        playGroundEvents(this: Background, data: any) {
            
            if( data == 'home' ) { 
                this.playground.destroy();
                this.scene.wake('Selection');
                this.selection.refreshLevels()
            }
            if( data == 'next' ) {
                this.playground.destroy();
            }
        }

        createLevelGround() {
        
            let key = "Selection";
            this.selection = new Selection(key);
            this.scene.add(key, this.selection, true);
            this.selection.events.on('play',this.selectionEvents, this);
            this.scene.sleep('Selection');
            this.model.currentLevelData = this.model.levelSelectionDetail[0];
            this.createPlayground();

        }

        selectionEvents(this: Background, data: any) {
            if(data == 'home')
            {
                this.selection.destroy();
                this.introPage();
            }
            else
            {
                this.scene.sleep('Selection');
                this.createPlayground();
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