module Snake {
export class Levels {
    
    levels = [
        {
                name:'1',
                list : []
        },
        {
            name:'2',
            list : [ 
                {
                    type:'col',
                    index:{ start:{ x:5, y:3 },
                            end:{ x:5, y:8 },
                    } 
                },
                {
                    type:'col',
                    index:{ start:{ x:18, y:3 },
                            end:{ x:18, y:8 },
                    } 
                },
            
            ]
        },
        {
            name:'3',
            list : [ 
                {
                    type:'row',
                    index:{ start:{ x:6, y:8 },
                            end:{ x:17, y:8 },
                    } 
                },
                {
                    type:'row',
                    index:{ start:{ x:6, y:3 },
                            end:{ x:17, y:3 },
                    } 
                }
                
            ]
        },
        {
            name:'4',
            list : [ 
                {
                    type:'col',
                    index:{ start:{ x:6, y:5 },
                            end:{ x:6, y:6 },
                    } 
                },
                {
                    type:'col',
                    index:{ start:{ x:17, y:5 },
                            end:{ x:17, y:6 },
                    } 
                },
                {
                    type:'row',
                    index:{ start:{ x:9, y:10 },
                            end:{ x:14, y:10 },
                    } 
                },
                {
                    type:'row',
                    index:{ start:{ x:9, y:1 },
                            end:{ x:14, y:1 },
                    } 
                }
            ]
        },
        {
            name:'5',
            list : [ 
                {
                    type:'col',
                    index:{ start:{ x:11, y:4 },
                            end:{ x:11, y:8 },
                    } 
                },
                {
                    type:'row',
                    index:{ start:{ x:8, y:6 },
                            end:{ x:14, y:6 },
                    } 
                },
            ]
        },
        {
            name:'6',
            list : [ 
            {
                type:'col',
                index:{ start:{ x:0, y:1 },
                        end:{ x:0, y:2 },
                } 
            },
            {
                type:'row',
                index:{ start:{ x:0, y:0 },
                        end:{ x:2, y:0 },
                } 
            },
            {
                type:'col',
                index:{ start:{ x:23, y:0 },
                        end:{ x:23, y:2 },
                } 
            },
            {
                type:'row',
                index:{ start:{ x:21, y:0 },
                        end:{ x:22, y:0 },
                } 
            },
            {
                type:'col',
                index:{ start:{ x:0, y:9 },
                        end:{ x:0, y:11 },
                } 
            },
            {
                type:'row',
                index:{ start:{ x:1, y:11 },
                        end:{ x:2, y:11 },
                } 
            },
            {
                type:'col',
                index:{ start:{ x:23, y:9 },
                        end:{ x:23, y:11 },
                } 
            },
            {
                type:'row',
                index:{ start:{ x:21, y:11 },
                        end:{ x:22, y:11 },
                } 
            },
            ]
        },
        {
            name:'7',
            list : [ 
                {
                    type:'col',
                    index:{ start:{ x:0, y:4 },
                            end:{ x:0, y:7 },
                    } 
                },
                {
                    type:'col',
                    index:{ start:{ x:23, y:4 },
                            end:{ x:23, y:7 },
                    } 
                },
                {
                    type:'row',
                    index:{ start:{ x:9, y:0 },
                            end:{ x:14, y:0 },
                    } 
                },
                {
                    type:'row',
                    index:{ start:{ x:9, y:11 },
                            end:{ x:14, y:11 },
                    } 
                }
            ]
        },
        {
            name:'8',
            list : [ 
            {
                type:'col',
                index:{ start:{ x:0, y:1 },
                        end:{ x:0, y:11 },
                } 
            },
            {
                type:'col',
                index:{ start:{ x:23, y:1 },
                        end:{ x:23, y:11 },
                } 
            },
            {
                type:'row',
                index:{ start:{ x:0, y:11 },
                        end:{ x:23, y:11 },
                } 
            },
            {
                type:'row',
                index:{ start:{ x:0, y:0 },
                        end:{ x:23, y:0 },
                } 
            },
            ]
        }
    ]
    
    constructor() { }
}
}