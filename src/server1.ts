import http from 'http' 

import { SERVER_ONE_PORT } from './constants';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end("Response from Server 1");
}) 

server.listen(SERVER_ONE_PORT, () => { 
    console.log(`Server 1 is running on http://localhost:${SERVER_ONE_PORT}`)
})
