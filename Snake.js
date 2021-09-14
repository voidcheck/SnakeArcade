"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Snake;
(function (Snake) {
    var InitPhaser = /** @class */ (function () {
        function InitPhaser() {
            this.start = 1;
        }
        InitPhaser.initGame = function () {
            var config = {
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
                scene: [Snake.Background],
                backgroundColor: '#000000',
                banner: true,
                title: 'Snake',
                parent: 'game'
            };
            this.gameRef = new Phaser.Game(config);
            // this.gameRef.scale.pageAlignHorizontally = true;
            // game.scale.pageAlignVertically = true;
            // game.scale.refresh();
            // //stop game from pausing when browser is minimized
            // game.stage.disableVisibilityChange = false;
            // // Maintain aspect ratio with a minimum and maximum value
            // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            // game.scale.setMinMax( 300, 200, 1000, 625 );
        };
        return InitPhaser;
    }());
    Snake.InitPhaser = InitPhaser;
})(Snake || (Snake = {}));
window.onload = function () {
    Snake.InitPhaser.initGame();
};
var Snake;
(function (Snake) {
    var Background = /** @class */ (function (_super) {
        __extends(Background, _super);
        function Background() {
            var _this = _super.call(this, { key: "Background", active: true }) || this;
            _this.model = Snake.Model.getInstance();
            return _this;
        }
        Background.prototype.preload = function () {
            this.load.image('background', 'assets/background.png');
            this.load.image('gamearea', 'assets/gamearea.png');
        };
        Background.prototype.create = function () {
            this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'background');
            this.add.image(52, 80, 'gamearea').setOrigin(0);
            this.getLocalStorage();
            // this.setLocalStorage()
            this.introPage();
            // this.createPlayground();
            // this.createLevelGround();
            // this.hitapi();
        };
        Background.prototype.setLocalStorage = function () {
            var gameId = 'gameId';
            localStorage.setItem(gameId, '2');
            var accessToken = 'accessToken';
            localStorage.setItem(accessToken, this.model.accessToken);
            this.getLocalStorage();
        };
        Background.prototype.getLocalStorage = function () {
            this.model.accessToken = localStorage.getItem('accessToken');
            this.model.id = localStorage.getItem('gameId');
        };
        Background.prototype.introPage = function () {
            var key = "IntroPage";
            this.intro = new Snake.IntroPage(key);
            this.scene.add(key, this.intro, true);
            this.intro.events.on('intro', this.introEvents, this);
        };
        Background.prototype.introEvents = function (data) {
            if (data == 'play') {
                this.createLevelGround();
                this.intro.destroy();
            }
        };
        Background.prototype.createPlayground = function () {
            var key = "Playground";
            this.playground = new Snake.Playground(key);
            this.scene.add(key, this.playground, true);
            this.playground.events.on('playground', this.playGroundEvents, this);
        };
        Background.prototype.playGroundEvents = function (data) {
            if (data == 'home') {
                this.playground.destroy();
                this.scene.wake('Selection');
                this.selection.refreshLevels();
            }
            if (data == 'next') {
                this.playground.destroy();
            }
        };
        Background.prototype.createLevelGround = function () {
            var key = "Selection";
            this.selection = new Snake.Selection(key);
            this.scene.add(key, this.selection, true);
            this.selection.events.on('play', this.selectionEvents, this);
            this.scene.sleep('Selection');
            this.model.currentLevelData = this.model.levelSelectionDetail[0];
            this.createPlayground();
        };
        Background.prototype.selectionEvents = function (data) {
            if (data == 'home') {
                this.selection.destroy();
                this.introPage();
            }
            else {
                this.scene.sleep('Selection');
                this.createPlayground();
            }
        };
        Background.prototype.destroy = function () {
            this.events.destroy();
            this.sys.shutdown();
            if (this.time) {
                this.time.clearPendingEvents().removeAllEvents();
            }
            // this.sys.displayList.each(o => o.destroy(true));
            // this.sys.displayList.destroy();
            // this.sys.updateList.destroy();
            this.tweens.destroy();
            this.scene.remove(this);
        };
        return Background;
    }(Phaser.Scene));
    Snake.Background = Background;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Food = /** @class */ (function () {
        function Food(scene) {
            this.model = Snake.Model.getInstance();
            this.scene = scene;
        }
        Food.prototype.create = function () {
            this.food = this.scene.add.sprite(this.model.currentLevelData.detail.foodx, this.model.currentLevelData.detail.foody, 'food');
            this.food.setPosition(this.model.currentLevelData.detail.foodx * 32, this.model.currentLevelData.detail.foody * 32);
            this.food.setOrigin(0);
            this.food.setFrame(0);
            this.total = 0;
        };
        Food.prototype.eat = function () {
            this.total++;
        };
        Food.prototype.changePosition = function (x, y) {
            this.food.setFrame(Phaser.Math.RND.integerInRange(0, 5));
            this.food.setPosition(x, y);
        };
        return Food;
    }());
    Snake.Food = Food;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var _global = (window);
    var Game = /** @class */ (function (_super) {
        __extends(Game, _super);
        function Game(handle) {
            var _this = _super.call(this, handle) || this;
            _this.alive = true;
            _this.speed = 50;
            _this.moveTime = 0;
            _this.testGrid = [];
            _this.target = 0;
            _this.score = 0;
            _this.pause = false;
            _this.addition = 1;
            _this.model = Snake.Model.getInstance();
            return _this;
        }
        Game.prototype.preload = function () {
            this.load.spritesheet('head', 'assets/head.png', { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('tail', 'assets/tail.png', { frameWidth: 32, frameHeight: 32 });
            this.load.spritesheet('food', 'assets/food.png', { frameWidth: 32, frameHeight: 32 });
            this.load.image('body', 'assets/body.png');
            this.load.image('hurdle', 'assets/hurdle.png');
        };
        Game.prototype.create = function () {
            this.target = 0;
            this.score = 0;
            this.addition = this.model.currentLevelData.add;
            this.cameras.main.setViewport(65.5, 93.5, 768, 384);
            this.pause = false;
            this.tiles = new Snake.Tiles(this, this.model.currentLevelData.name);
            this.tiles.create();
            this.food = new Snake.Food(this);
            this.food.create();
            this.snake = new Snake.SnakeBody(this);
            this.snake.create();
            this.cursors = this.input.keyboard.createCursorKeys();
        };
        Game.prototype.startTimer = function () {
            this.events.emit('gameevent', 'start');
        };
        Game.prototype.update = function (time) {
            if (!this.pause) {
                if (!this.snake.alive) {
                    return;
                }
                /**
                * Check which key is pressed, and then change the direction the snake
                * is heading based on that. The checks ensure you don't double-back
                * on yourself, for example if you're moving to the right and you press
                * the LEFT cursor, it ignores it, because the only valid directions you
                * can move in at that time is up and down.
                */
                if (this.cursors.left.isDown) {
                    this.snake.faceLeft();
                }
                else if (this.cursors.right.isDown) {
                    this.snake.faceRight();
                }
                else if (this.cursors.up.isDown) {
                    this.snake.faceUp();
                }
                else if (this.cursors.down.isDown) {
                    this.snake.faceDown();
                }
                if (this.snake.update(time, this.tiles)) {
                    //  If the snake updated, we need to check for collision against food
                    if (this.model.currentTarget == this.model.currentLevelData.detail.target) {
                        this.snake.alive = false;
                        // this.events.emit('gameevent', 'levelup');
                    }
                    else if (this.snake.collideWithFood(this.food)) {
                        this.repositionFood();
                        this.score = this.score + this.addition;
                        this.target++;
                        this.events.emit('gameevent', { name: 'score', num: this.score, target: this.target });
                    }
                }
                if (this.snake.alive == false) {
                    this.callGameEvent();
                }
            }
        };
        Game.prototype.callScore = function () {
            _global.callScore();
        };
        Game.prototype.callGameEvent = function () {
            if (this.model.currentTarget >= this.model.currentLevelData.detail.target) {
                this.events.emit('gameevent', 'levelup');
            }
            else {
                // this.callScore();
                this.events.emit('gameevent', 'gameover');
            }
        };
        Game.prototype.repositionFood = function () {
            //  First create an array that assumes all positions
            //  are valid for the new piece of food
            //  A Grid we'll use to reposition the food each time it's eaten
            this.testGrid = [];
            for (var y = 0; y < 12; y++) {
                this.testGrid[y] = [];
                for (var x = 0; x < 24; x++) {
                    this.testGrid[y][x] = true;
                }
            }
            this.tiles.updateGrid(this.testGrid);
            this.snake.updateGrid(this.testGrid);
            //  Purge out false positions
            var validLocations = [];
            for (var y = 0; y < 12; y++) {
                for (var x = 0; x < 24; x++) {
                    if (this.testGrid[y][x] === true) {
                        //  Is this position valid for food? If so, add it here ...
                        validLocations.push({ x: x, y: y });
                    }
                }
            }
            if (validLocations.length > 0) {
                //  Use the RND to pick a random food position
                var pos = Phaser.Math.RND.pick(validLocations);
                //  And place it
                this.food.changePosition(pos.x * 32, pos.y * 32);
                return true;
            }
            else {
                return false;
            }
        };
        Game.prototype.restartGame = function () {
            this.scene.restart();
        };
        Game.prototype.destroy = function () {
            this.events.destroy();
            this.sys.shutdown();
            if (this.time) {
                this.time.clearPendingEvents().removeAllEvents();
            }
            this.tweens.destroy();
            this.scene.remove(this);
        };
        return Game;
    }(Phaser.Scene));
    Snake.Game = Game;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Playground = /** @class */ (function (_super) {
        __extends(Playground, _super);
        function Playground(handle) {
            var _this = _super.call(this, handle) || this;
            _this.model = Snake.Model.getInstance();
            _this.api = new Snake.SnakeService();
            return _this;
        }
        Playground.prototype.preload = function () {
            this.load.image('ground', 'assets/tile.png');
        };
        Playground.prototype.create = function () {
            this.cameras.main.setViewport(65.5, 93.5, 768, 384);
            this.body = this.add.group();
            for (var x = 0; x < 24; x++) {
                for (var y = 0; y < 12; y++) {
                    this.groundBlock = this.body.create(x * 32, y * 32, 'ground');
                    this.groundBlock.setOrigin(0);
                }
            }
            this.loadScores();
            this.loadController();
            this.levelUpMsg();
            this.createGameOverMsg();
            this.createMsg();
        };
        // adding the game scene
        Playground.prototype.loadGame = function () {
            var key = "Game";
            this.game = new Snake.Game(key);
            this.scene.add(key, this.game, true);
            this.game.events.on('gameevent', this.gameEvents, this);
        };
        Playground.prototype.gameEvents = function (data) {
            console.log(data);
            if (data == 'gameover') {
                this.score.timerPause(true);
                this.scene.wake("GameOverMessage");
                this.scene.bringToTop("GameOverMessage");
                this.gameOverMsg.updateText();
                // this.hitapi();
            }
            if (data == 'start') {
                console.log(data);
                this.score.timerStart();
            }
            if (data.name == 'score') {
                this.score.scoreUpdate(data.num, data.target);
            }
            if (data == 'levelup') {
                this.scene.wake("LevelUp");
                this.scene.bringToTop("LevelUp");
                this.levelUp.updateText();
                // this.hitapi();
            }
        };
        // adding the scores scene 
        Playground.prototype.loadScores = function () {
            var key = "Scores";
            this.score = new Snake.Scores(key);
            this.scene.add(key, this.score, true);
            this.score.events.on('finish', this.scoreEvents, this);
            this.loadGame();
        };
        Playground.prototype.scoreEvents = function (data) {
            if (data == 'timeFinish') {
                this.score.gameTimer.paused = true;
                this.game.snake.alive = false;
                this.game.callGameEvent();
            }
        };
        // add controls to the screen
        Playground.prototype.loadController = function () {
            var key = "Controller";
            this.control = new Snake.Controller(key);
            this.scene.add(key, this.control, true);
            this.control.events.on('side', this.controlerEvent, this);
        };
        Playground.prototype.controlerEvent = function (data) {
            if (data == 'right') {
                this.game.snake.faceRight();
            }
            if (data == 'left') {
                this.game.snake.faceLeft();
            }
            if (data == 'up') {
                this.game.snake.faceUp();
            }
            if (data == 'down') {
                this.game.snake.faceDown();
            }
            if (data == "pause") {
                this.score.timerPause(true);
                this.game.pause = true;
                this.scene.wake("PauseMessage");
                this.scene.bringToTop("PauseMessage");
            }
            if (data == 'restart') {
                this.score.reloadScore();
                this.game.restartGame();
            }
        };
        // adding game over message box to scene
        Playground.prototype.createGameOverMsg = function () {
            var key = "GameOverMessage";
            this.gameOverMsg = new Snake.GameOverMessage(key);
            this.scene.add(key, this.gameOverMsg, true);
            this.gameOverMsg.events.on('gameover', this.gameOverMessageEvents, this);
            this.scene.sleep(key);
        };
        Playground.prototype.gameOverMessageEvents = function (data) {
            if (data == "restart") {
                this.score.reloadScore();
                this.game.restartGame();
            }
            if (data == "home") {
                this.removeAllScenes();
            }
            this.scene.sleep("GameOverMessage");
        };
        // adding pause message box to scene
        Playground.prototype.createMsg = function () {
            var key = "PauseMessage";
            this.pauseMessage = new Snake.PauseMessage(key);
            this.scene.add(key, this.pauseMessage, true);
            this.pauseMessage.events.on('pause', this.pauseMessageEvents, this);
            this.scene.sleep('PauseMessage');
        };
        Playground.prototype.pauseMessageEvents = function (data) {
            if (data == 'play') {
                this.score.timerPause(false);
                this.game.pause = false;
            }
            if (data == 'home') {
                this.removeAllScenes();
            }
            if (data == 'restart') {
                this.score.reloadScore();
                this.game.restartGame();
            }
            this.scene.sleep("PauseMessage");
        };
        // add level up message
        Playground.prototype.levelUpMsg = function () {
            var key = 'LevelUp';
            this.levelUp = new Snake.LevelUp(key);
            this.scene.add(key, this.levelUp, true);
            this.levelUp.events.on('levelup', this.levelUpEvents, this);
            this.scene.sleep(key);
        };
        Playground.prototype.levelUpEvents = function (data) {
            if (data == 'home') {
                this.removeAllScenes();
            }
            if (data == 'next') {
                this.scene.sleep('LevelUp');
                this.loadNextLevel();
            }
        };
        Playground.prototype.removeAllScenes = function () {
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
        };
        Playground.prototype.loadNextLevel = function () {
            for (var k = 0; k < this.model.levelSelectionDetail.length; k++) {
                if (this.model.levelSelectionDetail[k].name == this.model.currentLevelData.name) {
                    this.model.currentLevelData = this.model.levelSelectionDetail[k + 1];
                    this.score.reloadScore();
                    this.game.restartGame();
                    break;
                }
            }
        };
        Playground.prototype.restartPlayground = function () {
            this.scene.restart();
        };
        Playground.prototype.hitapi = function () {
            console.log('gameid is ', this.model.id);
            this.api.updateHighScore(this.model.currentScore, this.model.id, this.model.accessToken);
        };
        Playground.prototype.destroy = function () {
            this.events.destroy();
            this.sys.shutdown();
            if (this.time) {
                this.time.clearPendingEvents().removeAllEvents();
            }
            // this.sys.displayList.each(o => o.destroy(true));
            // this.sys.displayList.destroy();
            // this.sys.updateList.destroy();
            this.tweens.destroy();
            this.scene.remove(this);
        };
        return Playground;
    }(Phaser.Scene));
    Snake.Playground = Playground;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Scores = /** @class */ (function (_super) {
        __extends(Scores, _super);
        function Scores(handle) {
            var _this = _super.call(this, handle) || this;
            _this.model = Snake.Model.getInstance();
            _this.timeBool = true;
            _this.pauseTime = 0;
            return _this;
        }
        Scores.prototype.preload = function () {
            this.load.image('score', 'assets/scores.png');
            this.startTime = new Date();
            this.totalTime = this.model.currentLevelData.detail.time;
            this.timeElapsed = 0;
        };
        Scores.prototype.create = function () {
            this.cameras.main.setViewport(0, 0, 900, 640);
            var levelBox = this.add.image(52, 11, 'score').setOrigin(0);
            var targetBox = this.add.image(52, 514, 'score').setOrigin(0);
            var scoreBox = this.add.image(this.cameras.main.width - 281, 514, 'score').setOrigin(0);
            this.timer = this.add.text(this.cameras.main.width / 2, 42, "00:00", { fontSize: '30px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            // Convert seconds to minutes and seconds
            var minute = Math.floor(this.model.currentLevelData.detail.time / 60);
            var seconds = Math.floor(this.model.currentLevelData.detail.time) - (60 * minute);
            // Display minutes, add 0 to the start is less than 10
            var result = (minute < 10) ? "0" + minute : minute;
            // Display seconds, add 0 to the start is less that 10;
            result += (seconds < 10) ? ":0" + seconds : ":" + seconds;
            this.timer.text = result;
            this.level = this.add.text(levelBox.x + levelBox.width / 2, levelBox.y + levelBox.height / 2, this.model.currentLevelData.detail.name + '/8', { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.target = this.add.text(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, 'Target: 0/' + this.model.currentLevelData.detail.target, { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.score = this.add.text(scoreBox.x + scoreBox.width / 2, scoreBox.y + scoreBox.height / 2, "Score:0", { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            // this.createTimer();
            this.timerStart();
        };
        Scores.prototype.update = function () { };
        Scores.prototype.updateTimer = function () {
            var currentTime = new Date();
            var timeDifference = this.startTime.getTime() - currentTime.getTime();
            // Time elapsed in seconds
            this.timeElapsed = Math.abs(timeDifference / 1000);
            // Time remaining in seconds
            var timeRemaining = this.totalTime - this.timeElapsed;
            // Convert seconds to minutes and seconds
            var minute = Math.floor(timeRemaining / 60);
            var seconds = Math.floor(timeRemaining) - (60 * minute);
            if (((minute * 60) + seconds) >= 0) {
                // Display minutes, add 0 to the start is less than 10
                var result = (minute < 10) ? "0" + minute : minute;
                // Display seconds, add 0 to the start is less that 10;
                result += (seconds < 10) ? ":0" + seconds : ":" + seconds;
                this.timer.text = result;
            }
            else {
                this.events.emit('finish', 'timeFinish');
            }
        };
        Scores.prototype.timerStart = function () {
            this.createTimer();
        };
        Scores.prototype.changeProgress = function (lvl, target) {
            this.level.text = lvl;
            this.target.text = target;
        };
        Scores.prototype.scoreUpdate = function (count, target) {
            this.model.currentTarget = target;
            this.model.currentScore = count;
            this.score.text = 'Score:' + count;
            if (this.model.currentTarget <= this.model.currentLevelData.detail.target) {
                this.target.text = 'Target: ' + target + '/' + this.model.currentLevelData.detail.target;
            }
        };
        Scores.prototype.timerPause = function (bool) {
            if (bool == true) {
                this.gameTimer.paused = bool;
                var currentTime = new Date();
                var timeDifference = this.startTime.getTime() - currentTime.getTime();
                this.timeElapsed = Math.abs(timeDifference / 1000);
                // Time remaining in seconds
                var timeRemaining = this.totalTime - this.timeElapsed;
                this.totalTime = timeRemaining;
                this.gameTimer.remove();
            }
            else {
                this.createTimer();
            }
        };
        Scores.prototype.createTimer = function () {
            var _this = this;
            this.startTime = new Date();
            this.gameTimer = this.time.addEvent({ delay: 1000, callback: function () { return _this.updateTimer(); }, callbackScope: this, loop: true, paused: false });
        };
        Scores.prototype.reloadScore = function () {
            this.model.currentTarget = 0;
            this.model.currentScore = 0;
            this.scene.restart();
        };
        Scores.prototype.destroy = function () {
            // this.gameTimer.remove();
            this.events.destroy();
            this.sys.shutdown();
            if (this.time) {
                this.time.clearPendingEvents().removeAllEvents();
            }
            // this.sys.displayList.each(o => o.destroy(true));
            // this.sys.displayList.destroy();
            // this.sys.updateList.destroy();
            this.tweens.destroy();
            this.scene.remove(this);
        };
        return Scores;
    }(Phaser.Scene));
    Snake.Scores = Scores;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var SnakeBody = /** @class */ (function () {
        function SnakeBody(scene) {
            this.alive = true;
            this.speed = 200;
            this.moveTime = 0;
            this.UP = 0;
            this.DOWN = 1;
            this.LEFT = 2;
            this.RIGHT = 3;
            this.model = Snake.Model.getInstance();
            this.scene = scene;
        }
        SnakeBody.prototype.create = function () {
            this.headPosition = new Phaser.Geom.Point(this.model.currentLevelData.detail.snakex, this.model.currentLevelData.detail.snakey);
            this.reptile = this.scene.add.group();
            this.head = this.scene.add.sprite(this.model.currentLevelData.detail.snakex * 32, this.model.currentLevelData.detail.snakey * 32, 'head');
            this.head.setOrigin(0);
            this.head.setFrame(1);
            this.reptile.add(this.head);
            this.body = this.reptile.create(this.head.x, this.head.y, 'body');
            this.body.setOrigin(0);
            this.alive = true;
            this.speed = 200;
            this.moveTime = 0;
            this.tail = new Phaser.Geom.Point(this.model.currentLevelData.detail.snakex, this.model.currentLevelData.detail.snakey);
            this.heading = this.RIGHT;
            this.direction = this.RIGHT;
        };
        SnakeBody.prototype.update = function (time, tiles) {
            if (time >= this.moveTime) {
                return this.move(time, tiles);
            }
        };
        SnakeBody.prototype.move = function (time, tiles) {
            // console.log(time);
            /**
            * Based on the heading property (which is the direction the pgroup pressed)
            * we update the headPosition value accordingly.
            *
            * The Math.wrap call allow the snake to wrap around the screen, so when
            * it goes off any of the sides it re-appears on the other.
            */
            //    console.log('the heading ',this.heading);
            switch (this.heading) {
                case this.LEFT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x - 1, 0, 24);
                    // this.legs.setFrame(3);
                    break;
                case this.RIGHT:
                    this.headPosition.x = Phaser.Math.Wrap(this.headPosition.x + 1, 0, 24);
                    // this.legs.setFrame(1);
                    break;
                case this.UP:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y - 1, 0, 12);
                    // this.legs.setFrame(0);
                    break;
                case this.DOWN:
                    this.headPosition.y = Phaser.Math.Wrap(this.headPosition.y + 1, 0, 12);
                    // this.legs.setFrame(2);
                    break;
            }
            this.direction = this.heading;
            //  Update the body segments and place the last coordinate into this.tail
            Phaser.Actions.ShiftPosition(this.reptile.getChildren(), this.headPosition.x * 32, this.headPosition.y * 32, 1, this.tail);
            // console.log(this.legs.x, this.legs.y)
            //  Check to see if any of the body pieces have the same x/y as the head
            //  If they do, the head ran into the body
            var hitBody = Phaser.Actions.GetFirst(this.reptile.getChildren(), { x: this.head.x, y: this.head.y }, 1);
            //check to see if snake hits the block
            // console.log('check to see if snake hits the block ',tiles.body.getChildren());
            // console.log('hit here ',Phaser.Actions.GetFirst(tiles.body.getChildren(), { x: this.head.x, y: this.head.y }, 1))
            var hitBlock = Phaser.Actions.GetFirst(tiles.body.getChildren(), { x: this.head.x, y: this.head.y }, 0);
            if (hitBody || hitBlock) {
                console.log('dead');
                this.alive = false;
                return false;
            }
            else {
                //  Update the timer ready for the next movement
                this.moveTime = time + this.speed;
                return true;
            }
        };
        SnakeBody.prototype.faceLeft = function () {
            if (this.direction === this.UP || this.direction === this.DOWN) {
                this.heading = this.LEFT;
                this.head.setFrame(3);
            }
        };
        SnakeBody.prototype.faceRight = function () {
            if (this.direction === this.UP || this.direction === this.DOWN) {
                this.heading = this.RIGHT;
                this.head.setFrame(1);
            }
        };
        SnakeBody.prototype.faceUp = function () {
            if (this.direction === this.LEFT || this.direction === this.RIGHT) {
                this.heading = this.UP;
                this.head.setFrame(0);
            }
        };
        SnakeBody.prototype.faceDown = function () {
            if (this.direction === this.LEFT || this.direction === this.RIGHT) {
                this.heading = this.DOWN;
                this.head.setFrame(2);
            }
        };
        SnakeBody.prototype.grow = function () {
            // this.legs.destroy();
            var newPart = this.reptile.create(this.body.x, this.body.y, 'body');
            newPart.setOrigin(0);
            // this.legs = this.reptile.create(this.body.x, this.body.y, 'tail');
            // this.legs.setOrigin(0);
        };
        SnakeBody.prototype.collideWithFood = function (food) {
            if (this.head.x === food.food.x && this.head.y === food.food.y) {
                this.grow();
                food.eat();
                //  For every 5 items of food eaten we'll increase the snake speed a little
                if (this.speed > 20 && food.total % 5 === 0) {
                    this.speed -= 5;
                }
                return true;
            }
            else {
                return false;
            }
        };
        // collideWithBlock(tile: any) {
        //     var hitBody = Phaser.Actions.GetFirst(tile.body.getChildren(), { x: this.head.x, y: this.head.y }, 1);
        //     if (hitBody)
        //     {
        //         console.log('dead');
        //         this.alive = false;
        //         return false;
        //     }
        //     else 
        //     {
        //         return true;
        //     }
        // }
        SnakeBody.prototype.updateGrid = function (grid) {
            //  Remove all body pieces from valid positions list
            this.reptile.children.each(function (segment) {
                var bx = segment.x / 32;
                var by = segment.y / 32;
                grid[by][bx] = false;
            });
            return grid;
        };
        return SnakeBody;
    }());
    Snake.SnakeBody = SnakeBody;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Tiles = /** @class */ (function () {
        function Tiles(scene, level) {
            this.xt = 24;
            this.yt = 12;
            this.level = level;
            this.scene = scene;
            this.lvlObj = new Snake.Levels();
        }
        Tiles.prototype.create = function () {
            this.body = this.scene.add.group();
            for (var i = 0; i < this.lvlObj.levels.length; i++) {
                if (this.lvlObj.levels[i].name == this.level) {
                    if (this.lvlObj.levels[i].list.length != 0) {
                        for (var j = 0; j < this.lvlObj.levels[i].list.length; j++) {
                            for (var x = 0; x < this.xt; x++) {
                                for (var y = 0; y < this.yt; y++) {
                                    if (this.lvlObj.levels[i].list[j].type == "col") {
                                        if (x == this.lvlObj.levels[i].list[j].index.start.x) {
                                            if (y >= this.lvlObj.levels[i].list[j].index.start.y && y <= this.lvlObj.levels[i].list[j].index.end.y) {
                                                this.block = this.body.create(x * 32, y * 32, 'hurdle');
                                                this.block.setOrigin(0);
                                            }
                                        }
                                    }
                                    if (this.lvlObj.levels[i].list[j].type == "row") {
                                        if (y == this.lvlObj.levels[i].list[j].index.start.y) {
                                            if (x >= this.lvlObj.levels[i].list[j].index.start.x && x <= this.lvlObj.levels[i].list[j].index.end.x) {
                                                this.block = this.body.create(x * 32, y * 32, 'hurdle');
                                                this.block.setOrigin(0);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        Tiles.prototype.updateGrid = function (grid) {
            //  Remove all body pieces from valid positions list
            this.body.children.each(function (segment) {
                var bx = segment.x / 32;
                var by = segment.y / 32;
                grid[by][bx] = false;
            });
            return grid;
        };
        return Tiles;
    }());
    Snake.Tiles = Tiles;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Controller = /** @class */ (function (_super) {
        __extends(Controller, _super);
        function Controller(handle) {
            return _super.call(this, handle) || this;
        }
        Controller.prototype.preload = function () {
            this.cameras.main.setViewport(0, 0, 900, 640);
            this.load.spritesheet('pause', 'assets/pause.png', { frameWidth: 34, frameHeight: 35 });
            this.load.spritesheet('left', 'assets/left.png', { frameWidth: 51, frameHeight: 53 });
            this.load.spritesheet('right', 'assets/right.png', { frameWidth: 51, frameHeight: 53 });
            this.load.spritesheet('up', 'assets/up.png', { frameWidth: 51, frameHeight: 53 });
            this.load.spritesheet('down', 'assets/down.png', { frameWidth: 51, frameHeight: 53 });
        };
        Controller.prototype.create = function () {
            var _this = this;
            this.pause = this.add.sprite(this.cameras.main.width - 75, 40, 'pause').setInteractive();
            this.pause.on('pointerdown', function () { return _this.pausedDown(); });
            this.pause.on('pointerup', function () { return _this.pausedDown(); });
            this.pause.setFrame(0);
            this.right = this.add.sprite(this.cameras.main.width / 2 + 55, 557, 'right').setInteractive();
            this.right.on('pointerdown', function () { return _this.rightEvent(); });
            this.right.on('pointerup', function () { return _this.rightEvent(); });
            this.right.setFrame(0);
            this.left = this.add.sprite(this.cameras.main.width / 2 - 55, 557, 'left').setInteractive();
            this.left.on('pointerdown', function () { return _this.leftEvent(); });
            this.left.on('pointerup', function () { return _this.leftEvent(); });
            this.left.setFrame(0);
            this.up = this.add.sprite(this.cameras.main.width / 2, 530, 'up').setInteractive();
            this.up.on('pointerdown', function () { return _this.upEvent(); });
            this.up.on('pointerup', function () { return _this.upEvent(); });
            this.up.setFrame(0);
            this.down = this.add.sprite(this.cameras.main.width / 2, 587, 'down').setInteractive();
            this.down.on('pointerdown', function () { return _this.downEvent(); });
            this.down.on('pointerup', function () { return _this.downEvent(); });
            this.down.setFrame(0);
        };
        Controller.prototype.pausedDown = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.pause.setFrame(1);
            }
            else {
                this.pause.setFrame(0);
                this.events.emit('side', 'pause');
            }
        };
        Controller.prototype.rightEvent = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.right.setFrame(1);
                this.events.emit('side', 'right');
            }
            else {
                this.right.setFrame(0);
            }
        };
        Controller.prototype.leftEvent = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.left.setFrame(1);
                this.events.emit('side', 'left');
            }
            else {
                this.left.setFrame(0);
            }
        };
        Controller.prototype.upEvent = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.up.setFrame(1);
                this.events.emit('side', 'up');
            }
            else {
                this.up.setFrame(0);
            }
        };
        Controller.prototype.downEvent = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.down.setFrame(1);
                this.events.emit('side', 'down');
            }
            else {
                this.down.setFrame(0);
            }
        };
        Controller.prototype.destroy = function () {
            this.events.destroy();
            this.sys.shutdown();
            if (this.time) {
                this.time.clearPendingEvents().removeAllEvents();
            }
            // this.sys.displayList.each(o => o.destroy(true));
            // this.sys.displayList.destroy();
            // this.sys.updateList.destroy();
            this.tweens.destroy();
            this.scene.remove(this);
        };
        return Controller;
    }(Phaser.Scene));
    Snake.Controller = Controller;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Levels = /** @class */ (function () {
        function Levels() {
            this.levels = [
                {
                    name: '1',
                    list: []
                },
                {
                    name: '2',
                    list: [
                        {
                            type: 'col',
                            index: { start: { x: 5, y: 3 },
                                end: { x: 5, y: 8 },
                            }
                        },
                        {
                            type: 'col',
                            index: { start: { x: 18, y: 3 },
                                end: { x: 18, y: 8 },
                            }
                        },
                    ]
                },
                {
                    name: '3',
                    list: [
                        {
                            type: 'row',
                            index: { start: { x: 6, y: 8 },
                                end: { x: 17, y: 8 },
                            }
                        },
                        {
                            type: 'row',
                            index: { start: { x: 6, y: 3 },
                                end: { x: 17, y: 3 },
                            }
                        }
                    ]
                },
                {
                    name: '4',
                    list: [
                        {
                            type: 'col',
                            index: { start: { x: 6, y: 5 },
                                end: { x: 6, y: 6 },
                            }
                        },
                        {
                            type: 'col',
                            index: { start: { x: 17, y: 5 },
                                end: { x: 17, y: 6 },
                            }
                        },
                        {
                            type: 'row',
                            index: { start: { x: 9, y: 10 },
                                end: { x: 14, y: 10 },
                            }
                        },
                        {
                            type: 'row',
                            index: { start: { x: 9, y: 1 },
                                end: { x: 14, y: 1 },
                            }
                        }
                    ]
                },
                {
                    name: '5',
                    list: [
                        {
                            type: 'col',
                            index: { start: { x: 11, y: 4 },
                                end: { x: 11, y: 8 },
                            }
                        },
                        {
                            type: 'row',
                            index: { start: { x: 8, y: 6 },
                                end: { x: 14, y: 6 },
                            }
                        },
                    ]
                },
                {
                    name: '6',
                    list: [
                        {
                            type: 'col',
                            index: { start: { x: 0, y: 1 },
                                end: { x: 0, y: 2 },
                            }
                        },
                        {
                            type: 'row',
                            index: { start: { x: 0, y: 0 },
                                end: { x: 2, y: 0 },
                            }
                        },
                        {
                            type: 'col',
                            index: { start: { x: 23, y: 0 },
                                end: { x: 23, y: 2 },
                            }
                        },
                        {
                            type: 'row',
                            index: { start: { x: 21, y: 0 },
                                end: { x: 22, y: 0 },
                            }
                        },
                        {
                            type: 'col',
                            index: { start: { x: 0, y: 9 },
                                end: { x: 0, y: 11 },
                            }
                        },
                        {
                            type: 'row',
                            index: { start: { x: 1, y: 11 },
                                end: { x: 2, y: 11 },
                            }
                        },
                        {
                            type: 'col',
                            index: { start: { x: 23, y: 9 },
                                end: { x: 23, y: 11 },
                            }
                        },
                        {
                            type: 'row',
                            index: { start: { x: 21, y: 11 },
                                end: { x: 22, y: 11 },
                            }
                        },
                    ]
                },
                {
                    name: '7',
                    list: [
                        {
                            type: 'col',
                            index: { start: { x: 0, y: 4 },
                                end: { x: 0, y: 7 },
                            }
                        },
                        {
                            type: 'col',
                            index: { start: { x: 23, y: 4 },
                                end: { x: 23, y: 7 },
                            }
                        },
                        {
                            type: 'row',
                            index: { start: { x: 9, y: 0 },
                                end: { x: 14, y: 0 },
                            }
                        },
                        {
                            type: 'row',
                            index: { start: { x: 9, y: 11 },
                                end: { x: 14, y: 11 },
                            }
                        }
                    ]
                },
                {
                    name: '8',
                    list: [
                        {
                            type: 'col',
                            index: { start: { x: 0, y: 1 },
                                end: { x: 0, y: 11 },
                            }
                        },
                        {
                            type: 'col',
                            index: { start: { x: 23, y: 1 },
                                end: { x: 23, y: 11 },
                            }
                        },
                        {
                            type: 'row',
                            index: { start: { x: 0, y: 11 },
                                end: { x: 23, y: 11 },
                            }
                        },
                        {
                            type: 'row',
                            index: { start: { x: 0, y: 0 },
                                end: { x: 23, y: 0 },
                            }
                        },
                    ]
                }
            ];
        }
        return Levels;
    }());
    Snake.Levels = Levels;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Model = /** @class */ (function () {
        function Model() {
            this.levelSelectionDetail = [
                {
                    name: '1',
                    add: 1,
                    lock: false,
                    detail: { name: 'Level:1', target: 15, star: 0, time: 90, clear: true, foodx: 15, foody: 10, snakex: 2, snakey: 2 }
                },
                {
                    name: '2',
                    add: 2,
                    lock: true,
                    detail: { name: 'Level:2', target: 20, star: 0, time: 120, clear: false, foodx: 7, foody: 8, snakex: 1, snakey: 1 }
                },
                {
                    name: '3',
                    add: 3,
                    lock: true,
                    detail: { name: 'Level:3', target: 25, star: 0, time: 150, clear: false, foodx: 3, foody: 4, snakex: 5, snakey: 5 }
                },
                {
                    name: '4',
                    add: 4,
                    lock: true,
                    detail: { name: 'Level:4', target: 30, star: 0, time: 180, clear: false, foodx: 11, foody: 6, snakex: 1, snakey: 2 }
                },
                {
                    name: '5',
                    add: 5,
                    lock: true,
                    detail: { name: 'Level:5', target: 35, star: 0, time: 210, clear: false, foodx: 18, foody: 3, snakex: 3, snakey: 0 }
                },
                {
                    name: '6',
                    add: 6,
                    lock: true,
                    detail: { name: 'Level:6', target: 40, star: 0, time: 240, clear: false, foodx: 3, foody: 4, snakex: 8, snakey: 8 }
                },
                {
                    name: '7',
                    add: 7,
                    lock: true,
                    detail: { name: 'Level:7', target: 45, star: 0, time: 270, clear: false, foodx: 3, foody: 4, snakex: 8, snakey: 8 }
                },
                {
                    name: '8',
                    add: 8,
                    lock: true,
                    detail: { name: 'Level:8', target: 50, star: 0, time: 300, clear: false, foodx: 3, foody: 4, snakex: 8, snakey: 8 }
                }
            ];
            this.currentScore = 0;
            this.currentTarget = 0;
            this.id = 0;
            this.accessToken = 'vkIy3PM7IKHBKCqZruKUf1bvxpnm3elREgaEWZot1bYp4XyQVHCdCqYtJpnGe39p';
            this.globalVariable = 1;
        }
        Model.prototype.returnGameId = function () {
            return this.id;
        };
        Model.prototype.globalFunc = function (start) {
            this.globalVariable = start;
            console.log('check for start ', start);
        };
        Model.getInstance = function () {
            if (!Model.instance) {
                Model.instance = new Model();
            }
            return Model.instance;
        };
        return Model;
    }());
    Snake.Model = Model;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var _global = (window);
    var GameOverMessage = /** @class */ (function (_super) {
        __extends(GameOverMessage, _super);
        function GameOverMessage(handle) {
            var _this = _super.call(this, handle) //"GameOverMessage"
             || this;
            _this.model = Snake.Model.getInstance();
            return _this;
        }
        GameOverMessage.prototype.preload = function () {
            this.load.image('bg', 'assets/popups/overlay.png');
            this.load.image('msgBox', 'assets/popups/bg_popup_large.png');
            this.load.spritesheet('restart', 'assets/popups/replay.png', { frameWidth: 59, frameHeight: 62 });
            this.load.spritesheet('Home', 'assets/popups/home.png', { frameWidth: 59, frameHeight: 62 });
        };
        GameOverMessage.prototype.create = function () {
            var _this = this;
            this.cameras.main.setViewport(0, 0, 900, 640);
            this.msgBox = this.add.group();
            var overlay = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'bg');
            this.msgBox.add(overlay);
            this.box = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'msgBox');
            this.msgBox.add(this.box);
            var heading = this.add.text(this.cameras.main.width / 2, this.box.y - 130, "GAME OVER", { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(heading);
            var tar = this.add.text(this.cameras.main.width / 2 - 75, this.cameras.main.height / 2 - 50, "Target", { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(tar);
            this.target = this.add.text(this.cameras.main.width / 2 + 65, this.cameras.main.height / 2 - 50, this.model.currentTarget + " / " + this.model.currentLevelData.detail.target, { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(this.target);
            var scr = this.add.text(this.cameras.main.width / 2 - 75, this.cameras.main.height / 2, "Score", { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(scr);
            this.score = this.add.text(this.cameras.main.width / 2 + 65, this.cameras.main.height / 2, this.model.currentScore, { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(this.score);
            this.home = this.add.sprite(this.cameras.main.width / 2 - 59, this.cameras.main.height / 2 + 93, 'Home').setInteractive();
            this.home.setFrame(0);
            this.home.on('pointerdown', function () { return _this.homeEvents(); });
            this.home.on('pointerup', function () { return _this.homeEvents(); });
            this.msgBox.add(this.home);
            this.restart = this.add.sprite(this.cameras.main.width / 2 + 59, this.cameras.main.height / 2 + 93, 'restart').setInteractive();
            this.restart.setFrame(0);
            this.restart.on('pointerdown', function () { return _this.restartEvents(); });
            this.restart.on('pointerup', function () { return _this.restartEvents(); });
            this.msgBox.add(this.restart);
        };
        GameOverMessage.prototype.updateText = function () {
            if (this.model.currentTarget <= this.model.currentLevelData.detail.target) {
                this.target.text = this.model.currentTarget + " / " + this.model.currentLevelData.detail.target;
            }
            else {
                this.target.text = this.model.currentLevelData.detail.target + " / " + this.model.currentLevelData.detail.target;
            }
            this.score.text = this.model.currentScore;
        };
        GameOverMessage.prototype.homeEvents = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.home.setFrame(1);
            }
            else {
                this.home.setFrame(0);
                this.events.emit('gameover', 'home');
            }
        };
        GameOverMessage.prototype.restartEvents = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.restart.setFrame(1);
            }
            else {
                this.restart.setFrame(0);
                this.hitPlayApi();
                // this.events.emit('gameover', 'restart');
            }
        };
        GameOverMessage.prototype.callFunc = function () {
            _global.callcheck();
        };
        GameOverMessage.prototype.hitPlayApi = function () {
            var _this = this;
            var self = this;
            var request = new XMLHttpRequest();
            var data = {
                "accessToken": this.model.accessToken,
                "game_id": this.model.id
            };
            request.open("POST", 'http://paarcade.com/api/user_game_scores/gameStart/', true);
            request.setRequestHeader("Content-type", "application/json");
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var obj = JSON.parse(request.response);
                    if (obj.data.status == 1) {
                        _this.callFunc();
                        _this.events.emit('gameover', 'restart');
                    }
                    else {
                        console.log('not allowed ');
                    }
                }
            };
            request.send(JSON.stringify(data));
        };
        GameOverMessage.prototype.resetData = function (obj) {
            if (obj != null) {
                this.model.gameId = obj.gameId;
                this.model.userId = obj.user_id;
                var level = obj.level.replace(/\,/g, "");
                var star = obj.star.replace(/\,/g, "");
                for (var i = 0; i < level.length; i++) {
                    console.log('numbercheck ', level[i]);
                    if (level[i] == this.model.levelSelectionDetail[i].name) {
                        this.model.levelSelectionDetail[i].detail.star = star[i];
                        if (star[i] != 0) {
                            this.model.levelSelectionDetail[i + 1].lock = false;
                        }
                    }
                }
            }
            this.events.emit('pause', 'restart');
        };
        GameOverMessage.prototype.destroy = function () {
            this.events.destroy();
            this.sys.shutdown();
            if (this.time) {
                this.time.clearPendingEvents().removeAllEvents();
            }
            // this.sys.displayList.each(o => o.destroy(true));
            // this.sys.displayList.destroy();
            // this.sys.updateList.destroy();
            this.tweens.destroy();
            this.scene.remove(this);
        };
        return GameOverMessage;
    }(Phaser.Scene));
    Snake.GameOverMessage = GameOverMessage;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var LevelUp = /** @class */ (function (_super) {
        __extends(LevelUp, _super);
        function LevelUp(handle) {
            var _this = _super.call(this, handle) || this;
            _this.model = Snake.Model.getInstance();
            return _this;
        }
        LevelUp.prototype.preload = function () {
            this.load.image('lvlbg', 'assets/popups/overlay.png');
            this.load.image('box', 'assets/popups/bg_popup_large.png');
            this.load.spritesheet('next', 'assets/popups/next.png', { frameWidth: 59, frameHeight: 62 });
            this.load.spritesheet('villa', 'assets/popups/home.png', { frameWidth: 59, frameHeight: 62 });
            this.load.spritesheet('lvlstars', 'assets/popups/level.png', { frameWidth: 175, frameHeight: 58 });
        };
        LevelUp.prototype.create = function () {
            var _this = this;
            this.cameras.main.setViewport(0, 0, 900, 640);
            this.msgBox = this.add.group();
            var overlay = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'lvlbg');
            this.msgBox.add(overlay);
            this.box = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'box');
            this.msgBox.add(this.box);
            this.levelStar = this.add.image(this.cameras.main.width / 2, this.box.y - 175, 'lvlstars');
            this.levelStar.setFrame(0);
            var heading = this.add.text(this.cameras.main.width / 2, this.box.y - 130, "LEVEL UP", { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(heading);
            var tar = this.add.text(this.cameras.main.width / 2 - 75, this.cameras.main.height / 2 - 50, "Target", { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(tar);
            this.target = this.add.text(this.cameras.main.width / 2 + 65, this.cameras.main.height / 2 - 50, this.model.currentTarget + " / " + this.model.currentLevelData.detail.target, { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(this.target);
            var scr = this.add.text(this.cameras.main.width / 2 - 75, this.cameras.main.height / 2, "Score", { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(scr);
            this.score = this.add.text(this.cameras.main.width / 2 + 65, this.cameras.main.height / 2, this.model.currentScore, { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(this.score);
            this.home = this.add.sprite(this.cameras.main.width / 2 - 59, this.cameras.main.height / 2 + 93, 'villa').setInteractive();
            this.home.setFrame(0);
            this.home.on('pointerdown', function () { return _this.homeEvents(); });
            this.home.on('pointerup', function () { return _this.homeEvents(); });
            this.msgBox.add(this.home);
            this.next = this.add.sprite(this.cameras.main.width / 2 + 59, this.cameras.main.height / 2 + 93, 'next').setInteractive();
            this.next.setFrame(0);
            this.next.on('pointerdown', function () { return _this.nextEvents(); });
            this.next.on('pointerup', function () { return _this.nextEvents(); });
            this.msgBox.add(this.next);
        };
        LevelUp.prototype.updateText = function () {
            if (this.model.currentTarget <= this.model.currentLevelData.detail.target) {
                this.target.text = this.model.currentTarget + " / " + this.model.currentLevelData.detail.target;
            }
            else {
                this.target.text = this.model.currentLevelData.detail.target + " / " + this.model.currentLevelData.detail.target;
            }
            this.score.text = this.model.currentScore;
            if (this.model.currentTarget >= this.model.currentLevelData.detail.target) {
                this.levelStar.setFrame(2);
                this.star = 3;
                for (var k = 0; k < this.model.levelSelectionDetail.length; k++) {
                    if (this.model.currentLevelData.name == this.model.levelSelectionDetail[k].name) {
                        this.model.levelSelectionDetail[k].detail.star = this.star;
                        if (k != this.model.levelSelectionDetail.length - 1) {
                            this.model.levelSelectionDetail[k + 1].lock = false;
                        }
                    }
                    else {
                    }
                }
            }
            else if (this.model.currentTarget > this.model.currentLevelData.detail.target / 2 && this.model.currentTarget <= this.model.currentLevelData.detail.target / 1.5) {
                this.levelStar.setFrame(1);
                this.star = 2;
            }
            else {
                this.levelStar.setFrame(0);
                this.star = 1;
            }
        };
        LevelUp.prototype.homeEvents = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.home.setFrame(1);
            }
            else {
                this.home.setFrame(0);
                this.events.emit('levelup', 'home');
            }
        };
        LevelUp.prototype.nextEvents = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.next.setFrame(1);
            }
            else {
                this.next.setFrame(0);
                this.events.emit('levelup', 'next');
            }
        };
        LevelUp.prototype.destroy = function () {
            this.events.destroy();
            this.sys.shutdown();
            if (this.time) {
                this.time.clearPendingEvents().removeAllEvents();
            }
            // this.sys.displayList.each(o => o.destroy(true));
            // this.sys.displayList.destroy();
            // this.sys.updateList.destroy();
            this.tweens.destroy();
            this.scene.remove(this);
        };
        return LevelUp;
    }(Phaser.Scene));
    Snake.LevelUp = LevelUp;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var _global = (window);
    var PauseMessage = /** @class */ (function (_super) {
        __extends(PauseMessage, _super);
        function PauseMessage(handle) {
            var _this = _super.call(this, handle) || this;
            _this.model = Snake.Model.getInstance();
            return _this;
        }
        PauseMessage.prototype.preload = function () {
            this.load.image('overlay', 'assets/popups/overlay.png');
            this.load.image('msgbox', 'assets/popups/bg_pause.png');
            this.load.spritesheet('replay', 'assets/popups/replay.png', { frameWidth: 59, frameHeight: 62 });
            this.load.spritesheet('home', 'assets/popups/home.png', { frameWidth: 59, frameHeight: 62 });
            this.load.spritesheet('playlarge', 'assets/popups/play_large.png', { frameWidth: 77, frameHeight: 80 });
        };
        PauseMessage.prototype.create = function () {
            var _this = this;
            this.cameras.main.setViewport(0, 0, 900, 640);
            this.msgBox = this.add.group();
            var overlay = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'overlay');
            this.msgBox.add(overlay);
            this.box = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'msgbox');
            this.msgBox.add(this.box);
            var heading = this.add.text(this.cameras.main.width / 2, this.box.y - 80, "PAUSE", { fontSize: '30px', fontFamily: 'CarterOne', fill: '#ffffff' }).setOrigin(0.5);
            this.msgBox.add(heading);
            this.home = this.add.sprite(this.cameras.main.width / 2 - 89, this.cameras.main.height / 2 + 31, 'home').setInteractive();
            this.home.setFrame(0);
            this.home.on('pointerdown', function () { return _this.homeEvents(); });
            this.home.on('pointerup', function () { return _this.homeEvents(); });
            this.msgBox.add(this.home);
            this.play = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 + 31, 'playlarge').setInteractive();
            this.play.setFrame(0);
            this.play.on('pointerdown', function () { return _this.playEvents(); });
            this.play.on('pointerup', function () { return _this.playEvents(); });
            this.msgBox.add(this.play);
            this.restart = this.add.sprite(this.cameras.main.width / 2 + 89, this.cameras.main.height / 2 + 31, 'replay').setInteractive();
            this.restart.setFrame(0);
            this.restart.on('pointerdown', function () { return _this.restartEvents(); });
            this.restart.on('pointerup', function () { return _this.restartEvents(); });
            this.msgBox.add(this.restart);
        };
        PauseMessage.prototype.homeEvents = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.home.setFrame(1);
            }
            else {
                this.home.setFrame(0);
                this.events.emit('pause', 'home');
            }
        };
        PauseMessage.prototype.playEvents = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.play.setFrame(1);
            }
            else {
                this.play.setFrame(0);
                this.events.emit('pause', 'play');
            }
        };
        PauseMessage.prototype.restartEvents = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.restart.setFrame(1);
            }
            else {
                this.restart.setFrame(0);
                this.hitPlayApi();
                // this.events.emit('pause', 'restart');
            }
        };
        PauseMessage.prototype.callFunc = function () {
            _global.callcheck();
        };
        PauseMessage.prototype.hitPlayApi = function () {
            var _this = this;
            var self = this;
            var request = new XMLHttpRequest();
            var data = {
                "accessToken": this.model.accessToken,
                "game_id": this.model.id
            };
            request.open("POST", 'http://paarcade.com/api/user_game_scores/gameStart/', true);
            request.setRequestHeader("Content-type", "application/json");
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var obj = JSON.parse(request.response);
                    if (obj.data.status == 1) {
                        _this.callFunc();
                        _this.events.emit('pause', 'restart');
                    }
                    else {
                        console.log('not allowed ');
                    }
                }
            };
            request.send(JSON.stringify(data));
        };
        PauseMessage.prototype.resetData = function (obj) {
            if (obj != null) {
                this.model.gameId = obj.gameId;
                this.model.userId = obj.user_id;
                var level = obj.level.replace(/\,/g, "");
                var star = obj.star.replace(/\,/g, "");
                for (var i = 0; i < level.length; i++) {
                    console.log('numbercheck ', level[i]);
                    if (level[i] == this.model.levelSelectionDetail[i].name) {
                        this.model.levelSelectionDetail[i].detail.star = star[i];
                        if (star[i] != 0) {
                            this.model.levelSelectionDetail[i + 1].lock = false;
                        }
                    }
                }
            }
            this.events.emit('pause', 'restart');
        };
        PauseMessage.prototype.destroy = function () {
            this.events.destroy();
            this.sys.shutdown();
            if (this.time) {
                this.time.clearPendingEvents().removeAllEvents();
            }
            // this.sys.displayList.each(o => o.destroy(true));
            // this.sys.displayList.destroy();
            // this.sys.updateList.destroy();
            this.tweens.destroy();
            this.scene.remove(this);
        };
        return PauseMessage;
    }(Phaser.Scene));
    Snake.PauseMessage = PauseMessage;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var globalVariable = 1;
    var _global = (window);
    var IntroPage = /** @class */ (function (_super) {
        __extends(IntroPage, _super);
        // start: any = 1;
        function IntroPage(handle) {
            var _this = _super.call(this, handle) || this;
            _this.model = Snake.Model.getInstance();
            _this.api = new Snake.SnakeService();
            return _this;
        }
        IntroPage.prototype.preload = function () {
            this.cameras.main.setViewport(0, 0, 900, 640);
            this.load.image('mbg', 'assets/BGScreen.jpg');
            this.load.spritesheet('exit', 'assets/intro/btn_exit.png', { frameWidth: 62, frameHeight: 64 });
            this.load.spritesheet('help', 'assets/intro/btn_help.png', { frameWidth: 62, frameHeight: 64 });
            this.load.spritesheet('play', 'assets/intro/btn_playMenu.png', { frameWidth: 105, frameHeight: 108 });
            this.load.spritesheet('share', 'assets/intro/btn_share.png', { frameWidth: 62, frameHeight: 64 });
            this.load.spritesheet('soundon', 'assets/intro/btn_soundOff.png', { frameWidth: 62, frameHeight: 64 });
            this.load.spritesheet('soundoff', 'assets/intro/btn_soundon.png', { frameWidth: 62, frameHeight: 64 });
        };
        IntroPage.prototype.create = function () {
            var _this = this;
            this.add.image(0, 0, 'mbg').setOrigin(0);
            this.soundOn = this.add.sprite(this.cameras.main.width - 62, 64, 'soundon').setInteractive();
            this.soundOn.on('pointerdown', function () { return _this.soundOnDown(); });
            this.soundOn.on('pointerup', function () { return _this.soundOnDown(); });
            this.soundOn.setFrame(0);
            this.soundOn.visible = false;
            this.soundOff = this.add.sprite(this.cameras.main.width - 62, 64, 'soundoff').setInteractive();
            this.soundOff.on('pointerdown', function () { return _this.soundOffDown(); });
            this.soundOff.on('pointerup', function () { return _this.soundOffDown(); });
            this.soundOff.setFrame(0);
            this.soundOff.visible = false;
            this.help = this.add.sprite(this.cameras.main.width - 62, 140, 'help').setInteractive();
            this.help.on('pointerdown', function () { return _this.helpDown(); });
            this.help.on('pointerup', function () { return _this.helpDown(); });
            this.help.setFrame(0);
            this.help.visible = false;
            this.share = this.add.sprite(this.cameras.main.width - 62, 215, 'share').setInteractive();
            this.share.on('pointerdown', function () { return _this.shareDown(); });
            this.share.on('pointerup', function () { return _this.shareDown(); });
            this.share.setFrame(0);
            this.share.visible = false;
            this.exit = this.add.sprite(this.cameras.main.width - 62, 290, 'exit').setInteractive();
            this.exit.on('pointerdown', function () { return _this.exitDown(); });
            this.exit.on('pointerup', function () { return _this.exitDown(); });
            this.exit.setFrame(0);
            this.exit.visible = false;
            this.play = this.add.sprite(this.cameras.main.width / 2, this.cameras.main.height / 2 + 108, 'play').setInteractive();
            this.play.on('pointerdown', function () { return _this.playDown(); });
            this.play.on('pointerup', function () { return _this.playDown(); });
            this.play.setFrame(0);
        };
        IntroPage.prototype.soundOnDown = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.soundOn.setFrame(1);
            }
            else {
                this.soundOn.setFrame(0);
                this.soundOn.visible = false;
                this.soundOff.visible = true;
                // this.events.emit('side', 'pause');
            }
        };
        IntroPage.prototype.soundOffDown = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.soundOff.setFrame(1);
            }
            else {
                this.soundOff.setFrame(0);
                this.soundOn.visible = true;
                this.soundOff.visible = false;
                // this.events.emit('side', 'pause');
            }
        };
        IntroPage.prototype.shareDown = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.share.setFrame(1);
            }
            else {
                // this.share.setFrame(0);
                this.events.emit('side', 'pause');
            }
        };
        IntroPage.prototype.exitDown = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.exit.setFrame(1);
            }
            else {
                this.exit.setFrame(0);
                // this.events.emit('side', 'pause');
            }
        };
        IntroPage.prototype.helpDown = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.help.setFrame(1);
            }
            else {
                this.help.setFrame(0);
                // this.events.emit('side', 'pause');
            }
        };
        IntroPage.prototype.playDown = function () {
            if (globalVariable == 1) {
                this.evt = event;
                if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                    this.play.setFrame(1);
                }
                else {
                    this.play.setFrame(0);
                    // this.hitPlayApi();
                    this.events.emit('intro', 'play');
                }
            }
        };
        IntroPage.prototype.callFunc = function () {
            _global.callcheck();
        };
        IntroPage.prototype.hitPlayApi = function () {
            var _this = this;
            var self = this;
            var request = new XMLHttpRequest();
            var data = {
                "accessToken": this.model.accessToken,
                "game_id": this.model.id
            };
            request.open("POST", 'http://paarcade.com/api/user_game_scores/gameStart/', true);
            request.setRequestHeader("Content-type", "application/json");
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == 200) {
                    var obj = JSON.parse(request.response);
                    if (obj.data.status == 1) {
                        _this.callFunc();
                        _this.resetData(obj.data.data);
                    }
                    else {
                        console.log('not allowed ');
                    }
                }
            };
            request.send(JSON.stringify(data));
        };
        IntroPage.prototype.resetData = function (obj) {
            if (obj != null) {
                this.model.gameId = obj.gameId;
                this.model.userId = obj.user_id;
                var level = obj.level.replace(/\,/g, "");
                var star = obj.star.replace(/\,/g, "");
                for (var i = 0; i < level.length; i++) {
                    console.log('numbercheck ', level[i]);
                    if (level[i] == this.model.levelSelectionDetail[i].name) {
                        this.model.levelSelectionDetail[i].detail.star = star[i];
                        if (star[i] != 0) {
                            this.model.levelSelectionDetail[i + 1].lock = false;
                        }
                    }
                }
            }
            this.events.emit('intro', 'play');
        };
        IntroPage.prototype.destroy = function () {
            this.events.destroy();
            this.sys.shutdown();
            if (this.time) {
                this.time.clearPendingEvents().removeAllEvents();
            }
            // this.sys.displayList.each(o => o.destroy(true));
            // this.sys.displayList.destroy();
            // this.sys.updateList.destroy();
            this.tweens.destroy();
            this.scene.remove(this);
        };
        return IntroPage;
    }(Phaser.Scene));
    Snake.IntroPage = IntroPage;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Selection = /** @class */ (function (_super) {
        __extends(Selection, _super);
        function Selection(handle) {
            var _this = _super.call(this, handle) || this;
            _this.starArr = [];
            _this.unlock = true;
            _this.model = Snake.Model.getInstance();
            return _this;
        }
        Selection.prototype.preload = function () {
            this.count = 0;
            this.cameras.main.setViewport(0, 0, 900, 640);
            this.load.image('levelbg', 'assets/level/bglevel.png');
            this.load.image('leveldetailbg', 'assets/level/leveldetail.png');
            this.load.image('titlelvl', 'assets/level/titlelvl.png');
            this.load.spritesheet('star', 'assets/level/level_star.png', { frameWidth: 44, frameHeight: 40 });
            this.load.spritesheet('btnhome', 'assets/level/btn_home.png', { frameWidth: 62, frameHeight: 64 });
            this.load.spritesheet('navleft', 'assets/level/navleft.png', { frameWidth: 50, frameHeight: 81 });
            this.load.spritesheet('navright', 'assets/level/navright.png', { frameWidth: 50, frameHeight: 81 });
            this.load.spritesheet('playsmall', 'assets/popups/play_small.png', { frameWidth: 59, frameHeight: 62 });
        };
        Selection.prototype.create = function () {
            var _this = this;
            this.add.image(0, 0, 'levelbg').setOrigin(0);
            this.lvlbg = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'leveldetailbg');
            this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 250, 'titlelvl');
            this.home = this.add.sprite(this.cameras.main.width - 50, 50, 'btnhome').setInteractive();
            this.home.setFrame(0);
            this.home.on('pointerdown', function () { return _this.homeDown(); });
            this.home.on('pointerup', function () { return _this.homeDown(); });
            this.left = this.add.sprite(this.cameras.main.width / 2 - 275, this.cameras.main.height / 2, 'navleft').setInteractive();
            this.left.setFrame(0);
            this.left.on('pointerdown', function () { return _this.leftDown(); });
            this.left.on('pointerup', function () { return _this.leftDown(); });
            this.right = this.add.sprite(this.cameras.main.width / 2 + 275, this.cameras.main.height / 2, 'navright').setInteractive();
            this.right.setFrame(0);
            this.right.on('pointerdown', function () { return _this.rightDown(); });
            this.right.on('pointerup', function () { return _this.rightDown(); });
            if (this.count == 0) {
                this.left.setFrame(2);
            }
            this.model.currentLevelData = this.model.levelSelectionDetail[0];
            this.container = this.add.container(this.lvlbg.x - this.lvlbg.width / 2, this.lvlbg.y - this.lvlbg.height / 2);
            this.addLevels();
        };
        Selection.prototype.addLevels = function () {
            var _this = this;
            this.lvl = this.add.text(80, 60, this.model.levelSelectionDetail[0].detail.name, { fontSize: '30px', fontFamily: 'CarterOne', fill: '#ffffff' }); //Bold'
            this.container.add(this.lvl);
            var x = 305;
            for (var k = 0; k < 3; k++) {
                this.star = this.add.sprite(x, 80, 'star').setInteractive();
                this.star.setFrame(1);
                this.container.add(this.star);
                x = x + 50;
                this.starArr.push(this.star);
            }
            if (this.model.levelSelectionDetail[0].detail.star != 0) {
                for (var i = 0; i < this.model.levelSelectionDetail[0].detail.star; i++) {
                    this.starArr[i].setFrame(0);
                }
            }
            var trgt = this.add.text(80, 175, 'Target', { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' });
            this.container.add(trgt);
            this.trgtnumber = this.add.text(300, 175, this.model.levelSelectionDetail[0].detail.target, { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' });
            this.container.add(this.trgtnumber);
            var time = this.add.text(80, 225, 'Time', { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' });
            this.container.add(time);
            this.timenumber = this.add.text(300, 225, this.model.levelSelectionDetail[0].detail.time + ' sec', { fontSize: '20px', fontFamily: 'CarterOne', fill: '#ffffff' });
            this.container.add(this.timenumber);
            this.btn = this.add.sprite(this.lvlbg.width / 2, this.lvlbg.height - 75, 'playsmall').setInteractive();
            this.btn.setFrame(0);
            this.btn.name = this.model.levelSelectionDetail[0].name;
            this.container.add(this.btn);
            this.btn.on('pointerdown', function () { return _this.playBtnEvent(); });
            this.btn.on('pointerup', function () { return _this.playBtnEvent(); });
        };
        Selection.prototype.playBtnEvent = function () {
            this.evt = event;
            if (this.unlock == true) {
                if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                    this.btn.setFrame(1);
                }
                else {
                    this.btn.setFrame(0);
                    this.events.emit('play', this.btn.name);
                }
            }
            else {
                console.log(this.unlock);
            }
        };
        Selection.prototype.homeDown = function () {
            this.evt = event;
            if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                this.home.setFrame(1);
            }
            else {
                this.home.setFrame(0);
                this.events.emit('play', 'home');
            }
        };
        Selection.prototype.leftDown = function () {
            if (this.count == 0) {
                this.left.setFrame(2);
            }
            else {
                this.evt = event;
                if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                    this.left.setFrame(1);
                }
                else {
                    this.left.setFrame(0);
                    this.count--;
                    this.getLevel();
                }
            }
        };
        Selection.prototype.rightDown = function () {
            if (this.count == this.model.levelSelectionDetail.length - 1) {
                this.right.setFrame(2);
            }
            else {
                this.evt = event;
                if (this.evt.type == 'mousedown' || this.evt.type == 'touchstart') {
                    this.right.setFrame(1);
                }
                else {
                    this.right.setFrame(0);
                    this.count++;
                    this.getLevel();
                }
            }
        };
        Selection.prototype.getLevel = function () {
            if (this.count == this.model.levelSelectionDetail.length - 1) {
                this.right.setFrame(2);
            }
            else {
                this.right.setFrame(0);
            }
            if (this.count == 0) {
                this.left.setFrame(2);
            }
            else {
                this.left.setFrame(0);
            }
            for (var k = 0; k < this.model.levelSelectionDetail.length; k++) {
                if (k == this.count) {
                    this.model.currentLevelData = this.model.levelSelectionDetail[k];
                }
            }
            this.lvlUpdate(this.model.currentLevelData);
        };
        Selection.prototype.lvlUpdate = function (data) {
            this.lvl.text = data.detail.name;
            this.trgtnumber.text = data.detail.target;
            this.timenumber.text = data.detail.time + ' sec';
            if (data.detail.star != 0) {
                for (var i = 0; i < data.detail.star; i++) {
                    console.log('detail star if ', data.detail.star);
                    this.starArr[i].setFrame(0);
                }
            }
            else {
                for (var i = 0; i < this.starArr.length; i++) {
                    console.log('detail star else ', data.detail.star);
                    this.starArr[i].setFrame(1);
                }
            }
            this.btn.name = data.name;
            if (data.lock == true) {
                this.unlock = false;
                this.btn.setFrame(1);
            }
            else {
                this.unlock = true;
                this.btn.setFrame(0);
            }
        };
        Selection.prototype.refreshLevels = function () {
            for (var k = 0; k < this.model.levelSelectionDetail.length; k++) {
                for (var i = 0; i < this.model.levelSelectionDetail[k].detail.star; i++) {
                    this.starArr[i].setFrame(0);
                }
            }
        };
        Selection.prototype.destroy = function () {
            this.events.destroy();
            this.sys.shutdown();
            if (this.time) {
                this.time.clearPendingEvents().removeAllEvents();
            }
            // this.sys.displayList.each(o => o.destroy(true));
            // this.sys.displayList.destroy();
            // this.sys.updateList.destroy();
            this.tweens.destroy();
            this.scene.remove(this);
        };
        return Selection;
    }(Phaser.Scene));
    Snake.Selection = Selection;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    var Stages = /** @class */ (function (_super) {
        __extends(Stages, _super);
        function Stages(handle) {
            return _super.call(this, handle) || this;
        }
        Stages.prototype.preload = function () {
        };
        Stages.prototype.create = function () {
            this.container = this.add.container(0, 0);
        };
        return Stages;
    }(Phaser.Scene));
    Snake.Stages = Stages;
})(Snake || (Snake = {}));
var Snake;
(function (Snake) {
    // import * as request from 'request';
    var _global = (window);
    var SnakeService = /** @class */ (function () {
        function SnakeService() {
            this.request = new XMLHttpRequest();
            this.model = Snake.Model.getInstance();
        }
        SnakeService.prototype.callScore = function () {
            _global.callScore();
        };
        SnakeService.prototype.updateHighScore = function (score, gameid, token) {
            var _this = this;
            var data = {
                "accessToken": token,
                "score": score,
                "game_id": gameid,
                "level": this.model.currentLevelData.name,
                "star": this.model.currentLevelData.detail.star,
            };
            this.request.open("POST", 'http://paarcade.com/api/user_game_scores/updateScore/', true);
            this.request.setRequestHeader("Content-type", "application/json");
            this.request.onreadystatechange = function () {
                if (_this.request.readyState == 4 && _this.request.status == 200) {
                    console.log('check'); //.responseText;
                    _this.callScore();
                }
            };
            //  = function(e: any) {
            //     alert(this.request.readyState + "" + this.request.status);
            // }  
            this.request.send(JSON.stringify(data));
        };
        SnakeService.prototype.complete = function (evt) {
            console.log(evt);
        };
        SnakeService.prototype.playGame = function () {
            var data = {
                "accessToken": this.model.accessToken,
                "game_id": this.model.gameId
            };
            console.log('playgame ', JSON.stringify(data));
            this.request.open("POST", 'http://paarcade.com/api/user_game_scores/gameStart/', true);
            this.request.setRequestHeader("Content-type", "application/json");
            return this.request.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log('check ', this.response); //.responseText;
                    return this.response;
                }
            };
            this.request.send(JSON.stringify(data));
        };
        return SnakeService;
    }());
    Snake.SnakeService = SnakeService;
})(Snake || (Snake = {}));
