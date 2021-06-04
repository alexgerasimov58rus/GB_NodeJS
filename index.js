const fs = require('fs');
const { Transform } = require('stream');
const yargs = require("yargs");
const path = require("path");

const options = yargs
    .usage("Usage: -p <path>")
    .option("d", {
        alias: "dir",
        describe: "Path to dir",
        type: "string",
        demandOption: true
    })
    .option("s", {
        alias: "string",
        describe: "Search string",
        type: "string",
        demandOption: true
    })
    .argv;

const filePath = "";



const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });

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

const parse_89_123_1_41 = new MyTransform('89.123.1.41');
const parse_34_48_240_111 = new MyTransform('34.48.240.111');

const log_89_123_1_41 = fs.createWriteStream('./data/89.123.1.41_requests.log', { encoding: 'utf8' });
const log_34_48_240_111 = fs.createWriteStream('./data/34.48.240.111_requests.log', { encoding: 'utf8' });

readStream.pipe(parse_89_123_1_41).pipe(log_89_123_1_41);
readStream.pipe(parse_34_48_240_111).pipe(log_34_48_240_111);
