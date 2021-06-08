
const http = require('http');
const url = require('url');
const fs = require('fs');

http.createServer((request, response) => {
    if (request.method === 'GET') {
        const queryParams = url.parse(request.url, true).query;
        response.writeHead(200, { 'Content-Type': 'text/html'});

        if (queryParams.path === undefined){
            response.end('The path parameter was not passed in the request');
            return;
        }

        if (!fs.existsSync(queryParams.path)){
            response.end('This path does not exist in the server file system');
            return;
        }

        if (!fs.lstatSync(queryParams.path).isFile()){
            response.end(fs.readdirSync(queryParams.path).join('<br>'));
            return;
        }

        fs.createReadStream(queryParams.path).pipe(response);
    }
    else{
        response.writeHead(405, { 'Content-Type': 'text/html'});
        response.end('POST method is not supported');
    }
}).listen(3000, 'localhost');