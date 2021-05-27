
/* Задание 1 */
// Record 1
// Record 5
// Record 6
// Record 2
// Record 3
// Record 4

/* Задание 2 */
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

    let seconds = Math.round((date.getTime() - Date.now()) / 1000);

    return function foo() {
        seconds--;
        if( seconds > 0){
            console.log("Timer " + id + ": " + seconds);
            setTimeout(foo, 1000);
        } else{
            console.log("Timer " + id + ": завершил работу")
        }
    }
}

function main() {
    for(let i = 2; i < process.argv.length; i++){
        setTimeout(Timer(i-1, process.argv[i]));
    }
}

main();
