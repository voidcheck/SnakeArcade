module Snake {
// import * as request from 'request';
const _global = (window) as any;
    export class SnakeService {
        
        request: any;  model: any;
        
        constructor() {
            this.request = new XMLHttpRequest();
            this.model = Model.getInstance();
        }
        callScore() {
            _global.callScore();
        }
        updateHighScore( score: string, gameid: any, token: any ) {

            let data: any = {
                    "accessToken":token,
                    "score":score,
                    "game_id":gameid,
                    "level":this.model.currentLevelData.name,
                    "star":this.model.currentLevelData.detail.star,
            }
                
                this.request.open("POST",'http://paarcade.com/api/user_game_scores/updateScore/', true)
                this.request.setRequestHeader("Content-type", "application/json");
                this.request.onreadystatechange = () => {
                    if (this.request.readyState == 4 && this.request.status == 200) {
                        console.log('check')//.responseText;
                        this.callScore()
                    }
                };
                //  = function(e: any) {
                //     alert(this.request.readyState + "" + this.request.status);
                // }  
                this.request.send(JSON.stringify(data));
        }

        complete(evt: any) {
            console.log(evt)
        }

        playGame() {
            
            let data: any = {
                    "accessToken":this.model.accessToken,
                    "game_id":this.model.gameId
            }
            console.log('playgame ', JSON.stringify(data))
                this.request.open("POST",'http://paarcade.com/api/user_game_scores/gameStart/', true)
                this.request.setRequestHeader("Content-type", "application/json");
                return this.request.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log('check ', this.response)//.responseText;
                        return this.response;
                       }
                };
                this.request.send(JSON.stringify(data));
        }

    }
}