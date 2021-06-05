
const fs = require('fs');
const { Transform } = require('stream');
const yargs = require("yargs");
const objPath = require("path");
const inquirer = require("inquirer");

function selectFile (path) {
    if (fs.lstatSync(path).isFile()){
        return path;
    }

    const list = fs.readdirSync(path);

    inquirer
        .prompt([{
            name: "fileName",
            type: "list",
            message: "Choose file:",
            choices: list,
        }])
        .then((answer) => {
            selectFile(objPath.join(path, answer.fileName));
        })
        .catch((error) => console.log(error));
}

class MyTransform extends Transform {
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

const options = yargs
    .usage("Usage: -d <directory> -s <search>")
    .option("d", {
        alias: "dir",
        describe: "Path to dir",
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

const filePath = selectFile(options.dir);
const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

const myParse = new MyTransform(options.search);
const myLog = fs.createWriteStream('./data/' + options.search + '_requests.log', { encoding: 'utf8' });

readStream.pipe(myParse).pipe(myLog);

