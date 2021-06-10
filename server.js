const io = require('socket.io');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = http.createServer((request, response) => {
    if (request.method === 'GET') {
        const filePath = path.join(__dirname, 'index.html');
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(response);
    } else if (request.method === 'POST') {
        let data = '';
        request.on('data', chunk => {
            data += chunk;
        });
        request.on('end', () => {
            const parsedData = JSON.parse(data);
            console.log(parsedData);
            response.writeHead(200, { 'Content-Type': 'json'});
            response.end(data);
        });
    } else {
        response.statusCode = 405;
        response.end();
    }
});

let clients = 1;

const socket = io(app);
socket.on('connection', function (socket) {
    const id = clients++;
    socket.emit('SERVER_ID', { id: id });
    socket.broadcast.emit('NEW_CONN_EVENT', { msg: 'user_' + id + ': ' + 'connected' });

    socket.on('CLIENT_MSG', (data) => {
        socket.broadcast.emit('SERVER_MSG', { msg: 'user_' + data.id + ': ' + data.msg });
    });
});

app.listen(3000, 'localhost');