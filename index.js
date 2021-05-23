
const colors = require("colors/safe");

main();

function main() {
    let range = [];
    if (checkInputArgumentsAndInitRange(range)){
        let countSimpleNumbers = 0;
        for(let i = range[0]; i <= range[1] && countSimpleNumbers < 3; i++){
            if( isPrime(i)){
                switch (countSimpleNumbers % 3) {
                    case 0: console.log(colors.green(i)); break;
                    case 1: console.log(colors.yellow(i)); break;
                    case 2: console.log(colors.red(i)); break;
                }
                countSimpleNumbers++;
            }
        }

        if( countSimpleNumbers === 0){
            console.log(colors.red("В заданном диапазоне нет простых чисел"));
        }
    }
}

function isPrime(v) {
    if(v < 2) return false;

    let n = Math.floor(Math.sqrt(v + 0.5));
    for (let i = 2; i <= n; i++) {
        if( v % i === 0) {
            return false;
        }

    }

    return true;
}

function checkInputArgumentsAndInitRange(range) {
    if( process.argv.length !== 4 ){
        console.error("Вы не передали диапазон при вызове скрипта");
        return false;
    }
    let a = Number.parseInt(process.argv[2]);
    let b = Number.parseInt(process.argv[3]);

    if( isNaN(a) || isNaN(b) || a < 0 || b < 0){
        console.error("Вы передали некорректные параметры при вызове скрипта. Скрипт принимет на вход 2 положительных числа");
        return false;
    }

    range[0] = Math.min(a, b);
    range[1] = Math.max(a, b);
    return true;
}