export function  GenerateNodeId():string{
    const timespamp=new Date();
    return 'n'+ Math.floor(timespamp.getTime()+Math.random()*100).toString()
}

export function  GenerateConnectionId():string{
    const timespamp=new Date();
    return 'c'+ Math.floor(timespamp.getTime()+Math.random()*100).toString()
}