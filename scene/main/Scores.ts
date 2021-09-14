module Snake {
    export class Scores extends Phaser.Scene {
        
        level: any; target: any; score: any; timer: any; gameTimer: any;
        startTime: any; totalTime: any; timeElapsed: any; timeBool: any; model: any; pauseTime: any;

        constructor(handle: any) {
            super(handle);
            this.model = Model.getInstance();
            this.timeBool = true;
            this.pauseTime = 0;
        }

        preload() {

            this.load.image('score','assets/scores.png');
            this.startTime = new Date();
            this.totalTime = this.model.currentLevelData.detail.time;
            this.timeElapsed = 0;

        }

        create() {

            this.cameras.main.setViewport(0, 0, 900, 640);
            var levelBox = this.add.image(52, 11, 'score').setOrigin(0);
            var targetBox = this.add.image(52, 514, 'score').setOrigin(0);
            var scoreBox = this.add.image(this.cameras.main.width - 281, 514, 'score').setOrigin(0);

            this.timer = this.add.text(this.cameras.main.width/2, 42, "00:00", { fontSize: '30px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);    
            // Convert seconds to minutes and seconds
            let minute = Math.floor( this.model.currentLevelData.detail.time / 60 );
            let seconds = Math.floor( this.model.currentLevelData.detail.time ) - ( 60 * minute );
    
            // Display minutes, add 0 to the start is less than 10
            let result = ( minute < 10 ) ? "0" + minute : minute;
            // Display seconds, add 0 to the start is less that 10;
            result +=  ( seconds < 10) ? ":0" + seconds : ":" +seconds;
            this.timer.text = result;

            this.level = this.add.text(levelBox.x + levelBox.width/2, levelBox.y + levelBox.height/2, this.model.currentLevelData.detail.name+'/8', { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);    
            this.target = this.add.text(targetBox.x + targetBox.width/2, targetBox.y + targetBox.height/2, 'Target: 0/'+this.model.currentLevelData.detail.target, { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);    
            this.score = this.add.text(scoreBox.x + scoreBox.width/2, scoreBox.y + scoreBox.height/2, "Score:0", { fontSize: '20px' , fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);    

            // this.createTimer();
            this.timerStart();
        }

        update() { }


        updateTimer() {
            
            var currentTime = new Date();
            var timeDifference = this.startTime.getTime() - currentTime.getTime();
                // Time elapsed in seconds
                this.timeElapsed = Math.abs( timeDifference / 1000 );
            
                // Time remaining in seconds
                var timeRemaining =  this.totalTime - this.timeElapsed;
                
                // Convert seconds to minutes and seconds
                var minute = Math.floor( timeRemaining / 60 );
                var seconds = Math.floor( timeRemaining ) - ( 60 * minute );

                if ( (( minute * 60 ) + seconds) >= 0 ) {
                    
                    // Display minutes, add 0 to the start is less than 10
                    var result = ( minute < 10 ) ? "0" + minute : minute;

                    // Display seconds, add 0 to the start is less that 10;
                    result +=  ( seconds < 10) ? ":0" + seconds : ":" +seconds;
                this.timer.text = result;

                } else {
                    this.events.emit('finish', 'timeFinish');
                }
        }

        timerStart() {
            this.createTimer();
        }

        changeProgress(lvl: any, target: any) {
            this.level.text = lvl;
            this.target.text = target;
        }

        scoreUpdate(count: any, target: any) {

            this.model.currentTarget = target;
            this.model.currentScore = count;
            this.score.text = 'Score:'+count;
            if(this.model.currentTarget <= this.model.currentLevelData.detail.target) {
                this.target.text = 'Target: '+target+'/'+this.model.currentLevelData.detail.target;
            }
        }

        timerPause(bool: any) {
            if(bool == true) {
                this.gameTimer.paused = bool;
                var currentTime = new Date();
                var timeDifference = this.startTime.getTime() - currentTime.getTime();
                this.timeElapsed = Math.abs( timeDifference / 1000 );
                // Time remaining in seconds
                var timeRemaining =  this.totalTime - this.timeElapsed;
                this.totalTime = timeRemaining;
                this.gameTimer.remove();
            } else {
                this.createTimer()
            }
        }

        createTimer() {
            this.startTime = new Date();
            this.gameTimer = this.time.addEvent({delay: 1000, callback: () => this.updateTimer(), callbackScope: this, loop: true, paused: false });
        }
        
        reloadScore() {
            this.model.currentTarget = 0;
            this.model.currentScore = 0;
            this.scene.restart();
        }

        destroy() {
            // this.gameTimer.remove();

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