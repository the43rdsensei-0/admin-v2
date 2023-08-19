export default function setTimer(timeInMins:number) {
    return new Promise<string>((resolve, reject)=> {
        let mins = timeInMins - 1;
        let secs = 10;

        const timer = setInterval(()=> {
            secs = secs - 1;

            if(mins === 0 && secs === 0) {
                clearInterval(timer)
                resolve('done');
            }

            if(secs === 0 && mins > 0) {
                mins = mins - 1;
                secs = 60;
            }

            console.log(`${mins}:${secs}`)
        }, 1000)
    })
}