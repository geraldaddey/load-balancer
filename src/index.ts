import http from 'http'; 
import httpProxy from 'http-proxy'; 

import { SERVER_ONE_PORT, SERVER_TWO_PORT } from './constants';

// List of servers 
const allServers = [ 
    `http://localhost:${SERVER_ONE_PORT}`,
    `http://localhost:${SERVER_TWO_PORT}`
]

let healthyServers = [...allServers]
let currentServer = 0

// use proxy server as the load balancer
const proxy = httpProxy.createProxyServer({});

// check health of server
function checkServerHealth(server: string) { 
    return new Promise((resolve) => { 
        http
            .get(server,(res) => { 
                if (res.statusCode === 200) { 
                    resolve(true)
                } else { 
                    resolve(false)
                }
            })
            .on('error', () => {
                resolve(false)
            })
    })
}

async function healthChecks(){ 
    const status  = await Promise.all(allServers.map(checkServerHealth))
    healthyServers = allServers.filter((_, index) => status[index])
}

// health check every 10 seconds
setInterval( () => { 
    healthChecks()
    .then(() => {
     console.log("Operation: Health Check \n Healthy Servers: ", healthyServers)   
    })
    .catch ((err) => { 
        console.log("Operation: Health Check \n Status: Failed", err);
    })
    
}, 10000)


// Using Round Robin Algorithm
function getNextServer(){ 
    if (healthyServers.length === 0) return null
    
    const server = healthyServers[currentServer % healthyServers.length]
    currentServer = (currentServer + 1) % healthyServers.length
    return server
}


const server = http.createServer((req, res) => {
const next = getNextServer() 

if (next){ 
    proxy.web(req, res, {target: next})
} else { 
    res.writeHead(502) //Bad Gateway
    res.end("No healthy server to handle the request")
}
})

console.log('Load Balancer is running on port 3000')
server.listen( 3000 )
