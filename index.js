
const yargs = require("yargs");
const fs = require('fs');
const inquirer = require("inquirer");
const path = require("path");
const { Transform } = require('stream');

class FindStringTransform extends Transform {
    constructor(mask){
        super();
        this.mask = mask;
        this.buff = [];
    }
    _transform(chunk, encoding, callback) {
        let str = chunk.toString();
        for(let s of str){
            if( s === "\n"){
                this.buff.push(s);
                let line = this.buff.join('');
                if( line.indexOf(this.mask) !== -1){
                    this.push(line);
                }
                this.buff = [];
            }
            else{
                this.buff.push(s);
            }
        }
        callback();
    }
}

function parseFile(filePath) {
    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    const myParse = new FindStringTransform(options.search);
    const myLog = fs.createWriteStream('./data/' + options.search + '_requests.log', { encoding: 'utf8' });
    readStream.pipe(myParse).pipe(myLog);
}

function main(selectPath) {
    if (fs.lstatSync(selectPath).isFile()){
        parseFile(selectPath);
        return;
    }

    const list = fs.readdirSync(selectPath);

    inquirer
        .prompt([{
            name: "name",
            type: "list",
            message: "Choose file or dir:",
            choices: list,
        }])
        .then((answer) => {
            main(path.join(selectPath, answer.name));
        })
        .catch((error) => console.log(error))
}

const options = yargs
    .usage("Usage: -p <path> -s <search>")
    .option("p", {
        alias: "path",
        describe: "Path to file or dir",
        type: "string",
        demandOption: true
    })
    .option("s", {
        alias: "search",
        describe: "Search string",
        type: "string",
        demandOption: true
    })
    .argv;

main(options.path);


