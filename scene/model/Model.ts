module Snake{
    export class Model{
        
        private static instance: Model;
        levelSelectionDetail = [
            {
                name: '1',
                add: 1,
                lock: false,
                detail: { name: 'Level:1', target:15, star: 0, time: 90 , clear: true, foodx: 15, foody: 10, snakex: 2, snakey: 2 }
            },
            {
                name: '2',
                add: 2,
                lock: true,
                detail: { name: 'Level:2', target:20, star: 0, time: 120 , clear: false, foodx: 7, foody: 8, snakex: 1, snakey: 1 }
            },
            {
                name: '3',
                add: 3,
                lock: true,
                detail: { name: 'Level:3', target:25, star: 0, time: 150 , clear: false, foodx: 3, foody: 4, snakex: 5, snakey: 5 }
            },
            {
                name: '4',
                add: 4,
                lock: true,
                detail: { name: 'Level:4', target:30, star: 0, time: 180 , clear: false, foodx: 11, foody: 6, snakex: 1, snakey: 2 }
            },
            {
                name: '5',
                add: 5,
                lock: true,
                detail: { name: 'Level:5', target:35, star: 0, time: 210 , clear: false, foodx: 18, foody: 3, snakex: 3, snakey: 0 }
            },
            {
                name: '6',
                add: 6,
                lock: true,
                detail: { name: 'Level:6', target:40, star: 0, time: 240 , clear: false, foodx: 3, foody: 4, snakex: 8, snakey: 8 }
            },
            {
                name: '7',
                add: 7,
                lock: true,
                detail: { name: 'Level:7', target:45, star: 0, time: 270 , clear: false, foodx: 3, foody: 4, snakex: 8, snakey: 8 }
            },
            {
                name: '8',
                add: 8,
                lock: true,
                detail: { name: 'Level:8', target:50, star: 0, time: 300 , clear: false, foodx: 3, foody: 4, snakex: 8, snakey: 8 }
            }
        ]

        userId: any;
        currentLevelData: any;
        currentScore: any = 0;
        currentTarget: any = 0;
        id: any = 0;
        accessToken : any = 'vkIy3PM7IKHBKCqZruKUf1bvxpnm3elREgaEWZot1bYp4XyQVHCdCqYtJpnGe39p';
        globalVariable: any = 1;
        constructor() { }
        
        returnGameId() {
            return this.id;
        }
        
        globalFunc(start: any) {
            this.globalVariable = start;
            console.log('check for start ', start)
        }
        static getInstance() {
            if (!Model.instance) {
              Model.instance = new Model();
            }
            return Model.instance;
        }


    }
}