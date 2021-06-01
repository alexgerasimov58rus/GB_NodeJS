
/* Задание 1 */
// Record 1
// Record 5
// Record 6
// Record 2
// Record 3
// Record 4

/* Задание 2 */
const events = require('events');

const source = new events.EventEmitter();

function parseDate(strDate) {
    const arr = strDate.split('-');
    if( arr.length !== 4) return null;

    const hour   = Number.parseInt(arr[0]);
    const day    = Number.parseInt(arr[1]);
    const month  = Number.parseInt(arr[2]) ;
    const year   = Number.parseInt(arr[3]) ;

    if (isNaN(hour) ||
        isNaN(day) ||
        isNaN(month) ||
        isNaN(year)) return null;

    return new Date(year, month-1, day, hour);
}

function Timer(id, strDate){
    let date = parseDate(strDate);
    if( date === null) return;

    let mSeconds = Math.round((date.getTime() - Date.now())/1000) * 1000;

    return function foo(deltaMSeconds) {
        mSeconds -= deltaMSeconds;

        if( mSeconds > 0){
            console.log("Timer " + id + ": " + Math.round(mSeconds / 1000));
        } else{
            console.log("Timer " + id + ": завершил работу")
            return true;
        }

        return false;
    }
}

const timers = [];
let idTimer = 0;
let timePrev;

main();

function main() {
    for(let i = 2; i < process.argv.length; i++){
        const timer = Timer(i-1, process.argv[i]);
        if (timer !== null){
            timers.push(timer);
        }
    }

    source.on('update', (deltaMSeconds)=>{
        for (let i=0; i < timers.length; i++){
            if( timers[i](deltaMSeconds)){
                timers.splice(i, 1);
                i--;
            }
        }
    });

    timePrev = Date.now();
    idTimer = setInterval(updateInterval, 1000);
}

function updateInterval() {
    if( timers.length === 0){
        clearInterval(idTimer);
        return;
    }

    const deltaMSeconds = Date.now() - timePrev;
    timePrev = Date.now();

    source.emit('update', deltaMSeconds);
}



