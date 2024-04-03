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
